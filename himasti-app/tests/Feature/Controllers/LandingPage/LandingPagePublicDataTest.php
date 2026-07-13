<?php

namespace Tests\Feature\Controllers\LandingPage;

use App\Http\Api\UserApi;
use App\Models\Banner;
use App\Models\Division;
use App\Models\Documentation;
use App\Models\DocumentationImage;
use App\Models\Event;
use App\Models\InstagramPost;
use App\Models\News;
use App\Models\OrganizationProfile;
use App\Models\Service;
use App\Models\Setting;
use App\Models\WorkProgram;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LandingPagePublicDataTest extends TestCase
{
    use DatabaseMigrations;

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    #[Test]
    public function landing_page_tanpa_data_tetap_render(): void
    {
        $response = $this->get(route('public.home'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('public/landing-page')
            ->where('organizationProfile', null)
            ->has('banners', 0)
            ->has('latestNews', 0)
            ->has('latestEvents', 0)
            ->has('activeDivisions', 0)
            ->has('latestWorkPrograms', 0)
            ->has('latestDocumentations', 0)
            ->has('instagramPosts', 0)
            ->has('activeServices', 0)
        );
    }

    #[Test]
    public function landing_page_dengan_data_lengkap_hanya_mengambil_data_yang_valid_untuk_publik(): void
    {
        OrganizationProfile::query()->create([
            'id' => 1,
            'organization_name' => 'HIMASTI',
            'short_name' => 'HMIF',
            'tagline' => 'Tagline Hebat',
            'cabinet_name' => 'Kabinet Aksara',
            'period' => '2026/2027',
            'vision' => 'Visi Organisasi',
            'mission' => "Baris Satu\nBaris Dua",
        ]);

        Setting::query()->create(['key' => 'landing_news_limit', 'value' => '3']);
        Setting::query()->create(['key' => 'landing_event_limit', 'value' => '3']);
        Setting::query()->create(['key' => 'landing_documentation_limit', 'value' => '6']);
        Setting::query()->create(['key' => 'landing_instagram_limit', 'value' => '6']);

        Banner::query()->create([
            'title' => 'Banner Tampil',
            'image' => 'banners/show.jpg',
            'order_number' => 1,
            'is_shown' => true,
        ]);
        Banner::query()->create([
            'title' => 'Banner Sembunyi',
            'image' => 'banners/hide.jpg',
            'order_number' => 2,
            'is_shown' => false,
        ]);

        News::query()->create([
            'title' => 'Berita Publish',
            'slug' => 'berita-publish',
            'status' => 'published',
            'published_at' => Carbon::now()->subDay(),
        ]);
        News::query()->create([
            'title' => 'Berita Draft',
            'slug' => 'berita-draft',
            'status' => 'draft',
            'published_at' => Carbon::now()->subDay(),
        ]);

        Event::query()->create([
            'title' => 'Kegiatan Tampil',
            'slug' => 'kegiatan-tampil',
            'start_date' => Carbon::now()->addDay(),
            'status' => 'upcoming',
            'is_published' => true,
        ]);
        Event::query()->create([
            'title' => 'Kegiatan Draft',
            'slug' => 'kegiatan-draft',
            'start_date' => Carbon::now()->addDays(2),
            'status' => 'upcoming',
            'is_published' => false,
        ]);

        $division = Division::query()->create([
            'name' => 'BPH Inti',
            'slug' => 'bph-inti',
            'order_number' => 1,
            'is_active' => true,
        ]);
        Division::query()->create([
            'name' => 'Divisi Nonaktif',
            'slug' => 'divisi-nonaktif',
            'order_number' => 2,
            'is_active' => false,
        ]);

        $workProgram = WorkProgram::query()->create([
            'division_id' => $division->id,
            'name' => 'Program Kerja Tampil',
            'slug' => 'program-kerja-tampil',
            'year' => 2026,
            'status' => 'Berjalan',
            'start_date' => Carbon::now(),
            'order_number' => 1,
            'is_published' => true,
        ]);
        WorkProgram::query()->create([
            'division_id' => $division->id,
            'name' => 'Program Kerja Draft',
            'slug' => 'program-kerja-draft',
            'year' => 2026,
            'status' => 'Draft',
            'order_number' => 2,
            'is_published' => false,
        ]);

        $documentation = Documentation::query()->create([
            'work_program_id' => $workProgram->id,
            'title' => 'Dokumentasi Terbaru',
            'slug' => 'dokumentasi-terbaru',
            'event_date' => Carbon::now(),
            'location' => 'IT Del',
        ]);
        DocumentationImage::query()->create([
            'documentation_id' => $documentation->id,
            'image' => 'documentation/image-1.jpg',
            'order_number' => 1,
        ]);

        InstagramPost::query()->create([
            'title' => 'Instagram Tampil',
            'image' => 'instagram/1.jpg',
            'instagram_url' => 'https://instagram.com/p/1',
            'order_number' => 1,
            'is_shown' => true,
            'published_at' => Carbon::now(),
        ]);
        InstagramPost::query()->create([
            'title' => 'Instagram Hidden',
            'image' => 'instagram/2.jpg',
            'instagram_url' => 'https://instagram.com/p/2',
            'order_number' => 2,
            'is_shown' => false,
            'published_at' => Carbon::now(),
        ]);

        Service::query()->create([
            'name' => 'Layanan Tampil',
            'url' => 'https://example.com',
            'order_number' => 1,
            'is_active' => true,
        ]);
        Service::query()->create([
            'name' => 'Layanan Nonaktif',
            'url' => 'https://example.com/hidden',
            'order_number' => 2,
            'is_active' => false,
        ]);

        $response = $this->get(route('public.home'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('public/landing-page')
            ->where('organizationProfile.tagline', 'Tagline Hebat')
            ->where('organizationProfile.cabinet_name', 'Kabinet Aksara')
            ->where('organizationProfile.period', '2026/2027')
            ->where('organizationProfile.mission', "Baris Satu\nBaris Dua")
            ->has('banners', 1)
            ->where('banners.0.title', 'Banner Tampil')
            ->has('latestNews', 1)
            ->where('latestNews.0.slug', 'berita-publish')
            ->has('latestEvents', 1)
            ->where('latestEvents.0.slug', 'kegiatan-tampil')
            ->has('activeDivisions', 1)
            ->where('activeDivisions.0.slug', 'bph-inti')
            ->has('latestWorkPrograms', 1)
            ->where('latestWorkPrograms.0.slug', 'program-kerja-tampil')
            ->has('latestDocumentations', 1)
            ->where('latestDocumentations.0.slug', 'dokumentasi-terbaru')
            ->has('instagramPosts', 1)
            ->where('instagramPosts.0.title', 'Instagram Tampil')
            ->has('activeServices', 1)
            ->where('activeServices.0.name', 'Layanan Tampil')
            ->has('publicNavigation.items', 1)
            ->where('publicNavigation.items.0.label', 'BPH Inti')
        );
    }

    #[Test]
    public function tombol_masuk_admin_hanya_tampil_untuk_session_username_ifs(): void
    {
        $userApiMock = Mockery::mock('alias:' . UserApi::class);
        $userApiMock
            ->shouldReceive('getMe')
            ->once()
            ->with('valid-token')
            ->andReturn((object) [
                'data' => (object) [
                    'user' => (object) [
                        'username' => 'ifs.wesly',
                    ],
                ],
            ]);

        $response = $this->withSession(['auth_token' => 'valid-token'])->get(route('public.home'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('publicAuth.username', 'ifs.wesly')
            ->where('publicAuth.canAccessAdmin', true)
        );
    }

    #[Test]
    public function public_page_tetap_render_saat_auth_user_resolver_gagal(): void
    {
        $userApiMock = Mockery::mock('alias:' . UserApi::class);
        $userApiMock
            ->shouldReceive('getMe')
            ->once()
            ->with('broken-token')
            ->andThrow(new \RuntimeException('resolver gagal'));

        $failedResponse = $this->withSession(['auth_token' => 'broken-token'])->get(route('public.home'));
        $failedResponse->assertOk();
        $failedResponse->assertInertia(fn (Assert $page) => $page
            ->where('publicAuth', null)
        );
    }

    #[Test]
    public function tombol_masuk_admin_tidak_tampil_untuk_username_non_ifs(): void
    {
        $userApiMock = Mockery::mock('alias:' . UserApi::class);
        $userApiMock
            ->shouldReceive('getMe')
            ->once()
            ->with('user-token')
            ->andReturn((object) [
                'data' => (object) [
                    'user' => (object) [
                        'username' => 'wesly',
                    ],
                ],
            ]);

        $nonIfsResponse = $this->withSession(['auth_token' => 'user-token'])->get(route('public.home'));
        $nonIfsResponse->assertOk();
        $nonIfsResponse->assertInertia(fn (Assert $page) => $page
            ->where('publicAuth.username', 'wesly')
            ->where('publicAuth.canAccessAdmin', false)
        );
    }
}
