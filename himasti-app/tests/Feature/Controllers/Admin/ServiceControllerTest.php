<?php

namespace Tests\Feature\Controllers\Admin;

use App\Http\Requests\Admin\StoreServiceRequest;
use App\Models\Service;
use App\Services\ServiceItemService;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ServiceControllerTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
    }

    #[Test]
    public function create_layanan_berhasil_dan_logo_tersimpan(): void
    {
        $service = app(ServiceItemService::class)->create([
            'name' => 'Portal Akademik',
            'description' => 'Portal utama mahasiswa',
            'icon' => 'globe',
            'url' => 'https://himasti.test/portal',
            'order_number' => 1,
            'is_active' => true,
        ], UploadedFile::fake()->image('logo.jpg'));

        $this->assertSame('Portal Akademik', $service->name);
        Storage::disk('public')->assertExists($service->logo);
    }

    #[Test]
    public function update_layanan_membersihkan_logo_lama(): void
    {
        $oldLogo = UploadedFile::fake()->image('old-logo.jpg')->store('services', 'public');
        $service = Service::query()->create([
            'name' => 'Layanan Lama',
            'description' => 'Deskripsi lama',
            'icon' => 'old',
            'logo' => $oldLogo,
            'url' => 'https://himasti.test/lama',
            'order_number' => 1,
            'is_active' => false,
        ]);

        $updated = app(ServiceItemService::class)->update($service, [
            'name' => 'Layanan Baru',
            'description' => 'Deskripsi baru',
            'icon' => 'new',
            'url' => 'https://himasti.test/baru',
            'order_number' => 2,
            'is_active' => true,
        ], UploadedFile::fake()->image('new-logo.jpg'));

        $this->assertSame('Layanan Baru', $updated->name);
        $this->assertTrue($updated->is_active);
        Storage::disk('public')->assertMissing($oldLogo);
        Storage::disk('public')->assertExists($updated->logo);
    }

    #[Test]
    public function delete_layanan_membersihkan_logo(): void
    {
        $logo = UploadedFile::fake()->image('hapus.jpg')->store('services', 'public');
        $service = Service::query()->create([
            'name' => 'Layanan Hapus',
            'url' => 'https://himasti.test/hapus',
            'logo' => $logo,
            'order_number' => 1,
            'is_active' => true,
        ]);

        app(ServiceItemService::class)->delete($service);

        Storage::disk('public')->assertMissing($logo);
        $this->assertDatabaseMissing('services', ['id' => $service->id]);
    }

    #[Test]
    public function validasi_url_layanan_berfungsi(): void
    {
        $request = new StoreServiceRequest;
        $validator = validator([
            'name' => '',
            'url' => 'bukan-url',
            'is_active' => 'foo',
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('name', $validator->errors()->toArray());
        $this->assertArrayHasKey('url', $validator->errors()->toArray());
        $this->assertArrayHasKey('is_active', $validator->errors()->toArray());
    }

    #[Test]
    public function filter_status_aktif_layanan_berfungsi(): void
    {
        Service::query()->create([
            'name' => 'Layanan Aktif',
            'url' => 'https://himasti.test/aktif',
            'order_number' => 1,
            'is_active' => true,
        ]);
        Service::query()->create([
            'name' => 'Layanan Nonaktif',
            'url' => 'https://himasti.test/nonaktif',
            'order_number' => 2,
            'is_active' => false,
        ]);

        $result = app(ServiceItemService::class)->paginate([
            'is_active' => 'true',
        ]);

        $this->assertCount(1, $result->items());
        $this->assertSame('Layanan Aktif', $result->items()[0]->name);
    }

    #[Test]
    public function layanan_nonaktif_tidak_tampil_di_halaman_publik(): void
    {
        Service::query()->create([
            'name' => 'Layanan Aktif',
            'url' => 'https://himasti.test/aktif',
            'order_number' => 1,
            'is_active' => true,
        ]);
        Service::query()->create([
            'name' => 'Layanan Nonaktif',
            'url' => 'https://himasti.test/nonaktif',
            'order_number' => 2,
            'is_active' => false,
        ]);

        $this->get(route('public.service.index'))
            ->assertOk()
            ->assertSee('Layanan Aktif')
            ->assertDontSee('Layanan Nonaktif');
    }

    #[Test]
    public function layanan_tanpa_input_urutan_otomatis_diletakkan_di_akhir_dan_bisa_diurutkan_ulang(): void
    {
        $service = app(ServiceItemService::class);

        $first = Service::query()->create([
            'name' => 'Layanan Pertama',
            'url' => 'https://himasti.test/pertama',
            'order_number' => 1,
            'is_active' => true,
        ]);

        $second = $service->create([
            'name' => 'Layanan Kedua',
            'url' => 'https://himasti.test/kedua',
            'is_active' => true,
        ], null);

        $this->assertSame(2, $second->order_number);

        $service->reorder([$second->id, $first->id]);

        $this->assertSame(1, $second->fresh()->order_number);
        $this->assertSame(2, $first->fresh()->order_number);
    }
}
