<?php

namespace App\Services;

use App\Models\DivisionMember;
use App\Support\OrderNumberManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class DivisionMemberService
{
    public function __construct(
        private readonly MediaService $mediaService,
        private readonly OrderNumberManager $orderNumberManager
    ) {}

    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return DivisionMember::query()
            ->with('division')
            ->when($filters['search'] ?? null, function (Builder $query, $search) {
                $query->where(function (Builder $nested) use ($search) {
                    $nested
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('position', 'like', "%{$search}%");
                });
            })
            ->when($filters['division_id'] ?? null, fn (Builder $query, $divisionId) => $query->where('division_id', $divisionId))
            ->when($filters['period'] ?? null, fn (Builder $query, $period) => $query->where('period', 'like', "%{$period}%"))
            ->when(($filters['is_active'] ?? '') !== '', fn (Builder $query) => $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOL)))
            ->orderBy('order_number')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function listForOrdering(): Collection
    {
        return DivisionMember::query()
            ->with('division:id,name')
            ->orderBy('order_number')
            ->orderBy('id')
            ->get(['id', 'division_id', 'name', 'position', 'photo', 'order_number', 'period', 'is_active']);
    }

    public function create(array $data, ?UploadedFile $photo): DivisionMember
    {
        return DB::transaction(function () use ($data, $photo) {
            $data = $this->orderNumberManager->appendIfMissing($data, DivisionMember::class);
            $data['photo'] = $this->mediaService->store($photo, 'division-members');

            return DivisionMember::query()->create($data);
        });
    }

    public function update(DivisionMember $divisionMember, array $data, ?UploadedFile $photo): DivisionMember
    {
        return DB::transaction(function () use ($divisionMember, $data, $photo) {
            $data['photo'] = $this->mediaService->replace($photo, $divisionMember->photo, 'division-members');
            $divisionMember->fill($data)->save();

            return $divisionMember->fresh();
        });
    }

    public function delete(DivisionMember $divisionMember): void
    {
        DB::transaction(function () use ($divisionMember) {
            $this->mediaService->delete($divisionMember->photo);
            $divisionMember->delete();
        });
    }

    public function reorder(array $ids): void
    {
        $this->orderNumberManager->reorder(DivisionMember::class, $ids);
    }
}
