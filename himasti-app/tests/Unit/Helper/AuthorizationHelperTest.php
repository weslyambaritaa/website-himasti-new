<?php

namespace Tests\Unit\Helper;

use App\Helper\AuthorizationHelper;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthorizationHelperTest extends TestCase
{
    #[Test]
    public function username_ifs_dapat_mengakses_area_admin(): void
    {
        $auth = (object) [
            'username' => 'ifsabdullah',
            'akses' => [],
        ];

        $this->assertTrue(AuthorizationHelper::canAccessAdminArea($auth));
    }

    #[Test]
    public function prefix_username_bersifat_case_sensitive(): void
    {
        $this->assertFalse(AuthorizationHelper::canAccessAdminArea((object) ['username' => 'IFSuser']));
        $this->assertFalse(AuthorizationHelper::canAccessAdminArea((object) ['username' => 'Ifsuser']));
    }

    #[Test]
    public function admin_tidak_otomatis_memiliki_akses_modul_lain(): void
    {
        $auth = (object) [
            'username' => 'ifsadmin',
            'akses' => ['Admin'],
        ];

        $this->assertFalse(AuthorizationHelper::hasAccess($auth, 'Banner'));
    }

    #[Test]
    public function menu_sidebar_hanya_memuat_akses_yang_dimiliki(): void
    {
        $auth = (object) [
            'username' => 'ifseditor',
            'akses' => ['Banner', 'Todo', 'Pengaturan'],
        ];

        $navigation = AuthorizationHelper::getAdminNavigation($auth);

        $this->assertCount(2, $navigation);
        $this->assertSame('Dashboard', $navigation[0]['items'][0]['title']);
        $this->assertSame('Todo', $navigation[0]['items'][1]['title']);
        $this->assertSame(['Banner', 'Pengaturan'], array_column($navigation[1]['items'], 'title'));
    }
}
