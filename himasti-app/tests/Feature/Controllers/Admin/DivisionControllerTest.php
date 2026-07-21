<?php

namespace Tests\Feature\Controllers\Admin;

use App\Http\Controllers\Admin\DivisionController;
use App\Http\Requests\Admin\StoreDivisionRequest;
use App\Models\Division;
use App\Services\DivisionService;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class DivisionControllerTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    #[Test]
    public function admin_dapat_membuka_index_divisi(): void
    {
        Inertia::shouldReceive('always')->andReturnUsing(fn ($value) => new \Inertia\AlwaysProp($value));
        $rendered = Mockery::mock(Response::class);
        Inertia::shouldReceive('render')->once()->with('admin/division/index-page', Mockery::any())->andReturn($rendered);

        $controller = app(DivisionController::class);
        $request = Request::create('/admin/divisi', 'GET');
        $request->attributes->set('auth', $this->adminAuth());

        $response = $controller->index($request);

        $this->assertSame($rendered, $response);
    }

    #[Test]
    public function non_admin_ditolak_dari_modul_divisi(): void
    {
        $controller = app(DivisionController::class);
        $request = Request::create('/admin/divisi', 'GET');
        $request->attributes->set('auth', $this->nonAdminAuth());

        try {
            $controller->index($request);
            $this->fail('Divisi seharusnya menghasilkan 403 tanpa akses yang sesuai.');
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
        }
    }

    #[Test]
    public function create_divisi_berhasil_dan_logo_tersimpan(): void
    {
        $division = app(DivisionService::class)->create([
            'name' => 'Divisi Riset',
            'slug' => 'divisi-riset',
            'short_name' => 'Riset',
            'description' => 'Divisi untuk riset',
            'order_number' => 1,
            'is_active' => true,
        ], UploadedFile::fake()->image('logo.jpg'), null);

        $this->assertSame('Divisi Riset', $division->name);
        $this->assertNotNull($division->logo);
        Storage::disk('public')->assertExists($division->logo);
    }

    #[Test]
    public function validasi_divisi_yang_tidak_valid_ditolak(): void
    {
        $request = new StoreDivisionRequest;
        $validator = validator([
            'name' => '',
            'slug' => '',
            'is_active' => 'foo',
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('name', $validator->errors()->toArray());
        $this->assertArrayHasKey('slug', $validator->errors()->toArray());
        $this->assertArrayHasKey('is_active', $validator->errors()->toArray());
    }

    #[Test]
    public function update_divisi_mengganti_logo_dan_membersihkan_file_lama(): void
    {
        $oldLogo = UploadedFile::fake()->image('old-logo.jpg')->store('divisions/logos', 'public');
        $division = Division::query()->create([
            'name' => 'Divisi Lama',
            'slug' => 'divisi-lama',
            'logo' => $oldLogo,
            'order_number' => 1,
            'is_active' => true,
        ]);

        $updated = app(DivisionService::class)->update($division, [
            'name' => 'Divisi Baru',
            'slug' => 'divisi-baru',
            'short_name' => 'Baru',
            'description' => 'Deskripsi baru',
            'order_number' => 2,
            'is_active' => true,
        ], UploadedFile::fake()->image('new-logo.jpg'), null);

        $this->assertSame('Divisi Baru', $updated->name);
        Storage::disk('public')->assertMissing($oldLogo);
        Storage::disk('public')->assertExists($updated->logo);
    }

    #[Test]
    public function delete_divisi_menghapus_file_dan_melakukan_soft_delete(): void
    {
        $logo = UploadedFile::fake()->image('logo.jpg')->store('divisions/logos', 'public');
        $division = Division::query()->create([
            'name' => 'Divisi Hapus',
            'slug' => 'divisi-hapus',
            'logo' => $logo,
            'order_number' => 1,
            'is_active' => true,
        ]);

        app(DivisionService::class)->delete($division);

        Storage::disk('public')->assertMissing($logo);
        $this->assertSoftDeleted('divisions', ['id' => $division->id]);
    }

    #[Test]
    public function filter_search_dan_status_aktif_divisi_berfungsi(): void
    {
        Division::query()->create([
            'name' => 'Divisi Target',
            'slug' => 'divisi-target',
            'order_number' => 1,
            'is_active' => true,
        ]);
        Division::query()->create([
            'name' => 'Divisi Arsip',
            'slug' => 'divisi-arsip',
            'order_number' => 2,
            'is_active' => false,
        ]);

        $result = app(DivisionService::class)->paginate([
            'search' => 'Target',
            'is_active' => 'true',
        ]);

        $this->assertCount(1, $result->items());
        $this->assertSame('Divisi Target', $result->items()[0]->name);
    }

    #[Test]
    public function divisi_nonaktif_tidak_tampil_di_halaman_publik(): void
    {
        Division::query()->create([
            'name' => 'Divisi Aktif',
            'slug' => 'divisi-aktif',
            'order_number' => 1,
            'is_active' => true,
        ]);
        Division::query()->create([
            'name' => 'Divisi Nonaktif',
            'slug' => 'divisi-nonaktif',
            'order_number' => 2,
            'is_active' => false,
        ]);

        $this->get(route('public.division.index'))
            ->assertOk()
            ->assertSee('Divisi Aktif')
            ->assertDontSee('Divisi Nonaktif');

        $this->get(route('public.division.show', 'divisi-nonaktif'))
            ->assertNotFound();
    }

    #[Test]
    public function divisi_tanpa_input_urutan_otomatis_diletakkan_di_akhir_dan_bisa_diurutkan_ulang(): void
    {
        $service = app(DivisionService::class);

        $first = Division::query()->create([
            'name' => 'Divisi Pertama',
            'slug' => 'divisi-pertama',
            'order_number' => 1,
            'is_active' => true,
        ]);

        $second = $service->create([
            'name' => 'Divisi Kedua',
            'slug' => 'divisi-kedua',
            'is_active' => true,
        ], null, null);

        $this->assertSame(2, $second->order_number);

        $service->reorder([$second->id, $first->id]);

        $this->assertSame(1, $second->fresh()->order_number);
        $this->assertSame(2, $first->fresh()->order_number);
    }

    private function adminAuth(): object
    {
        return (object) [
            'id' => 'admin-1',
            'username' => 'ifs-admin',
            'akses' => ['Divisi'],
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
