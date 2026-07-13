<?php

namespace App\Http\Controllers\App\Home;

use App\Helper\AuthorizationHelper;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $auth = $request->attributes->get('auth');
        if (! AuthorizationHelper::canAccessAdminArea($auth)) {
            abort(403, 'Akun Anda tidak diizinkan mengakses area admin.');
        }

        return Inertia::render('admin/dashboard/dashboard-page', [
            'auth' => Inertia::always($auth),
            'pageName' => Inertia::always('Dashboard'),
        ]);
    }
}
