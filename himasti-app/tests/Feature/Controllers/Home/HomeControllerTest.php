<?php

namespace Tests\Feature\Controllers\Home;

use App\Helper\ToolsHelper;
use App\Http\Controllers\App\Home\HomeController;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;
use Mockery;

class HomeControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Mockery::close();

        // Mock Inertia::always untuk mengembalikan nilai yang diinginkan
        Inertia::shouldReceive('always')
            ->andReturnUsing(function ($value) {
                return new \Inertia\AlwaysProp($value);
            });
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    #[Test]
    public function index_menampilkan_halaman_beranda_dengan_data_lengkap()
    {
        $authData = (object) ['id' => 1, 'name' => 'Test User', 'username' => 'ifs-test'];
        $authToken = 'fake-token-123';

        $request = Request::create('/admin/dashboard', 'GET');
        $request->attributes->set('auth', $authData);

        ToolsHelper::setAuthToken($authToken);

        $mockResponse = Mockery::mock(Response::class);

        Inertia::shouldReceive('render')
            ->once()
            ->with('admin/dashboard/dashboard-page', Mockery::any())
            ->andReturn($mockResponse);

        $controller = new HomeController();

        // =====================================
        // Act (Aksi)
        // =====================================
        $response = $controller->index($request);

        // =====================================
        // Assert (Verifikasi)
        // =====================================
        $this->assertSame($mockResponse, $response);
    }

    #[Test]
    public function index_berhasil_dengan_auth_kosong()
    {
        $authToken = 'fake-token-456';

        $request = Request::create('/admin/dashboard', 'GET');

        ToolsHelper::setAuthToken($authToken);

        $controller = new HomeController();
        try {
            $controller->index($request);
            $this->fail('Dashboard seharusnya menghasilkan 403 tanpa auth admin area.');
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
        }
    }

    #[Test]
    public function dashboard_menolak_username_tanpa_prefix_ifs(): void
    {
        $request = Request::create('/admin/dashboard', 'GET');
        $request->attributes->set('auth', (object) [
            'id' => 2,
            'name' => 'User Biasa',
            'username' => 'student-user',
            'akses' => [],
        ]);

        $controller = new HomeController();

        try {
            $controller->index($request);
            $this->fail('Dashboard seharusnya menghasilkan 403 untuk username tanpa prefix ifs.');
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
        }
    }

    #[Test]
    public function dashboard_menolak_prefix_besar_ifs(): void
    {
        $request = Request::create('/admin/dashboard', 'GET');
        $request->attributes->set('auth', (object) [
            'id' => 3,
            'name' => 'User Case',
            'username' => 'IFS-user',
            'akses' => [],
        ]);

        $controller = new HomeController();

        try {
            $controller->index($request);
            $this->fail('Dashboard seharusnya menghasilkan 403 untuk prefix besar.');
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
        }
    }
}
