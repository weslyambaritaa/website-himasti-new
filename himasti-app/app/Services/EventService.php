<?php

namespace App\Services;

use App\Models\Event;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class EventService
{
    public function __construct(private readonly MediaService $mediaService) {}

    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return Event::query()
            ->when($filters['search'] ?? null, fn (Builder $query, $search) => $query->where('title', 'like', "%{$search}%"))
            ->when($filters['location'] ?? null, fn (Builder $query, $location) => $query->where('location', 'like', "%{$location}%"))
            ->when($filters['status'] ?? null, fn (Builder $query, $status) => $query->where('status', $status))
            ->when(($filters['is_published'] ?? '') !== '', fn (Builder $query) => $query->where('is_published', filter_var($filters['is_published'], FILTER_VALIDATE_BOOL)))
            ->when(($filters['is_featured'] ?? '') !== '', fn (Builder $query) => $query->where('is_featured', filter_var($filters['is_featured'], FILTER_VALIDATE_BOOL)))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data, ?UploadedFile $coverImage): Event
    {
        return DB::transaction(function () use ($data, $coverImage) {
            $data['cover_image'] = $this->mediaService->store($coverImage, 'events');

            return Event::query()->create($data);
        });
    }

    public function update(Event $event, array $data, ?UploadedFile $coverImage): Event
    {
        return DB::transaction(function () use ($event, $data, $coverImage) {
            $data['cover_image'] = $this->mediaService->replace($coverImage, $event->cover_image, 'events');
            $event->fill($data)->save();

            return $event->fresh();
        });
    }

    public function delete(Event $event): void
    {
        DB::transaction(function () use ($event) {
            $this->mediaService->delete($event->cover_image);
            $event->delete();
        });
    }
}
