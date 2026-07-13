<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\PublicContentService;
use App\Services\SettingService;
use Inertia\Inertia;

class PublicContentController extends Controller
{
    public function __construct(
        private readonly PublicContentService $publicContentService,
        private readonly SettingService $settingService,
    ) {}

    public function profile()
    {
        if ($response = $this->maintenanceResponse()) {
            return $response;
        }

        return Inertia::render('public/profile-page', [
            'pageName' => Inertia::always('Profil'),
            'profile' => $this->publicContentService->getProfile(),
        ]);
    }

    public function newsIndex()
    {
        if ($response = $this->maintenanceResponse()) {
            return $response;
        }

        return Inertia::render('public/news/index-page', [
            'pageName' => Inertia::always('Berita'),
            'newsItems' => $this->publicContentService->getNewsList(),
        ]);
    }

    public function newsDetail(string $slug)
    {
        if ($response = $this->maintenanceResponse()) {
            return $response;
        }

        return Inertia::render('public/news/detail-page', [
            'pageName' => Inertia::always('Detail Berita'),
            'newsItem' => $this->publicContentService->getNewsBySlug($slug),
        ]);
    }

    public function eventIndex()
    {
        if ($response = $this->maintenanceResponse()) {
            return $response;
        }

        return Inertia::render('public/event/index-page', [
            'pageName' => Inertia::always('Kegiatan'),
            'events' => $this->publicContentService->getEventList(),
        ]);
    }

    public function eventDetail(string $slug)
    {
        if ($response = $this->maintenanceResponse()) {
            return $response;
        }

        return Inertia::render('public/event/detail-page', [
            'pageName' => Inertia::always('Detail Kegiatan'),
            'eventItem' => $this->publicContentService->getEventBySlug($slug),
        ]);
    }

    public function documentationIndex()
    {
        if ($response = $this->maintenanceResponse()) {
            return $response;
        }

        return Inertia::render('public/documentation/index-page', [
            'pageName' => Inertia::always('Dokumentasi'),
            'documentations' => $this->publicContentService->getDocumentationList(),
        ]);
    }

    public function documentationDetail(string $slug)
    {
        if ($response = $this->maintenanceResponse()) {
            return $response;
        }

        return Inertia::render('public/documentation/detail-page', [
            'pageName' => Inertia::always('Detail Dokumentasi'),
            'documentation' => $this->publicContentService->getDocumentationBySlug($slug),
        ]);
    }

    public function divisionIndex()
    {
        if ($response = $this->maintenanceResponse()) {
            return $response;
        }

        return Inertia::render('public/division/index-page', [
            'pageName' => Inertia::always('Divisi'),
            'divisions' => $this->publicContentService->getDivisionList(),
        ]);
    }

    public function divisionDetail(string $slug)
    {
        if ($response = $this->maintenanceResponse()) {
            return $response;
        }

        return Inertia::render('public/division/detail-page', [
            'pageName' => Inertia::always('Detail Divisi'),
            'division' => $this->publicContentService->getDivisionBySlug($slug),
        ]);
    }

    public function serviceIndex()
    {
        if ($response = $this->maintenanceResponse()) {
            return $response;
        }

        return Inertia::render('public/service/index-page', [
            'pageName' => Inertia::always('Layanan'),
            'services' => $this->publicContentService->getServiceList(),
        ]);
    }

    public function workProgramIndex()
    {
        if ($response = $this->maintenanceResponse()) {
            return $response;
        }

        $filters = request()->only(['division_id', 'year']);

        return Inertia::render('public/work-program/index-page', [
            'pageName' => Inertia::always('Program Kerja'),
            'workPrograms' => $this->publicContentService->getWorkProgramList($filters),
            'divisions' => $this->publicContentService->getDivisionOptions(),
            'years' => $this->publicContentService->getWorkProgramYears(),
            'filters' => $filters,
        ]);
    }

    public function workProgramDetail(string $slug)
    {
        if ($response = $this->maintenanceResponse()) {
            return $response;
        }

        return Inertia::render('public/work-program/detail-page', [
            'pageName' => Inertia::always('Detail Program Kerja'),
            'workProgram' => $this->publicContentService->getWorkProgramBySlug($slug),
        ]);
    }

    private function maintenanceResponse()
    {
        if (! $this->settingService->isMaintenanceMode()) {
            return null;
        }

        return Inertia::render('public/maintenance-page', [
            'pageName' => Inertia::always('Pemeliharaan'),
            'identity' => $this->settingService->getPublicIdentity(),
        ]);
    }
}
