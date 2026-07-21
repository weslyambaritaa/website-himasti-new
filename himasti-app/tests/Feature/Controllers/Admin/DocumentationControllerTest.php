<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Division;
use App\Models\Documentation;
use App\Models\DocumentationImage;
use App\Models\WorkProgram;
use App\Services\DocumentationService;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class DocumentationControllerTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
    }

    #[Test]
    public function filter_index_dokumentasi_berdasarkan_search_tahun_dan_program_kerja_berfungsi(): void
    {
        $division = $this->createDivision();
        $targetProgram = $this->createWorkProgram($division, 'Program Target', 'program-target', 2026);
        $otherProgram = $this->createWorkProgram($division, 'Program Lain', 'program-lain', 2025);

        Documentation::query()->create([
            'work_program_id' => $targetProgram->id,
            'title' => 'Seminar Teknologi',
            'slug' => 'seminar-teknologi',
            'location' => 'Lab Komputer',
            'event_date' => '2026-07-01',
        ]);
        Documentation::query()->create([
            'work_program_id' => $otherProgram->id,
            'title' => 'Workshop Lama',
            'slug' => 'workshop-lama',
            'location' => 'Ruang Sidang',
            'event_date' => '2025-07-01',
        ]);

        $result = app(DocumentationService::class)->paginate([
            'search' => 'Teknologi',
            'year' => 2026,
            'work_program_id' => $targetProgram->id,
        ]);

        $this->assertCount(1, $result->items());
        $this->assertSame('Seminar Teknologi', $result->items()[0]->title);
    }

    #[Test]
    public function count_gambar_dan_data_fallback_cover_tersedia(): void
    {
        $division = $this->createDivision();
        $program = $this->createWorkProgram($division, 'Program Dokumentasi', 'program-dokumentasi', 2026);
        $documentation = Documentation::query()->create([
            'work_program_id' => $program->id,
            'title' => 'Dokumentasi Target',
            'slug' => 'dokumentasi-target',
            'event_date' => '2026-07-01',
            'cover_image' => null,
        ]);

        DocumentationImage::query()->create([
            'documentation_id' => $documentation->id,
            'image' => UploadedFile::fake()->image('foto-1.jpg')->store('documentations/images', 'public'),
            'caption' => 'Foto 1',
            'order_number' => 1,
        ]);
        DocumentationImage::query()->create([
            'documentation_id' => $documentation->id,
            'image' => UploadedFile::fake()->image('foto-2.jpg')->store('documentations/images', 'public'),
            'caption' => 'Foto 2',
            'order_number' => 2,
        ]);

        $item = app(DocumentationService::class)->paginate(['search' => 'Target'])->items()[0];

        $this->assertSame(2, $item->images_count);
        $this->assertNull($item->cover_image);
        $this->assertNotEmpty($item->images[0]->image);
    }

    #[Test]
    public function delete_dokumentasi_membersihkan_cover_dan_gambar(): void
    {
        $division = $this->createDivision();
        $program = $this->createWorkProgram($division, 'Program Hapus', 'program-hapus', 2026);
        $cover = UploadedFile::fake()->image('cover.jpg')->store('documentations/covers', 'public');
        $documentation = Documentation::query()->create([
            'work_program_id' => $program->id,
            'title' => 'Dokumentasi Hapus',
            'slug' => 'dokumentasi-hapus',
            'event_date' => '2026-07-01',
            'cover_image' => $cover,
        ]);
        $imagePath = UploadedFile::fake()->image('foto.jpg')->store('documentations/images', 'public');
        DocumentationImage::query()->create([
            'documentation_id' => $documentation->id,
            'image' => $imagePath,
            'order_number' => 1,
        ]);

        app(DocumentationService::class)->delete($documentation->load('images'));

        Storage::disk('public')->assertMissing($cover);
        Storage::disk('public')->assertMissing($imagePath);
        $this->assertSoftDeleted('documentations', ['id' => $documentation->id]);
        $this->assertDatabaseMissing('documentation_images', ['documentation_id' => $documentation->id]);
    }

    #[Test]
    public function pagination_dokumentasi_mempertahankan_query_string_filter(): void
    {
        $division = $this->createDivision();
        $program = $this->createWorkProgram($division, 'Program 2026', 'program-2026', 2026);

        Documentation::query()->create([
            'work_program_id' => $program->id,
            'title' => 'Dokumentasi 1',
            'slug' => 'dokumentasi-1',
            'event_date' => '2026-07-01',
        ]);
        Documentation::query()->create([
            'work_program_id' => $program->id,
            'title' => 'Dokumentasi 2',
            'slug' => 'dokumentasi-2',
            'event_date' => '2026-07-02',
        ]);

        $this->app['request']->query->replace([
            'year' => 2026,
            'work_program_id' => $program->id,
        ]);

        $result = app(DocumentationService::class)->paginate([
            'year' => 2026,
            'work_program_id' => $program->id,
        ], 1);

        $this->assertStringContainsString('year=2026', $result->nextPageUrl());
        $this->assertStringContainsString('work_program_id='.$program->id, $result->nextPageUrl());
    }

    private function createDivision(): Division
    {
        return Division::query()->create([
            'name' => 'Divisi Media',
            'slug' => 'divisi-media',
            'order_number' => 1,
            'is_active' => true,
        ]);
    }

    private function createWorkProgram(Division $division, string $name, string $slug, int $year): WorkProgram
    {
        return WorkProgram::query()->create([
            'division_id' => $division->id,
            'name' => $name,
            'slug' => $slug,
            'status' => 'completed',
            'year' => $year,
            'order_number' => 1,
            'is_featured' => false,
            'is_published' => true,
        ]);
    }
}
