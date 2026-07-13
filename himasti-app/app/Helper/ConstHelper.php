<?php

namespace App\Helper;

class ConstHelper
{
    /**
     * Daftar role yang tersedia dalam sistem
     *
     * @var array<int, string>
     */
    const OPTION_ROLES = [
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

    const ADMIN_MODULE_NAVIGATION = [
        [
            'title' => 'Profil Organisasi',
            'access' => 'Profil Organisasi',
            'route' => 'admin.organization-profile.edit',
        ],
        [
            'title' => 'Hak Akses',
            'access' => 'Admin',
            'route' => 'hak-akses',
        ],
        [
            'title' => 'Banner',
            'access' => 'Banner',
            'route' => 'admin.banner.index',
        ],
        [
            'title' => 'Berita',
            'access' => 'Berita',
            'route' => 'admin.news.index',
        ],
        [
            'title' => 'Kegiatan',
            'access' => 'Kegiatan',
            'route' => 'admin.event.index',
        ],
        [
            'title' => 'Divisi',
            'access' => 'Divisi',
            'route' => 'admin.division.index',
        ],
        [
            'title' => 'Anggota Divisi',
            'access' => 'Anggota Divisi',
            'route' => 'admin.division-member.index',
        ],
        [
            'title' => 'Program Kerja',
            'access' => 'Program Kerja',
            'route' => 'admin.work-programs.index',
        ],
        [
            'title' => 'Dokumentasi',
            'access' => 'Dokumentasi',
            'route' => 'admin.documentation.index',
        ],
        [
            'title' => 'Postingan Instagram',
            'access' => 'Postingan Instagram',
            'route' => 'admin.instagram-post.index',
        ],
        [
            'title' => 'Layanan',
            'access' => 'Layanan',
            'route' => 'admin.service.index',
        ],
        [
            'title' => 'Pengaturan',
            'access' => 'Pengaturan',
            'route' => 'admin.settings.edit',
        ],
    ];

    /**
     * Mendapatkan daftar role yang tersedia dalam urutan terurut
     *
     * @return array<int, string> Daftar role yang sudah diurutkan secara ascending
     *
     * @example
     * $roles = ConstHelper::getOptionRoles();
     * // Returns: ['Admin', 'Todo']
     *
     * @uses self::OPTION_ROLES
     */
    public static function getOptionRoles()
    {
        return self::OPTION_ROLES;
    }

    public static function getAdminModuleNavigation(): array
    {
        return self::ADMIN_MODULE_NAVIGATION;
    }

    const OPTION_ROWS_PER_PAGE = [3, 5, 10, 25, 50, 100];
}
