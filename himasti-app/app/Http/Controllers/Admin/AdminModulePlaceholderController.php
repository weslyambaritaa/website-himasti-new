<?php

namespace App\Http\Controllers\Admin;

use App\Helper\AuthorizationHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminModulePlaceholderController extends Controller
{
    public function __invoke(Request $request, string $module)
    {
        $auth = $request->attributes->get('auth');
        if (! AuthorizationHelper::canAccessAdminArea($auth) || ! AuthorizationHelper::hasAccess($auth, 'Admin')) {
            abort(403, 'Anda tidak memiliki izin untuk mengakses modul ini.');
        }

        return Inertia::render('admin/module-placeholder-page', [
            'pageName' => Inertia::always($module),
            'moduleName' => Inertia::always($module),
        ]);
    }
}
