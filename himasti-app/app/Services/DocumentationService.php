<?php

namespace App\Services;

use App\Models\Documentation;
use App\Models\DocumentationImage;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class DocumentationService
{
    public function __construct(private readonly MediaService $mediaService) {}

    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return Documentation::query()
            ->with(['images', 'workProgram.division'])
            ->withCount('images')
            ->when($filters['search'] ?? null, function (Builder $query, $search) {
                $query->where(function (Builder $nested) use ($search) {
                    $nested
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->when($filters['year'] ?? null, fn (Builder $query, $year) => $query->whereYear('event_date', $year))
            ->when($filters['work_program_id'] ?? null, fn (Builder $query, $workProgramId) => $query->where('work_program_id', $workProgramId))
            ->latest('event_date')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data, ?UploadedFile $coverImage, array $images = [], array $captions = []): Documentation
    {
        return DB::transaction(function () use ($data, $coverImage, $images, $captions) {
            $data['cover_image'] = $this->mediaService->store($coverImage, 'documentations/covers');
            $documentation = Documentation::query()->create($data);
            $this->syncImages($documentation, [], $images, $captions);

            return $documentation->fresh(['images']);
        });
    }

    public function update(
        Documentation $documentation,
        array $data,
        ?UploadedFile $coverImage,
        array $existingImageIds = [],
        array $existingCaptions = [],
        array $existingOrders = [],
        array $newImages = [],
        array $newCaptions = []
    ): Documentation {
        return DB::transaction(function () use ($documentation, $data, $coverImage, $existingImageIds, $existingCaptions, $existingOrders, $newImages, $newCaptions) {
            $data['cover_image'] = $this->mediaService->replace($coverImage, $documentation->cover_image, 'documentations/covers');
            $documentation->fill($data)->save();

            $this->syncImages($documentation, $existingImageIds, $newImages, $newCaptions, $existingCaptions, $existingOrders);

            return $documentation->fresh(['images']);
        });
    }

    public function delete(Documentation $documentation): void
    {
        DB::transaction(function () use ($documentation) {
            $this->mediaService->delete($documentation->cover_image);
            foreach ($documentation->images as $image) {
                $this->mediaService->delete($image->image);
                $image->delete();
            }

            $documentation->delete();
        });
    }

    private function syncImages(
        Documentation $documentation,
        array $existingImageIds,
        array $newImages,
        array $newCaptions,
        array $existingCaptions = [],
        array $existingOrders = []
    ): void {
        /** @var \Illuminate\Support\Collection<int, DocumentationImage> $currentImages */
        $currentImages = $documentation->images()->get()->keyBy('id');
        $keepIds = collect($existingImageIds)->map(fn ($id) => (int) $id)->all();

        foreach ($currentImages as $imageId => $image) {
            if (! in_array((int) $imageId, $keepIds, true)) {
                $this->mediaService->delete($image->image);
                $image->delete();
                continue;
            }

            $image->caption = $existingCaptions[$imageId] ?? $image->caption;
            $image->order_number = isset($existingOrders[$imageId]) ? (int) $existingOrders[$imageId] : $image->order_number;
            $image->save();
        }

        foreach ($newImages as $index => $newImage) {
            if (! $newImage instanceof UploadedFile) {
                continue;
            }

            DocumentationImage::query()->create([
                'documentation_id' => $documentation->id,
                'image' => $this->mediaService->store($newImage, 'documentations/images'),
                'caption' => $newCaptions[$index] ?? null,
                'order_number' => $currentImages->count() + $index,
            ]);
        }
    }
}
