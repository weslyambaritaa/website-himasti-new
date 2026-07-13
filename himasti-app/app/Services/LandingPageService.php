<?php

namespace App\Services;

use App\Models\Banner;
use App\Models\Division;
use App\Models\Documentation;
use App\Models\Event;
use App\Models\InstagramPost;
use App\Models\News;
use App\Models\OrganizationProfile;
use App\Models\Service;
use App\Models\WorkProgram;

class LandingPageService
{
    public function __construct(private readonly SettingService $settingService) {}

    public function getLandingPageData(): array
    {
        $organizationProfile = OrganizationProfile::query()->first();
        $limits = $this->settingService->getLandingLimits();

        return [
            'organizationProfile' => $organizationProfile,
            'siteSettings' => $this->settingService->getPublicIdentity($organizationProfile),
            'banners' => Banner::query()
                ->where('is_shown', true)
                ->orderBy('order_number')
                ->get(),
            'latestNews' => News::query()
                ->where('status', 'published')
                ->whereNotNull('published_at')
                ->where('published_at', '<=', now())
                ->latest('published_at')
                ->limit($limits['news'])
                ->get(),
            'latestEvents' => Event::query()
                ->where('is_published', true)
                ->orderByRaw('CASE WHEN end_date IS NULL OR end_date >= ? THEN 0 ELSE 1 END', [now()->toDateString()])
                ->orderBy('start_date')
                ->orderByDesc('end_date')
                ->limit($limits['event'])
                ->get(),
            'activeDivisions' => Division::query()
                ->where('is_active', true)
                ->orderBy('order_number')
                ->get(),
            'latestWorkPrograms' => WorkProgram::query()
                ->with('division')
                ->where('is_published', true)
                ->orderByDesc('year')
                ->orderByDesc('start_date')
                ->orderBy('order_number')
                ->limit(6)
                ->get(),
            'latestDocumentations' => Documentation::query()
                ->with(['images', 'workProgram.division'])
                ->latest('event_date')
                ->limit($limits['documentation'])
                ->get(),
            'instagramPosts' => InstagramPost::query()
                ->where('is_shown', true)
                ->orderBy('order_number')
                ->limit($limits['instagram'])
                ->get(),
            'activeServices' => Service::query()
                ->where('is_active', true)
                ->orderBy('order_number')
                ->get(),
        ];
    }
}
