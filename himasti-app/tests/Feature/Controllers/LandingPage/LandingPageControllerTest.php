<?php

namespace Tests\Feature\Controllers\LandingPage;

use App\Http\Controllers\Public\LandingPageController;
use App\Services\LandingPageService;
use App\Services\SettingService;
use Inertia\Inertia;
use Inertia\Response;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LandingPageControllerTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    #[Test]
    public function index_menampilkan_landing_page_publik()
    {
        $serviceMock = Mockery::mock(LandingPageService::class);
        $serviceMock->shouldReceive('getLandingPageData')
            ->once()
            ->andReturn([
                'organizationProfile' => null,
                'banners' => [],
                'latestNews' => [],
                'latestEvents' => [],
                'activeDivisions' => [],
                'latestDocumentations' => [],
                'instagramPosts' => [],
                'activeServices' => [],
            ]);

        Inertia::shouldReceive('always')
            ->andReturnUsing(function ($value) {
                return new \Inertia\AlwaysProp($value);
            });

        $mockResponse = Mockery::mock(Response::class);
        Inertia::shouldReceive('render')
            ->once()
            ->with('public/landing-page', Mockery::any())
            ->andReturn($mockResponse);

        $settingService = Mockery::mock(SettingService::class);
        $settingService->shouldReceive('isMaintenanceMode')->once()->andReturn(false);

        $controller = new LandingPageController($serviceMock, $settingService);
        $response = $controller->index();

        $this->assertSame($mockResponse, $response);
    }
}
