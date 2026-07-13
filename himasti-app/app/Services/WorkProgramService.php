<?php

namespace App\Services;

use App\Models\WorkProgram;
use App\Support\OrderNumberManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WorkProgramService
{
    public function __construct(
        private readonly MediaService $mediaService,
        private readonly OrderNumberManager $orderNumberManager
    ) {}

    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return $this->applyFilters(
            WorkProgram::query()->with(['division']),
            $filters
        )
            ->orderByDesc('year')
            ->orderBy('order_number')
            ->orderBy('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function listForOrdering(): Collection
    {
        return WorkProgram::query()
            ->with('division:id,name')
            ->orderBy('order_number')
            ->orderBy('id')
            ->get(['id', 'division_id', 'name', 'slug', 'cover_image', 'status', 'year', 'order_number', 'is_published']);
    }

    public function create(array $data, ?UploadedFile $coverImage): WorkProgram
    {
        return DB::transaction(function () use ($data, $coverImage) {
            $data = $this->orderNumberManager->appendIfMissing($data, WorkProgram::class);
            $data['slug'] = $this->generateUniqueSlug($data['slug'] ?? null, $data['name']);
            $data['cover_image'] = $this->mediaService->store($coverImage, 'work-programs');

            return WorkProgram::query()->create($data)->load('division');
        });
    }

    public function update(WorkProgram $workProgram, array $data, ?UploadedFile $coverImage): WorkProgram
    {
        return DB::transaction(function () use ($workProgram, $data, $coverImage) {
            $data['slug'] = $this->generateUniqueSlug($data['slug'] ?? null, $data['name'], $workProgram->id);
            $data['cover_image'] = $this->mediaService->replace($coverImage, $workProgram->cover_image, 'work-programs');
            $workProgram->fill($data)->save();

            return $workProgram->fresh(['division']);
        });
    }

    public function delete(WorkProgram $workProgram): void
    {
        DB::transaction(function () use ($workProgram) {
            $this->mediaService->delete($workProgram->cover_image);
            $workProgram->documentations()->update(['work_program_id' => null]);
            $workProgram->delete();
        });
    }

    public function reorder(array $ids): void
    {
        $this->orderNumberManager->reorder(WorkProgram::class, $ids);
    }

    public function applyFilters(Builder $query, array $filters = []): Builder
    {
        return $query
            ->when($filters['search'] ?? null, function (Builder $builder, string $search) {
                $builder->where(function (Builder $nested) use ($search) {
                    $nested
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($filters['division_id'] ?? null, fn (Builder $builder, $divisionId) => $builder->where('division_id', $divisionId))
            ->when($filters['year'] ?? null, fn (Builder $builder, $year) => $builder->where('year', $year))
            ->when($filters['status'] ?? null, fn (Builder $builder, $status) => $builder->where('status', $status))
            ->when(($filters['is_published'] ?? '') !== '', fn (Builder $builder) => $builder->where('is_published', filter_var($filters['is_published'], FILTER_VALIDATE_BOOL)))
            ->when(($filters['is_featured'] ?? '') !== '', fn (Builder $builder) => $builder->where('is_featured', filter_var($filters['is_featured'], FILTER_VALIDATE_BOOL)));
    }

    private function generateUniqueSlug(?string $slug, string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($slug ?: $name);
        $baseSlug = $baseSlug !== '' ? $baseSlug : 'program-kerja';
        $candidate = $baseSlug;
        $counter = 2;

        while (
            WorkProgram::query()
                ->when($ignoreId, fn (Builder $builder) => $builder->where('id', '!=', $ignoreId))
                ->where('slug', $candidate)
                ->exists()
        ) {
            $candidate = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $candidate;
    }
}
