<?php

namespace App\Http\Middleware;

use App\Helper\AuthorizationHelper;
use App\Helper\ToolsHelper;
use App\Http\Api\UserApi;
use App\Models\Division;
use App\Models\OrganizationProfile;
use App\Services\SettingService;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Throwable;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => fn () => $request->attributes->get('auth'),
            'adminNavigation' => fn () => AuthorizationHelper::getAdminNavigation($request->attributes->get('auth')),
            'publicAuth' => fn () => $this->resolvePublicAuth($request),
            'publicNavigation' => fn () => [
                'items' => $this->resolvePublicNavigationItems(),
            ],
            'publicIdentity' => fn () => app(SettingService::class)->getPublicIdentity(OrganizationProfile::query()->first()),
            'publicProfileMeta' => fn () => OrganizationProfile::query()
                ->select([
                    'organization_name',
                    'short_name',
                    'logo',
                    'address',
                    'email',
                    'phone',
                    'instagram_url',
                    'youtube_url',
                ])
                ->first(),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'appName' => config('app.name'),
        ];
    }

    private function resolvePublicAuth(Request $request): ?array
    {
        if ($request->attributes->has('publicAuthResolved')) {
            $cached = $request->attributes->get('publicAuthResolved');

            return is_array($cached) ? $cached : null;
        }

        $auth = $request->attributes->get('auth');
        if ($auth && isset($auth->username)) {
            $resolved = [
                'username' => $auth->username,
                'canAccessAdmin' => AuthorizationHelper::canAccessAdminArea($auth),
            ];
            $request->attributes->set('publicAuthResolved', $resolved);

            return $resolved;
        }

        $authToken = ToolsHelper::getAuthToken();
        if ($authToken === '') {
            $request->attributes->set('publicAuthResolved', null);

            return null;
        }

        try {
            $response = UserApi::getMe($authToken);
            $user = $response->data->user ?? null;

            if (! $user || ! isset($user->username)) {
                $request->attributes->set('publicAuthResolved', null);

                return null;
            }

            $resolved = [
                'username' => $user->username,
                'canAccessAdmin' => AuthorizationHelper::hasAdminUsernamePrefix($user->username),
            ];
            $request->attributes->set('publicAuthResolved', $resolved);

            return $resolved;
        } catch (Throwable) {
            $request->attributes->set('publicAuthResolved', null);

            return null;
        }
    }

    private function resolvePublicNavigationItems(): array
    {
        $divisions = Division::query()
            ->where('is_active', true)
            ->orderBy('order_number')
            ->get(['id', 'name', 'slug']);

        if ($divisions->isNotEmpty()) {
            return $divisions
                ->map(fn (Division $division) => [
                    'label' => $division->name,
                    'href' => route('public.division.show', $division->slug),
                ])
                ->all();
        }

        return [
            ['label' => 'BPH Inti', 'href' => null],
            ['label' => 'MPH', 'href' => null],
        ];
    }
}
