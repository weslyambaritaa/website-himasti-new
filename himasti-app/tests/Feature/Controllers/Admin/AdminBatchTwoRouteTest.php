<?php

namespace Tests\Feature\Controllers\Admin;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AdminBatchTwoRouteTest extends TestCase
{
    #[Test]
    public function route_batch_dua_admin_terbentuk_dengan_prefix_admin()
    {
        $this->assertSame('/admin/profil-organisasi', route('admin.organization-profile.edit', absolute: false));
        $this->assertSame('/admin/banner', route('admin.banner.index', absolute: false));
        $this->assertSame('/admin/berita', route('admin.news.index', absolute: false));
        $this->assertSame('/admin/event', route('admin.event.index', absolute: false));
        $this->assertSame('/admin/divisi', route('admin.division.index', absolute: false));
        $this->assertSame('/admin/anggota-divisi', route('admin.division-member.index', absolute: false));
        $this->assertSame('/admin/dokumentasi', route('admin.documentation.index', absolute: false));
        $this->assertSame('/admin/instagram-post', route('admin.instagram-post.index', absolute: false));
        $this->assertSame('/admin/layanan', route('admin.service.index', absolute: false));
    }
}
