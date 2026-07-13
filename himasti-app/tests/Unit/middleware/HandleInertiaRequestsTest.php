<?php

namespace Tests\Unit\Middleware;

use App\Http\Api\UserApi;
use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Division;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class HandleInertiaRequestsTest extends TestCase
{
    use DatabaseMigrations;

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    #[Test]
    public function share_mengirim_navigation_sesuai_akses_user(): void
    {
        $request = Request::create('/admin/dashboard', 'GET');
        $request->attributes->set('auth', (object) [
            'id' => 'user-1',
            'username' => 'ifs-admin',
            'akses' => ['Banner', 'Admin'],
        ]);

        $shared = (new HandleInertiaRequests())->share($request);
        $navigation = $shared['adminNavigation']();

        $this->assertSame('Dashboard', $navigation[0]['items'][0]['title']);
        $this->assertSame(['Hak Akses', 'Banner'], array_column($navigation[1]['items'], 'title'));
    }

    #[Test]
    public function share_tidak_menampilkan_auth_publik_jika_tanpa_session(): void
    {
        $request = Request::create('/', 'GET');

        $shared = (new HandleInertiaRequests())->share($request);

        $this->assertNull($shared['publicAuth']());
    }

    #[Test]
    public function share_mengirim_auth_publik_dan_dropdown_divisi_dari_database(): void
    {
        Division::query()->create([
            'name' => 'BPH Inti',
            'slug' => 'bph-inti',
            'order_number' => 1,
            'is_active' => true,
        ]);

        session(['auth_token' => 'valid-token']);

        $userApiMock = Mockery::mock('alias:' . UserApi::class);
        $userApiMock
            ->shouldReceive('getMe')
            ->once()
            ->with('valid-token')
            ->andReturn((object) [
                'data' => (object) [
                    'user' => (object) [
                        'username' => 'ifs.public',
                    ],
                ],
            ]);

        $request = Request::create('/', 'GET');
        $shared = (new HandleInertiaRequests())->share($request);

        $this->assertSame([
            'username' => 'ifs.public',
            'canAccessAdmin' => true,
        ], $shared['publicAuth']());
        $this->assertSame('BPH Inti', $shared['publicNavigation']()['items'][0]['label']);
    }
}
