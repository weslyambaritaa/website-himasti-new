<?php

namespace Tests\Feature\Routes;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class WebRouteStructureTest extends TestCase
{
    #[Test]
    public function route_home_mengarah_ke_admin_dashboard()
    {
        $this->assertSame('/admin/dashboard', route('home', absolute: false));
    }

    #[Test]
    public function route_public_home_mengarah_ke_root()
    {
        $this->assertSame('/', route('public.home', absolute: false));
    }

    #[Test]
    public function route_hak_akses_dan_todo_menggunakan_prefix_admin()
    {
        $this->assertSame('/admin/hak-akses', route('hak-akses', absolute: false));
        $this->assertSame('/admin/todo', route('todo', absolute: false));
    }

    #[Test]
    public function route_kegiatan_dan_program_kerja_menggunakan_path_bahasa_indonesia()
    {
        $this->assertSame('/kegiatan', route('public.event.index', absolute: false));
        $this->assertSame('/program-kerja', route('work-programs.index', absolute: false));
    }
}
