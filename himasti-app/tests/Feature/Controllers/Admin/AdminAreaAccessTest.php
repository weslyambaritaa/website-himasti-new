<?php

namespace Tests\Feature\Controllers\Admin;

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\App\HakAkses\HakAksesController;
use App\Http\Controllers\App\Todo\TodoController;
use App\Models\HakAksesModel;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Inertia\Response;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class AdminAreaAccessTest extends TestCase
{
    use DatabaseMigrations;

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    #[Test]
    public function username_ifs_dapat_membuka_dashboard_tanpa_akses_crud(): void
    {
        $request = Request::create('/admin/dashboard', 'GET');
        $request->attributes->set('auth', (object) [
            'id' => 'user-1',
            'username' => 'ifs-dashboard',
            'name' => 'IFS User',
            'akses' => [],
        ]);

        $response = app(AdminDashboardController::class)->index($request);

        $this->assertInstanceOf(Response::class, $response);
    }

    #[Test]
    public function username_tanpa_prefix_ifs_tidak_dapat_membuka_dashboard_admin(): void
    {
        $request = Request::create('/admin/dashboard', 'GET');
        $request->attributes->set('auth', (object) [
            'id' => 'user-1',
            'username' => 'student-user',
            'akses' => [],
        ]);

        try {
            app(AdminDashboardController::class)->index($request);
            $this->fail('Dashboard seharusnya menghasilkan 403 untuk username tanpa prefix ifs.');
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
        }
    }

    #[Test]
    public function akun_tanpa_admin_tidak_dapat_membuka_hak_akses(): void
    {
        $request = Request::create('/admin/hak-akses', 'GET');
        $request->attributes->set('auth', (object) [
            'id' => 'user-1',
            'username' => 'ifs-user',
            'akses' => [],
        ]);

        try {
            app(HakAksesController::class)->index($request);
            $this->fail('Hak Akses seharusnya menghasilkan 403 tanpa akses Admin.');
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
        }
    }

    #[Test]
    public function akun_dengan_admin_dapat_membuka_hak_akses(): void
    {
        HakAksesModel::query()->create([
            'id' => 'a5f50b22-20de-4728-8ec7-e7d8d4fbe8c0',
            'user_id' => 'user-admin',
            'akses' => 'Admin',
        ]);

        $request = Request::create('/admin/hak-akses', 'GET');
        $request->attributes->set('auth', (object) [
            'id' => 'user-admin',
            'username' => 'ifs-admin',
            'akses' => ['Admin'],
        ]);

        $response = app(HakAksesController::class)->index($request);

        $this->assertInstanceOf(Response::class, $response);
    }

    #[Test]
    public function todo_hanya_dapat_diakses_oleh_pemilik_akses_todo(): void
    {
        $allowedRequest = Request::create('/admin/todo', 'GET');
        $allowedRequest->attributes->set('auth', (object) [
            'id' => 'user-todo',
            'username' => 'ifs-todo',
            'akses' => ['Todo'],
        ]);

        $response = app(TodoController::class)->index($allowedRequest);
        $this->assertInstanceOf(Response::class, $response);

        $forbiddenRequest = Request::create('/admin/todo', 'GET');
        $forbiddenRequest->attributes->set('auth', (object) [
            'id' => 'user-no-todo',
            'username' => 'ifs-no-todo',
            'akses' => [],
        ]);

        try {
            app(TodoController::class)->index($forbiddenRequest);
            $this->fail('Todo seharusnya menghasilkan 403 tanpa akses Todo.');
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
        }
    }
}
