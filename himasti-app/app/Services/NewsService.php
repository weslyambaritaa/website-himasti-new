<?php

namespace App\Services;

use App\Models\News;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class NewsService
{
    public function __construct(private readonly MediaService $mediaService) {}

    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return News::query()
            ->when($filters['search'] ?? null, fn (Builder $query, $search) => $query->where('title', 'like', "%{$search}%"))
            ->when($filters['status'] ?? null, fn (Builder $query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data, ?UploadedFile $coverImage): News
    {
        return DB::transaction(function () use ($data, $coverImage) {
            $data['cover_image'] = $this->mediaService->store($coverImage, 'news');

            return News::query()->create($data);
        });
    }

    public function update(News $news, array $data, ?UploadedFile $coverImage): News
    {
        return DB::transaction(function () use ($news, $data, $coverImage) {
            $data['cover_image'] = $this->mediaService->replace($coverImage, $news->cover_image, 'news');
            $news->fill($data)->save();

            return $news->fresh();
        });
    }

    public function delete(News $news): void
    {
        DB::transaction(function () use ($news) {
            $this->mediaService->delete($news->cover_image);
            $news->delete();
        });
    }
}
