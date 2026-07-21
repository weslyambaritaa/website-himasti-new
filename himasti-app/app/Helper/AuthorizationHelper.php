<?php

namespace App\Helper;

class AuthorizationHelper
{
    private const ADMIN_USERNAME_PREFIX = 'ifs';

    public static function hasAdminUsernamePrefix(?string $username): bool
    {
        return is_string($username) && str_starts_with($username, self::ADMIN_USERNAME_PREFIX);
    }

    public static function canAccessAdminArea(?object $auth): bool
    {
        if (! $auth) {
            return false;
        }

        return self::hasAdminUsernamePrefix($auth->username ?? null);
    }

    public static function hasAccess(?object $auth, string $requiredAccess): bool
    {
        if (! $auth) {
            return false;
        }

        $akses = is_array($auth->akses ?? null) ? $auth->akses : [];

        return in_array($requiredAccess, $akses, true);
    }

    public static function getAdminNavigation(?object $auth): array
    {
        if (! self::canAccessAdminArea($auth)) {
            return [];
        }

        $navigation = [
            [
                'title' => 'Main',
                'items' => [
                    [
                        'title' => 'Dashboard',
                        'url' => route('home'),
                    ],
                ],
            ],
        ];

        if (self::hasAccess($auth, 'Todo')) {
            $navigation[0]['items'][] = [
                'title' => 'Todo',
                'url' => route('todo'),
            ];
        }

        $adminItems = collect(ConstHelper::getAdminModuleNavigation())
            ->filter(fn (array $item) => self::hasAccess($auth, $item['access']))
            ->map(fn (array $item) => [
                'title' => $item['title'],
                'url' => route($item['route']),
            ])
            ->values()
            ->all();

        if ($adminItems !== []) {
            $navigation[] = [
                'title' => 'Admin',
                'items' => $adminItems,
            ];
        }

        return $navigation;
    }
}
