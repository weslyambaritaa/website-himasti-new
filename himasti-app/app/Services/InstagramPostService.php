<?php

namespace App\Services;

use App\Models\InstagramPost;
use App\Support\OrderNumberManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class InstagramPostService
{
    public function __construct(
        private readonly MediaService $mediaService,
        private readonly OrderNumberManager $orderNumberManager
    ) {}

    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return InstagramPost::query()
            ->when($filters['search'] ?? null, fn (Builder $query, $search) => $query->where('title', 'like', "%{$search}%"))
            ->when(($filters['is_shown'] ?? '') !== '', fn (Builder $query) => $query->where('is_shown', filter_var($filters['is_shown'], FILTER_VALIDATE_BOOL)))
            ->orderBy('order_number')
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function listForOrdering(): Collection
    {
        return InstagramPost::query()
            ->orderBy('order_number')
            ->orderBy('id')
            ->get(['id', 'title', 'image', 'instagram_url', 'order_number', 'is_shown', 'published_at']);
    }

    public function create(array $data, ?UploadedFile $image): InstagramPost
    {
        return DB::transaction(function () use ($data, $image) {
            $data = $this->orderNumberManager->appendIfMissing($data, InstagramPost::class);
            $data['image'] = $this->mediaService->store($image, 'instagram-posts');

            return InstagramPost::query()->create($data);
        });
    }

    public function update(InstagramPost $instagramPost, array $data, ?UploadedFile $image): InstagramPost
    {
        return DB::transaction(function () use ($instagramPost, $data, $image) {
            $data['image'] = $this->mediaService->replace($image, $instagramPost->image, 'instagram-posts');
            $instagramPost->fill($data)->save();

            return $instagramPost->fresh();
        });
    }

    public function delete(InstagramPost $instagramPost): void
    {
        DB::transaction(function () use ($instagramPost) {
            $this->mediaService->delete($instagramPost->image);
            $instagramPost->delete();
        });
    }

    public function reorder(array $ids): void
    {
        $this->orderNumberManager->reorder(InstagramPost::class, $ids);
    }
}
