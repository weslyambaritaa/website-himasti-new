<?php

namespace App\Services;

use App\Models\Service;
use App\Support\OrderNumberManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class ServiceItemService
{
    public function __construct(
        private readonly MediaService $mediaService,
        private readonly OrderNumberManager $orderNumberManager
    ) {}

    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return Service::query()
            ->when($filters['search'] ?? null, fn (Builder $query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->when(($filters['is_active'] ?? '') !== '', fn (Builder $query) => $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOL)))
            ->orderBy('order_number')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function listForOrdering(): Collection
    {
        return Service::query()
            ->orderBy('order_number')
            ->orderBy('id')
            ->get(['id', 'name', 'description', 'icon', 'logo', 'url', 'order_number', 'is_active']);
    }

    public function create(array $data, ?UploadedFile $logo): Service
    {
        return DB::transaction(function () use ($data, $logo) {
            $data = $this->orderNumberManager->appendIfMissing($data, Service::class);
            $data['logo'] = $this->mediaService->store($logo, 'services');

            return Service::query()->create($data);
        });
    }

    public function update(Service $service, array $data, ?UploadedFile $logo): Service
    {
        return DB::transaction(function () use ($service, $data, $logo) {
            $data['logo'] = $this->mediaService->replace($logo, $service->logo, 'services');
            $service->fill($data)->save();

            return $service->fresh();
        });
    }

    public function delete(Service $service): void
    {
        DB::transaction(function () use ($service) {
            $this->mediaService->delete($service->logo);
            $service->delete();
        });
    }

    public function reorder(array $ids): void
    {
        $this->orderNumberManager->reorder(Service::class, $ids);
    }
}
