<?php

namespace Tests\Feature\Controllers\Public;

use App\Http\Controllers\Public\PublicContentController;
use App\Services\PublicContentService;
use App\Services\SettingService;
use Inertia\Inertia;
use Inertia\Response;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PublicContentControllerTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    #[Test]
    public function profile_merender_halaman_profil()
    {
        $service = Mockery::mock(PublicContentService::class);
        $service->shouldReceive('getProfile')->once()->andReturn(null);
        $settingService = Mockery::mock(SettingService::class);
        $settingService->shouldReceive('isMaintenanceMode')->once()->andReturn(false);
        Inertia::shouldReceive('always')->andReturnUsing(fn ($value) => new \Inertia\AlwaysProp($value));
        $responseMock = Mockery::mock(Response::class);
        Inertia::shouldReceive('render')->once()->with('public/profile-page', Mockery::any())->andReturn($responseMock);

        $controller = new PublicContentController($service, $settingService);
        $response = $controller->profile();

        $this->assertSame($responseMock, $response);
    }
}
