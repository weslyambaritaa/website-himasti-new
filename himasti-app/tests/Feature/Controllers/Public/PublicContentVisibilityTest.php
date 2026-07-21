<?php

namespace Tests\Feature\Controllers\Public;

use App\Models\Division;
use App\Models\Event;
use App\Models\News;
use App\Models\WorkProgram;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Carbon;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PublicContentVisibilityTest extends TestCase
{
    use DatabaseMigrations;

    #[Test]
    public function detail_draft_dan_hidden_menghasilkan_404(): void
    {
        News::query()->create([
            'title' => 'Draft',
            'slug' => 'berita-draft',
            'status' => 'draft',
            'published_at' => Carbon::now()->subDay(),
        ]);

        Event::query()->create([
            'title' => 'Hidden Event',
            'slug' => 'kegiatan-hidden',
            'start_date' => Carbon::now()->addDay(),
            'status' => 'upcoming',
            'is_published' => false,
        ]);

        $division = Division::query()->create([
            'name' => 'Divisi Nonaktif',
            'slug' => 'divisi-nonaktif',
            'is_active' => false,
        ]);

        WorkProgram::query()->create([
            'division_id' => $division->id,
            'name' => 'Program Draft',
            'slug' => 'program-draft',
            'status' => 'draft',
            'year' => 2026,
            'is_published' => false,
        ]);

        $this->get(route('public.news.show', 'berita-draft'))->assertNotFound();
        $this->get(route('public.event.show', 'kegiatan-hidden'))->assertNotFound();
        $this->get(route('public.division.show', 'divisi-nonaktif'))->assertNotFound();
        $this->get(route('work-programs.show', 'program-draft'))->assertNotFound();
    }
}
