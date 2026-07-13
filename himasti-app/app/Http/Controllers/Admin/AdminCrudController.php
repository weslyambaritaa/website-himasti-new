<?php

namespace App\Http\Controllers\Admin;

use App\Helper\AuthorizationHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

abstract class AdminCrudController extends Controller
{
    protected function ensureDashboardAccess(Request $request): void
    {
        $auth = $request->attributes->get('auth');
        if (! AuthorizationHelper::canAccessAdminArea($auth)) {
            abort(403, 'Akun Anda tidak diizinkan mengakses area admin.');
        }
    }

    protected function ensureModuleAccess(Request $request, string $requiredAccess): void
    {
        $this->ensureDashboardAccess($request);

        $auth = $request->attributes->get('auth');
        if (! AuthorizationHelper::hasAccess($auth, $requiredAccess)) {
            abort(403, 'Anda tidak memiliki izin untuk mengakses modul ini.');
        }
    }
}
