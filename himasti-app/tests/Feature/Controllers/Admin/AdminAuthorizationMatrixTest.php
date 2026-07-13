<?php

namespace Tests\Feature\Controllers\Admin;

use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\DivisionController;
use App\Http\Controllers\Admin\DivisionMemberController;
use App\Http\Controllers\Admin\DocumentationController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\InstagramPostController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\OrganizationProfileController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\WorkProgramController;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Inertia\Response;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class AdminAuthorizationMatrixTest extends TestCase
{
    use DatabaseMigrations;

    #[Test]
    public function setiap_modul_admin_memakai_akses_yang_sesuai(): void
    {
        foreach ($this->moduleCases() as $case) {
            $controller = app($case['controller']);
            $request = Request::create($case['uri'], 'GET');
            $request->attributes->set('auth', (object) [
                'id' => 'user-1',
                'username' => 'ifs-user',
                'akses' => [$case['access']],
            ]);

            $response = $controller->{$case['method']}($request);

            $this->assertInstanceOf(Response::class, $response, $case['label']);
        }
    }

    #[Test]
    public function url_manual_modul_admin_tanpa_izin_menghasilkan_403(): void
    {
        foreach ($this->moduleCases() as $case) {
            $controller = app($case['controller']);
            $request = Request::create($case['uri'], 'GET');
            $request->attributes->set('auth', (object) [
                'id' => 'user-2',
                'username' => 'ifs-user',
                'akses' => [],
            ]);

            try {
                $controller->{$case['method']}($request);
                $this->fail("{$case['label']} seharusnya menghasilkan 403.");
            } catch (HttpException $exception) {
                $this->assertSame(403, $exception->getStatusCode(), $case['label']);
            }
        }
    }

    private function moduleCases(): array
    {
        return [
            ['label' => 'Profil Organisasi', 'controller' => OrganizationProfileController::class, 'method' => 'edit', 'uri' => '/admin/profil-organisasi', 'access' => 'Profil Organisasi'],
            ['label' => 'Banner', 'controller' => BannerController::class, 'method' => 'index', 'uri' => '/admin/banner', 'access' => 'Banner'],
            ['label' => 'Berita', 'controller' => NewsController::class, 'method' => 'index', 'uri' => '/admin/berita', 'access' => 'Berita'],
            ['label' => 'Kegiatan', 'controller' => EventController::class, 'method' => 'index', 'uri' => '/admin/event', 'access' => 'Kegiatan'],
            ['label' => 'Divisi', 'controller' => DivisionController::class, 'method' => 'index', 'uri' => '/admin/divisi', 'access' => 'Divisi'],
            ['label' => 'Anggota Divisi', 'controller' => DivisionMemberController::class, 'method' => 'index', 'uri' => '/admin/anggota-divisi', 'access' => 'Anggota Divisi'],
            ['label' => 'Program Kerja', 'controller' => WorkProgramController::class, 'method' => 'index', 'uri' => '/admin/program-kerja', 'access' => 'Program Kerja'],
            ['label' => 'Dokumentasi', 'controller' => DocumentationController::class, 'method' => 'index', 'uri' => '/admin/dokumentasi', 'access' => 'Dokumentasi'],
            ['label' => 'Postingan Instagram', 'controller' => InstagramPostController::class, 'method' => 'index', 'uri' => '/admin/instagram-post', 'access' => 'Postingan Instagram'],
            ['label' => 'Layanan', 'controller' => ServiceController::class, 'method' => 'index', 'uri' => '/admin/layanan', 'access' => 'Layanan'],
            ['label' => 'Pengaturan', 'controller' => SettingController::class, 'method' => 'edit', 'uri' => '/admin/pengaturan', 'access' => 'Pengaturan'],
        ];
    }
}
