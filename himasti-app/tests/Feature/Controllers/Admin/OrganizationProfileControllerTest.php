<?php

namespace Tests\Feature\Controllers\Admin;

use App\Http\Controllers\Admin\OrganizationProfileController;
use App\Http\Requests\Admin\UpdateOrganizationProfileRequest;
use App\Models\OrganizationProfile;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OrganizationProfileControllerTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
    }

    private function authorizedAuth(): object
    {
        return (object) [
            'id' => 'user-profile',
            'username' => 'ifs-profile',
            'akses' => ['Profil Organisasi'],
        ];
    }

    #[Test]
    public function migration_menambahkan_field_baru_organization_profiles(): void
    {
        $this->assertTrue(Schema::hasColumns('organization_profiles', [
            'tagline',
            'cabinet_name',
            'period',
        ]));
        $this->assertFalse(Schema::hasColumn('organization_profiles', 'history'));
        $this->assertFalse(Schema::hasColumn('organization_profiles', 'chairman_message'));
        $this->assertFalse(Schema::hasColumn('organization_profiles', 'youtube_url'));
    }

    #[Test]
    public function update_profil_organisasi_menyimpan_tagline_cabinet_name_dan_period(): void
    {
        $controller = app(OrganizationProfileController::class);

        $request = UpdateOrganizationProfileRequest::create('/admin/profil-organisasi', 'POST', [
            '_method' => 'PUT',
            'organization_name' => 'HIMASTI',
            'short_name' => 'HMIF',
            'tagline' => 'Berkarya untuk Informatika',
            'cabinet_name' => 'Kabinet Aksara',
            'period' => '2026/2027',
            'description' => 'Deskripsi organisasi',
            'vision' => 'Visi',
            'mission' => "Misi 1\nMisi 2",
            'address' => 'Laguboti',
            'email' => 'himasti@example.com',
            'phone' => '08123',
            'instagram_url' => 'https://instagram.com/himasti',
        ], [], [
            'logo' => UploadedFile::fake()->image('logo.png'),
        ]);
        $request->attributes->set('auth', $this->authorizedAuth());
        $request->setContainer($this->app);
        $request->setRedirector($this->app['redirect']);
        $request->validateResolved();

        $response = $controller->update($request);

        $this->assertEquals(302, $response->getStatusCode());
        $this->assertDatabaseHas('organization_profiles', [
            'id' => 1,
            'tagline' => 'Berkarya untuk Informatika',
            'cabinet_name' => 'Kabinet Aksara',
            'period' => '2026/2027',
            'mission' => "Misi 1\nMisi 2",
        ]);
    }

    #[Test]
    public function edit_mengirim_data_profil_organisasi_lengkap(): void
    {
        OrganizationProfile::query()->create([
            'id' => 1,
            'organization_name' => 'HIMASTI',
            'short_name' => 'HMIF',
            'tagline' => 'Tagline',
            'cabinet_name' => 'Kabinet',
            'period' => '2026/2027',
        ]);

        $request = \Illuminate\Http\Request::create('/admin/profil-organisasi', 'GET');
        $request->attributes->set('auth', $this->authorizedAuth());

        $response = app(OrganizationProfileController::class)->edit($request);

        $this->assertInstanceOf(Response::class, $response);

        $resolvedResponse = $response->toResponse($request);
        $page = $resolvedResponse->getOriginalContent()->getData()['page'];

        $this->assertSame('Tagline', $page['props']['profile']['tagline']);
        $this->assertSame('2026/2027', $page['props']['profile']['period']);
    }
}
