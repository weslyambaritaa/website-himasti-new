<?php

namespace Tests\Unit\Helper;

use App\Helper\ConstHelper;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ConstHelperTest extends TestCase
{
    #[Test]
    public function get_option_roles_returns_final_roles_order()
    {
        $expectedRoles = [
            'Admin',
            'Todo',
            'Profil Organisasi',
            'Banner',
            'Berita',
            'Kegiatan',
            'Divisi',
            'Anggota Divisi',
            'Program Kerja',
            'Dokumentasi',
            'Postingan Instagram',
            'Layanan',
            'Pengaturan',
        ];
        $result = ConstHelper::getOptionRoles();
        $this->assertEquals($expectedRoles, $result);
        $this->assertIsArray($result);
        $this->assertContainsOnly('string', $result);
    }

    #[Test]
    public function option_roles_constant_contains_correct_values()
    {
        $expectedRoles = [
            'Admin',
            'Todo',
            'Profil Organisasi',
            'Banner',
            'Berita',
            'Kegiatan',
            'Divisi',
            'Anggota Divisi',
            'Program Kerja',
            'Dokumentasi',
            'Postingan Instagram',
            'Layanan',
            'Pengaturan',
        ];
        $constantValue = ConstHelper::OPTION_ROLES;
        $this->assertEquals($expectedRoles, $constantValue);
        $this->assertCount(13, $constantValue);
    }

    #[Test]
    public function get_option_roles_always_returns_consistent_result()
    {
        // =====================================
        // Arrange (Persiapan)
        // =====================================
        // Tidak ada persiapan khusus

        // =====================================
        // Act (Aksi)
        // =====================================
        $firstCall = ConstHelper::getOptionRoles();
        $secondCall = ConstHelper::getOptionRoles();

        // =====================================
        // Assert (Verifikasi)
        // =====================================
        $this->assertEquals($firstCall, $secondCall);
    }
}
