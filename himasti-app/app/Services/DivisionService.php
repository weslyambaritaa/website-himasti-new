<?php

namespace App\Services;

use App\Models\Division;
use App\Support\OrderNumberManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class DivisionService
{
    public function __construct(
        private readonly MediaService $mediaService,
        private readonly OrderNumberManager $orderNumberManager
    ) {}

    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return Division::query()
            ->withCount(['members', 'workPrograms'])
            ->when($filters['search'] ?? null, fn (Builder $query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->when(($filters['is_active'] ?? '') !== '', fn (Builder $query) => $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOL)))
            ->orderBy('order_number')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function listForOrdering(): Collection
    {
        return Division::query()
            ->orderBy('order_number')
            ->orderBy('id')
            ->get(['id', 'name', 'slug', 'short_name', 'logo', 'order_number', 'is_active']);
    }

    public function create(array $data, ?UploadedFile $logo, ?UploadedFile $coverImage): Division
    {
        return DB::transaction(function () use ($data, $logo, $coverImage) {
            $data = $this->orderNumberManager->appendIfMissing($data, Division::class);
            $data['logo'] = $this->mediaService->store($logo, 'divisions/logos');
            $data['cover_image'] = $this->mediaService->store($coverImage, 'divisions/covers');

            return Division::query()->create($data);
        });
    }

    public function update(Division $division, array $data, ?UploadedFile $logo, ?UploadedFile $coverImage): Division
    {
        return DB::transaction(function () use ($division, $data, $logo, $coverImage) {
            $data['logo'] = $this->mediaService->replace($logo, $division->logo, 'divisions/logos');
            $data['cover_image'] = $this->mediaService->replace($coverImage, $division->cover_image, 'divisions/covers');
            $division->fill($data)->save();

            return $division->fresh();
        });
    }

    public function delete(Division $division): void
    {
        DB::transaction(function () use ($division) {
            $this->mediaService->delete($division->logo);
            $this->mediaService->delete($division->cover_image);
            $division->delete();
        });
    }

    public function reorder(array $ids): void
    {
        $this->orderNumberManager->reorder(Division::class, $ids);
    }
}
