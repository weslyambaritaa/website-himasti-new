<?php

namespace Tests\Feature\Controllers\Admin;

use App\Http\Controllers\Admin\SettingController;
use App\Models\Banner;
use App\Models\Division;
use App\Models\Documentation;
use App\Models\Event;
use App\Models\InstagramPost;
use App\Models\News;
use App\Models\OrganizationProfile;
use App\Models\Service;
use App\Models\Setting;
use App\Services\SettingService;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class SettingControllerTest extends TestCase
{
    use DatabaseMigrations;

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    #[Test]
    public function admin_dapat_membuka_halaman_pengaturan(): void
    {
        Inertia::shouldReceive('always')->andReturnUsing(fn ($value) => new \Inertia\AlwaysProp($value));
        $rendered = Mockery::mock(Response::class);
        Inertia::shouldReceive('render')->once()->with('admin/settings/edit-page', Mockery::any())->andReturn($rendered);

        $controller = app(SettingController::class);
        $request = Request::create('/admin/pengaturan', 'GET');
        $request->attributes->set('auth', $this->adminAuth());

        $response = $controller->edit($request);

        $this->assertSame($rendered, $response);
    }

    #[Test]
    public function non_admin_ditolak_dari_halaman_pengaturan(): void
    {
        $controller = app(SettingController::class);
        $request = Request::create('/admin/pengaturan', 'GET');
        $request->attributes->set('auth', $this->nonAdminAuth());

        try {
            $controller->edit($request);
            $this->fail('Pengaturan seharusnya menghasilkan 403 tanpa akses yang sesuai.');
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
        }
    }

    #[Test]
    public function update_value_berhasil(): void
    {
        app(SettingService::class)->update([
            'site_title' => 'Website HIMASTI Baru',
            'landing_news_limit' => 2,
            'maintenance_mode' => 1,
        ]);

        $this->assertDatabaseHas('settings', ['key' => 'site_title', 'value' => 'Website HIMASTI Baru']);
        $this->assertDatabaseHas('settings', ['key' => 'landing_news_limit', 'value' => '2']);
        $this->assertDatabaseHas('settings', ['key' => 'maintenance_mode', 'value' => '1']);
    }

    #[Test]
    public function key_tidak_diizinkan_ditolak(): void
    {
        $request = new \App\Http\Requests\Admin\UpdateSettingsRequest;
        $request->merge([
            'settings' => [
                'unknown_key' => 'nilai',
            ],
        ]);
        $validator = validator([
            'settings' => [
                'unknown_key' => 'nilai',
            ],
        ], $request->rules());

        foreach ($request->after() as $afterCallback) {
            $afterCallback($validator);
        }

        $this->assertTrue($validator->errors()->isNotEmpty());
        $this->assertArrayHasKey('settings', $validator->errors()->toArray());
        $this->assertDatabaseMissing('settings', ['key' => 'unknown_key']);
    }

    #[Test]
    public function integer_limit_divalidasi(): void
    {
        $request = new \App\Http\Requests\Admin\UpdateSettingsRequest;
        $validator = validator([
            'settings' => [
                'landing_news_limit' => 0,
            ],
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('settings.landing_news_limit', $validator->errors()->toArray());
    }

    #[Test]
    public function maintenance_mode_divalidasi_boolean(): void
    {
        $request = new \App\Http\Requests\Admin\UpdateSettingsRequest;
        $validator = validator([
            'settings' => [
                'maintenance_mode' => 'foo',
            ],
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('settings.maintenance_mode', $validator->errors()->toArray());
    }

    #[Test]
    public function email_url_dan_limit_di_luar_rentang_ditolak(): void
    {
        $request = new \App\Http\Requests\Admin\UpdateSettingsRequest;
        $validator = validator([
            'settings' => [
                'contact_email' => 'bukan-email',
                'instagram_url' => 'bukan-url',
                'landing_news_limit' => 60,
            ],
        ], $request->rules(), $request->messages());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('settings.contact_email', $validator->errors()->toArray());
        $this->assertArrayHasKey('settings.instagram_url', $validator->errors()->toArray());
        $this->assertArrayHasKey('settings.landing_news_limit', $validator->errors()->toArray());
    }

    #[Test]
    public function fallback_dan_limit_landing_page_berfungsi_setelah_setting_diperbarui(): void
    {
        OrganizationProfile::query()->create([
            'organization_name' => 'Profil HIMASTI',
            'description' => 'Deskripsi profil fallback',
            'email' => 'profil@example.com',
            'phone' => '08123',
        ]);

        News::query()->create([
            'title' => 'Berita Tampil',
            'slug' => 'berita-tampil',
            'status' => 'published',
            'published_at' => now(),
        ]);
        News::query()->create([
            'title' => 'Berita Kedua',
            'slug' => 'berita-kedua',
            'status' => 'published',
            'published_at' => now()->subDay(),
        ]);
        Event::query()->create([
            'title' => 'Event Tampil',
            'slug' => 'event-tampil',
            'status' => 'ongoing',
            'is_published' => true,
            'start_date' => now()->toDateString(),
        ]);
        Division::query()->create([
            'name' => 'Divisi Publik',
            'slug' => 'divisi-publik',
            'is_active' => true,
            'order_number' => 1,
        ]);
        Documentation::query()->create([
            'title' => 'Dokumentasi Tampil',
            'slug' => 'dokumentasi-tampil',
        ]);
        InstagramPost::query()->create([
            'title' => 'Postingan Tampil',
            'instagram_url' => 'https://instagram.com/p/1',
            'is_shown' => true,
            'order_number' => 1,
        ]);
        Service::query()->create([
            'name' => 'Layanan Tampil',
            'url' => 'https://himasti.test/layanan',
            'is_active' => true,
            'order_number' => 1,
        ]);
        Banner::query()->create([
            'title' => 'Banner Tampil',
            'is_shown' => true,
            'order_number' => 1,
        ]);

        $responseBefore = $this->get(route('public.home'));
        $responseBefore->assertOk()->assertSee('Profil HIMASTI');
        $responseBefore->assertSee('Berita Tampil');
        $responseBefore->assertSee('Berita Kedua');

        app(SettingService::class)->update([
            'site_title' => 'Judul Setting',
            'landing_news_limit' => 1,
        ]);

        $responseAfter = $this->get(route('public.home'));
        $responseAfter->assertOk()->assertSee('Judul Setting');
        $responseAfter->assertSee('Berita Tampil');
        $responseAfter->assertDontSee('Berita Kedua');
    }

    #[Test]
    public function cache_setting_dibersihkan_setelah_update(): void
    {
        Setting::query()->create(['key' => 'site_title', 'value' => 'Judul Lama']);

        $this->get(route('public.home'))->assertSee('Judul Lama');

        app(SettingService::class)->update([
            'site_title' => 'Judul Baru',
        ]);

        $this->get(route('public.home'))->assertSee('Judul Baru');
    }

    private function adminAuth(): object
    {
        return (object) [
            'id' => 'admin-1',
            'username' => 'ifs-admin',
            'akses' => ['Pengaturan'],
        ];
    }

    private function nonAdminAuth(): object
    {
        return (object) [
            'id' => 'user-1',
            'username' => 'ifs-user',
            'akses' => ['Todo'],
        ];
    }
}
