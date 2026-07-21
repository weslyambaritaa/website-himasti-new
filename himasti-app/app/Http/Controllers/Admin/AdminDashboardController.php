<?php

namespace App\Http\Controllers\Admin;

use App\Helper\AuthorizationHelper;
use App\Http\Controllers\Controller;
use App\Models\Division;
use App\Models\DivisionMember;
use App\Models\Documentation;
use App\Models\Event;
use App\Models\News;
use App\Models\WorkProgram;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Request;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        $auth = $request->attributes->get('auth');
        if (! AuthorizationHelper::canAccessAdminArea($auth)) {
            abort(403, 'Akun Anda tidak diizinkan mengakses area admin.');
        }

        $today = now()->toDateString();

        return Inertia::render('admin/dashboard/dashboard-page', [
            'auth' => Inertia::always($auth),
            'pageName' => Inertia::always('Dashboard'),
            'statistics' => [
                'news_published' => News::query()->where('status', 'published')->count(),
                'news_draft' => News::query()->where('status', 'draft')->count(),
                'events_active' => Event::query()
                    ->where('is_published', true)
                    ->where('status', '!=', 'cancelled')
                    ->whereRaw('COALESCE(end_date, start_date) >= ?', [$today])
                    ->count(),
                'work_programs' => WorkProgram::query()->where('is_published', true)->count(),
                'documentations' => Documentation::query()->count(),
                'divisions' => Division::query()->where('is_active', true)->count(),
                'members' => DivisionMember::query()->where('is_active', true)->count(),
            ],
            'recentNews' => News::query()
                ->latest('updated_at')
                ->limit(5)
                ->get(['id', 'title', 'slug', 'status', 'published_at', 'updated_at']),
            'upcomingEvents' => Event::query()
                ->where('is_published', true)
                ->where('status', '!=', 'cancelled')
                ->whereRaw('COALESCE(end_date, start_date) >= ?', [$today])
                ->orderByDesc('is_featured')
                ->orderBy('start_date')
                ->limit(5)
                ->get(['id', 'title', 'slug', 'start_date', 'end_date', 'location', 'is_featured']),
            'featuredPrograms' => WorkProgram::query()
                ->with('division:id,name')
                ->where('is_published', true)
                ->where('is_featured', true)
                ->orderByDesc('year')
                ->orderBy('order_number')
                ->limit(5)
                ->get(['id', 'division_id', 'name', 'slug', 'year', 'status']),
        ]);
    }
}
