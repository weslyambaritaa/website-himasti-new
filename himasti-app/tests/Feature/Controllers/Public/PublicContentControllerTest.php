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
    public function layanan_merender_halaman_layanan_publik(): void
    {
        $service = Mockery::mock(PublicContentService::class);
        $service->shouldReceive('getServiceList')->once()->andReturn(collect());
        $settingService = Mockery::mock(SettingService::class);
        $settingService->shouldReceive('isMaintenanceMode')->once()->andReturn(false);
        Inertia::shouldReceive('always')->andReturnUsing(fn ($value) => new \Inertia\AlwaysProp($value));
        $responseMock = Mockery::mock(Response::class);
        Inertia::shouldReceive('render')->once()->with('public/service/index-page', Mockery::any())->andReturn($responseMock);

        $controller = new PublicContentController($service, $settingService);
        $response = $controller->serviceIndex();

        $this->assertSame($responseMock, $response);
    }
}
