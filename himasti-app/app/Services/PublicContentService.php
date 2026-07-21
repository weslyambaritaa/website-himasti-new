<?php

namespace App\Services;

use App\Models\Division;
use App\Models\Documentation;
use App\Models\Event;
use App\Models\News;
use App\Models\Service;
use App\Models\WorkProgram;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class PublicContentService
{
    public function getNewsList(int $perPage = 9): LengthAwarePaginator
    {
        return News::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest('published_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getNewsBySlug(string $slug): News
    {
        $newsItem = News::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->firstOrFail();

        $newsItem->setRelation(
            'related_items',
            News::query()
                ->whereKeyNot($newsItem->id)
                ->where('status', 'published')
                ->whereNotNull('published_at')
                ->where('published_at', '<=', now())
                ->latest('published_at')
                ->limit(3)
                ->get()
        );

        return $newsItem;
    }

    public function getEventList(int $perPage = 9): LengthAwarePaginator
    {
        return Event::query()
            ->where('is_published', true)
            ->orderByRaw(
                "CASE WHEN status = 'cancelled' THEN 2 WHEN COALESCE(end_date, start_date) >= ? THEN 0 ELSE 1 END",
                [now()->toDateString()]
            )
            ->orderByDesc('is_featured')
            ->orderBy('start_date')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getEventBySlug(string $slug): Event
    {
        return Event::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();
    }

    public function getDocumentationList(int $perPage = 9): LengthAwarePaginator
    {
        return Documentation::query()
            ->with(['images', 'workProgram.division'])
            ->latest('event_date')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getDocumentationBySlug(string $slug): Documentation
    {
        return Documentation::query()
            ->with(['images', 'workProgram.division'])
            ->where('slug', $slug)
            ->firstOrFail();
    }

    public function getDivisionList(): LengthAwarePaginator
    {
        return Division::query()
            ->where('is_active', true)
            ->withCount([
                'members as members_count' => fn (Builder $query) => $query->where('is_active', true),
            ])
            ->orderBy('order_number')
            ->paginate(12)
            ->withQueryString();
    }

    public function getDivisionBySlug(string $slug): Division
    {
        return Division::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'members' => fn ($query) => $query->where('is_active', true)->orderBy('order_number'),
                'workPrograms' => fn ($query) => $query
                    ->where('is_published', true)
                    ->with([
                        'documentations' => fn ($documentationQuery) => $documentationQuery
                            ->with('images')
                            ->latest('event_date'),
                    ])
                    ->orderByDesc('year')
                    ->orderByDesc('is_featured')
                    ->orderByDesc('start_date')
                    ->orderBy('order_number'),
            ])
            ->firstOrFail();
    }

    public function getServiceList()
    {
        return Service::query()
            ->where('is_active', true)
            ->orderBy('order_number')
            ->get();
    }

    public function getWorkProgramList(array $filters = [], int $perPage = 9): LengthAwarePaginator
    {
        return $this->applyWorkProgramFilters(
            WorkProgram::query()
                ->with(['division'])
                ->where('is_published', true),
            $filters
        )
            ->orderByDesc('year')
            ->orderByDesc('is_featured')
            ->orderByDesc('start_date')
            ->orderBy('order_number')
            ->orderBy('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getWorkProgramBySlug(string $slug): WorkProgram
    {
        return WorkProgram::query()
            ->with([
                'division',
                'documentations' => fn ($query) => $query
                    ->with('images')
                    ->latest('event_date'),
            ])
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();
    }

    public function getDivisionOptions()
    {
        return Division::query()
            ->where('is_active', true)
            ->orderBy('order_number')
            ->get(['id', 'name', 'slug']);
    }

    public function getWorkProgramYears()
    {
        return WorkProgram::query()
            ->where('is_published', true)
            ->select('year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year')
            ->filter()
            ->values();
    }

    private function applyWorkProgramFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['division_id'] ?? request('division_id'), fn (Builder $builder, $divisionId) => $builder->where('division_id', $divisionId))
            ->when($filters['year'] ?? request('year'), fn (Builder $builder, $year) => $builder->where('year', $year));
    }
}
