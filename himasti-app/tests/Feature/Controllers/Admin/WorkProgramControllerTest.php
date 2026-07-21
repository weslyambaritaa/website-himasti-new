<?php

namespace Tests\Feature\Controllers\Admin;

use App\Http\Controllers\Admin\WorkProgramController;
use App\Models\Division;
use App\Models\Documentation;
use App\Models\WorkProgram;
use App\Services\WorkProgramService;
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

class WorkProgramControllerTest extends TestCase
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
    public function admin_dapat_membuka_index_program_kerja(): void
    {
        Inertia::shouldReceive('always')->andReturnUsing(fn ($value) => new \Inertia\AlwaysProp($value));
        $rendered = Mockery::mock(Response::class);
        Inertia::shouldReceive('render')->once()->with('admin/work-program/index-page', Mockery::any())->andReturn($rendered);

        $controller = app(WorkProgramController::class);
        $request = Request::create('/admin/program-kerja', 'GET');
        $request->attributes->set('auth', $this->adminAuth());

        $response = $controller->index($request);

        $this->assertSame($rendered, $response);
    }

    #[Test]
    public function non_admin_ditolak_dari_modul_program_kerja(): void
    {
        $controller = app(WorkProgramController::class);
        $request = Request::create('/admin/program-kerja', 'GET');
        $request->attributes->set('auth', $this->nonAdminAuth());

        try {
            $controller->index($request);
            $this->fail('Program kerja seharusnya menghasilkan 403 tanpa akses yang sesuai.');
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
        }
    }

    #[Test]
    public function create_valid_berhasil_dan_cover_tersimpan(): void
    {
        $division = $this->createDivision();
        $service = app(WorkProgramService::class);

        $workProgram = $service->create([
            'division_id' => $division->id,
            'name' => 'Seminar Teknologi',
            'slug' => '',
            'description' => 'Deskripsi program kerja',
            'status' => 'planned',
            'year' => 2026,
            'start_date' => '2026-07-01',
            'end_date' => '2026-07-02',
            'order_number' => 1,
            'is_featured' => true,
            'is_published' => true,
        ], UploadedFile::fake()->image('cover.jpg'));

        $this->assertSame('seminar-teknologi', $workProgram->slug);
        $this->assertNotNull($workProgram->cover_image);
        Storage::disk('public')->assertExists($workProgram->cover_image);
    }

    #[Test]
    public function create_invalid_ditolak(): void
    {
        $request = new \App\Http\Requests\Admin\StoreWorkProgramRequest;
        $validator = validator([
            'name' => '',
            'status' => 'invalid',
            'year' => 'abc',
            'end_date' => '2026-01-01',
            'start_date' => '2026-02-01',
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('division_id', $validator->errors()->toArray());
        $this->assertArrayHasKey('name', $validator->errors()->toArray());
        $this->assertArrayHasKey('status', $validator->errors()->toArray());
        $this->assertArrayHasKey('year', $validator->errors()->toArray());
        $this->assertArrayHasKey('end_date', $validator->errors()->toArray());
    }

    #[Test]
    public function update_berhasil_dan_file_lama_dihapus(): void
    {
        $division = $this->createDivision();
        $oldCover = UploadedFile::fake()->image('old.jpg')->store('work-programs', 'public');
        $service = app(WorkProgramService::class);
        $workProgram = WorkProgram::query()->create([
            'division_id' => $division->id,
            'name' => 'Program Lama',
            'slug' => 'program-lama',
            'cover_image' => $oldCover,
            'status' => 'planned',
            'year' => 2026,
            'order_number' => 1,
            'is_featured' => false,
            'is_published' => true,
        ]);

        $updated = $service->update($workProgram, [
            'division_id' => $division->id,
            'name' => 'Program Baru',
            'slug' => '',
            'description' => 'Konten baru',
            'status' => 'ongoing',
            'year' => 2027,
            'start_date' => '2027-01-01',
            'end_date' => '2027-01-02',
            'order_number' => 2,
            'is_featured' => true,
            'is_published' => false,
        ], UploadedFile::fake()->image('new.jpg'));

        $this->assertSame('program-baru', $updated->slug);
        $this->assertSame('ongoing', $updated->status);
        Storage::disk('public')->assertMissing($oldCover);
        Storage::disk('public')->assertExists($updated->cover_image);
    }

    #[Test]
    public function delete_melakukan_soft_delete_dan_melepas_relasi_dokumentasi(): void
    {
        $division = $this->createDivision();
        $service = app(WorkProgramService::class);
        $workProgram = WorkProgram::query()->create([
            'division_id' => $division->id,
            'name' => 'Program Hapus',
            'slug' => 'program-hapus',
            'status' => 'planned',
            'year' => 2026,
            'order_number' => 1,
            'is_featured' => false,
            'is_published' => true,
        ]);
        $documentation = Documentation::query()->create([
            'work_program_id' => $workProgram->id,
            'title' => 'Dokumentasi Program',
            'slug' => 'dokumentasi-program',
        ]);

        $service->delete($workProgram);

        $this->assertSoftDeleted('work_programs', ['id' => $workProgram->id]);
        $this->assertDatabaseHas('documentations', [
            'id' => $documentation->id,
            'work_program_id' => null,
        ]);
    }

    #[Test]
    public function slug_otomatis_unik(): void
    {
        $division = $this->createDivision();
        $service = app(WorkProgramService::class);

        WorkProgram::query()->create([
            'division_id' => $division->id,
            'name' => 'Program Kerja',
            'slug' => 'program-kerja',
            'status' => 'planned',
            'year' => 2026,
            'order_number' => 1,
            'is_featured' => false,
            'is_published' => true,
        ]);

        $created = $service->create([
            'division_id' => $division->id,
            'name' => 'Program Kerja',
            'slug' => '',
            'status' => 'planned',
            'year' => 2027,
            'order_number' => 2,
            'is_featured' => false,
            'is_published' => true,
        ], null);

        $this->assertSame('program-kerja-2', $created->slug);
    }

    #[Test]
    public function filter_divisi_tahun_dan_status_berfungsi(): void
    {
        $divisionA = $this->createDivision('Divisi A', 'divisi-a');
        $divisionB = $this->createDivision('Divisi B', 'divisi-b');
        $service = app(WorkProgramService::class);

        WorkProgram::query()->create([
            'division_id' => $divisionA->id,
            'name' => 'Target',
            'slug' => 'target',
            'status' => 'ongoing',
            'year' => 2026,
            'order_number' => 1,
            'is_featured' => false,
            'is_published' => true,
        ]);

        WorkProgram::query()->create([
            'division_id' => $divisionB->id,
            'name' => 'Bukan Target',
            'slug' => 'bukan-target',
            'status' => 'planned',
            'year' => 2025,
            'order_number' => 1,
            'is_featured' => false,
            'is_published' => true,
        ]);

        $result = $service->paginate([
            'division_id' => $divisionA->id,
            'year' => 2026,
            'status' => 'ongoing',
        ]);

        $this->assertCount(1, $result->items());
        $this->assertSame('Target', $result->items()[0]->name);
    }

    #[Test]
    public function publik_hanya_menampilkan_program_published(): void
    {
        $division = $this->createDivision();

        WorkProgram::query()->create([
            'division_id' => $division->id,
            'name' => 'Program Tampil',
            'slug' => 'program-tampil',
            'status' => 'completed',
            'year' => 2026,
            'order_number' => 1,
            'is_featured' => true,
            'is_published' => true,
        ]);

        WorkProgram::query()->create([
            'division_id' => $division->id,
            'name' => 'Program Sembunyi',
            'slug' => 'program-sembunyi',
            'status' => 'planned',
            'year' => 2026,
            'order_number' => 2,
            'is_featured' => false,
            'is_published' => false,
        ]);

        $this->get(route('work-programs.index'))
            ->assertOk()
            ->assertSee('Program Tampil')
            ->assertDontSee('Program Sembunyi');

        $this->get(route('work-programs.show', 'program-tampil'))
            ->assertOk()
            ->assertSee('Program Tampil');

        $this->get(route('work-programs.show', 'program-sembunyi'))
            ->assertNotFound();
    }

    #[Test]
    public function program_kerja_tanpa_input_urutan_otomatis_diletakkan_di_akhir_dan_bisa_diurutkan_ulang(): void
    {
        $division = $this->createDivision();
        $service = app(WorkProgramService::class);

        $first = WorkProgram::query()->create([
            'division_id' => $division->id,
            'name' => 'Program Pertama',
            'slug' => 'program-pertama',
            'status' => 'planned',
            'year' => 2026,
            'order_number' => 1,
            'is_featured' => false,
            'is_published' => true,
        ]);

        $second = $service->create([
            'division_id' => $division->id,
            'name' => 'Program Kedua',
            'status' => 'planned',
            'year' => 2027,
            'is_featured' => false,
            'is_published' => true,
        ], null);

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
            'akses' => ['Program Kerja'],
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

    private function createDivision(string $name = 'Divisi Riset', string $slug = 'divisi-riset'): Division
    {
        return Division::query()->create([
            'name' => $name,
            'slug' => $slug,
            'is_active' => true,
            'order_number' => 1,
        ]);
    }
}
