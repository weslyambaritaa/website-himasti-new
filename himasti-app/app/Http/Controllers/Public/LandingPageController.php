<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\LandingPageService;
use App\Services\SettingService;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    public function __construct(
        private readonly LandingPageService $landingPageService,
        private readonly SettingService $settingService,
    ) {}

    public function index()
    {
        if ($this->settingService->isMaintenanceMode()) {
            return Inertia::render('public/maintenance-page', [
                'pageName' => Inertia::always('Pemeliharaan'),
                'identity' => $this->settingService->getPublicIdentity(),
            ]);
        }

        return Inertia::render('public/landing-page', [
            ...$this->landingPageService->getLandingPageData(),
            'pageName' => Inertia::always('Beranda'),
        ]);
    }
}
