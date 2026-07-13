<?php

namespace App\Services;

use App\Models\Banner;
use App\Support\OrderNumberManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class BannerService
{
    public function __construct(
        private readonly MediaService $mediaService,
        private readonly OrderNumberManager $orderNumberManager
    ) {}

    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return Banner::query()
            ->when($filters['search'] ?? null, fn (Builder $query, $search) => $query->where('title', 'like', "%{$search}%"))
            ->when(($filters['is_shown'] ?? '') !== '', fn (Builder $query) => $query->where('is_shown', filter_var($filters['is_shown'], FILTER_VALIDATE_BOOL)))
            ->orderBy('order_number')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function listForOrdering(): Collection
    {
        return Banner::query()
            ->orderBy('order_number')
            ->orderBy('id')
            ->get(['id', 'title', 'subtitle', 'image', 'order_number', 'is_shown']);
    }

    public function create(array $data, ?UploadedFile $image): Banner
    {
        return DB::transaction(function () use ($data, $image) {
            $data = $this->orderNumberManager->appendIfMissing($data, Banner::class);
            $data['image'] = $this->mediaService->store($image, 'banners');

            return Banner::query()->create($data);
        });
    }

    public function update(Banner $banner, array $data, ?UploadedFile $image): Banner
    {
        return DB::transaction(function () use ($banner, $data, $image) {
            $data['image'] = $this->mediaService->replace($image, $banner->image, 'banners');
            $banner->fill($data);
            $banner->save();

            return $banner->fresh();
        });
    }

    public function delete(Banner $banner): void
    {
        DB::transaction(function () use ($banner) {
            $this->mediaService->delete($banner->image);
            $banner->delete();
        });
    }

    public function reorder(array $ids): void
    {
        $this->orderNumberManager->reorder(Banner::class, $ids);
    }
}
