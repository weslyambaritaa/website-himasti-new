<?php

namespace Tests\Feature\Controllers\Admin;

use App\Http\Requests\Admin\StoreDivisionMemberRequest;
use App\Models\Division;
use App\Models\DivisionMember;
use App\Services\DivisionMemberService;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class DivisionMemberControllerTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
    }

    #[Test]
    public function create_anggota_divisi_berhasil_dan_foto_tersimpan(): void
    {
        $division = $this->createDivision();

        $member = app(DivisionMemberService::class)->create([
            'division_id' => $division->id,
            'name' => 'Budi',
            'position' => 'Ketua Divisi',
            'order_number' => 1,
            'period' => '2026/2027',
            'is_active' => true,
        ], UploadedFile::fake()->image('budi.jpg'));

        $this->assertSame('Budi', $member->name);
        Storage::disk('public')->assertExists($member->photo);
    }

    #[Test]
    public function update_anggota_divisi_membersihkan_foto_lama(): void
    {
        $division = $this->createDivision();
        $oldPhoto = UploadedFile::fake()->image('old.jpg')->store('division-members', 'public');
        $member = DivisionMember::query()->create([
            'division_id' => $division->id,
            'name' => 'Lama',
            'position' => 'Sekretaris',
            'photo' => $oldPhoto,
            'order_number' => 1,
            'period' => '2025/2026',
            'is_active' => true,
        ]);

        $updated = app(DivisionMemberService::class)->update($member, [
            'division_id' => $division->id,
            'name' => 'Baru',
            'position' => 'Bendahara',
            'order_number' => 2,
            'period' => '2026/2027',
            'is_active' => false,
        ], UploadedFile::fake()->image('new.jpg'));

        $this->assertSame('Baru', $updated->name);
        $this->assertFalse($updated->is_active);
        Storage::disk('public')->assertMissing($oldPhoto);
        Storage::disk('public')->assertExists($updated->photo);
    }

    #[Test]
    public function delete_anggota_divisi_menghapus_foto(): void
    {
        $division = $this->createDivision();
        $photo = UploadedFile::fake()->image('hapus.jpg')->store('division-members', 'public');
        $member = DivisionMember::query()->create([
            'division_id' => $division->id,
            'name' => 'Hapus',
            'position' => 'Anggota',
            'photo' => $photo,
            'order_number' => 1,
            'period' => '2026/2027',
            'is_active' => true,
        ]);

        app(DivisionMemberService::class)->delete($member);

        Storage::disk('public')->assertMissing($photo);
        $this->assertSoftDeleted('division_members', ['id' => $member->id]);
    }

    #[Test]
    public function filter_divisi_periode_dan_status_aktif_berfungsi(): void
    {
        $targetDivision = $this->createDivision('Divisi Target', 'divisi-target');
        $otherDivision = $this->createDivision('Divisi Lain', 'divisi-lain');

        DivisionMember::query()->create([
            'division_id' => $targetDivision->id,
            'name' => 'Target',
            'position' => 'Koordinator',
            'period' => '2026/2027',
            'order_number' => 1,
            'is_active' => true,
        ]);
        DivisionMember::query()->create([
            'division_id' => $otherDivision->id,
            'name' => 'Lain',
            'position' => 'Koordinator',
            'period' => '2025/2026',
            'order_number' => 2,
            'is_active' => false,
        ]);

        $result = app(DivisionMemberService::class)->paginate([
            'division_id' => $targetDivision->id,
            'period' => '2026/2027',
            'is_active' => 'true',
        ]);

        $this->assertCount(1, $result->items());
        $this->assertSame('Target', $result->items()[0]->name);
    }

    #[Test]
    public function validasi_anggota_divisi_yang_tidak_valid_ditolak(): void
    {
        $request = new StoreDivisionMemberRequest;
        $validator = validator([
            'division_id' => '',
            'name' => '',
            'position' => '',
            'photo' => 'bukan-file',
            'order_number' => -1,
            'period' => str_repeat('a', 260),
            'is_active' => 'foo',
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('division_id', $validator->errors()->toArray());
        $this->assertArrayHasKey('name', $validator->errors()->toArray());
        $this->assertArrayHasKey('position', $validator->errors()->toArray());
        $this->assertArrayHasKey('order_number', $validator->errors()->toArray());
        $this->assertArrayHasKey('period', $validator->errors()->toArray());
        $this->assertArrayHasKey('is_active', $validator->errors()->toArray());
    }

    #[Test]
    public function anggota_nonaktif_tidak_tampil_pada_detail_divisi_publik(): void
    {
        $division = $this->createDivision();

        DivisionMember::query()->create([
            'division_id' => $division->id,
            'name' => 'Aktif',
            'position' => 'Ketua',
            'period' => '2026/2027',
            'order_number' => 1,
            'is_active' => true,
        ]);
        DivisionMember::query()->create([
            'division_id' => $division->id,
            'name' => 'Nonaktif',
            'position' => 'Wakil',
            'period' => '2026/2027',
            'order_number' => 2,
            'is_active' => false,
        ]);

        $this->get(route('public.division.show', $division->slug))
            ->assertOk()
            ->assertSee('Aktif')
            ->assertDontSee('Nonaktif');
    }

    #[Test]
    public function anggota_divisi_tanpa_input_urutan_otomatis_diletakkan_di_akhir_dan_bisa_diurutkan_ulang(): void
    {
        $division = $this->createDivision();
        $service = app(DivisionMemberService::class);

        $first = DivisionMember::query()->create([
            'division_id' => $division->id,
            'name' => 'Anggota Pertama',
            'position' => 'Ketua',
            'order_number' => 1,
            'is_active' => true,
        ]);

        $second = $service->create([
            'division_id' => $division->id,
            'name' => 'Anggota Kedua',
            'position' => 'Sekretaris',
            'is_active' => true,
        ], null);

        $this->assertSame(2, $second->order_number);

        $service->reorder([$second->id, $first->id]);

        $this->assertSame(1, $second->fresh()->order_number);
        $this->assertSame(2, $first->fresh()->order_number);
    }

    private function createDivision(string $name = 'Divisi Riset', string $slug = 'divisi-riset'): Division
    {
        return Division::query()->create([
            'name' => $name,
            'slug' => $slug,
            'order_number' => 1,
            'is_active' => true,
        ]);
    }
}
