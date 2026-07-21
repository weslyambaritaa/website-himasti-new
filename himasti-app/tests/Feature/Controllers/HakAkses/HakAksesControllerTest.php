<?php

namespace Tests\Feature\Controllers\HakAkses;

use App\Http\Controllers\App\HakAkses\HakAksesController;
use App\Models\HakAksesModel;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Inertia\Response;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class HakAksesControllerTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();
        Mockery::close();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    #[Test]
    public function index_menampilkan_halaman_jika_memiliki_akses_admin(): void
    {
        $auth = (object) ['id' => 'user-admin', 'username' => 'ifs-admin', 'akses' => ['Admin']];
        $request = Request::create('/admin/hak-akses', 'GET');
        $request->attributes->set('auth', $auth);

        HakAksesModel::query()->create([
            'id' => '2a0343fe-8951-4f1b-912d-c751265f7540',
            'user_id' => 'user-admin',
            'akses' => 'Admin',
        ]);

        $response = app(HakAksesController::class)->index($request);

        $this->assertInstanceOf(Response::class, $response);
    }

    #[Test]
    public function index_menghasilkan_403_jika_tanpa_akses_admin(): void
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
    public function post_change_berhasil_memperbarui_hak_akses(): void
    {
        $auth = (object) ['id' => 'user-admin', 'username' => 'ifs-admin', 'akses' => ['Admin']];
        $request = Request::create('/admin/hak-akses/change', 'POST', [
            'userId' => 'user123',
            'hakAkses' => ['Banner', 'Pengaturan'],
        ]);
        $request->attributes->set('auth', $auth);

        $response = app(HakAksesController::class)->postChange($request);

        $this->assertEquals(302, $response->getStatusCode());
        $this->assertEquals('Hak akses berhasil diperbarui.', $response->getSession()->get('success'));
        $this->assertDatabaseHas('m_hak_akses', [
            'user_id' => 'user123',
            'akses' => 'Banner,Pengaturan',
        ]);
    }

    #[Test]
    public function post_change_menghasilkan_403_jika_tanpa_akses_admin(): void
    {
        $request = Request::create('/admin/hak-akses/change', 'POST', [
            'userId' => 'user123',
            'hakAkses' => ['Banner'],
        ]);
        $request->attributes->set('auth', (object) [
            'id' => 'user-1',
            'username' => 'ifs-user',
            'akses' => [],
        ]);

        try {
            app(HakAksesController::class)->postChange($request);
            $this->fail('Perubahan hak akses seharusnya menghasilkan 403 tanpa akses Admin.');
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
        }
    }
}
