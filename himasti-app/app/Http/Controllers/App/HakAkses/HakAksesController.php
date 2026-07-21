<?php

namespace App\Http\Controllers\App\HakAkses;

use App\Helper\AuthorizationHelper;
use App\Helper\ConstHelper;
use App\Helper\ToolsHelper;
use App\Http\Api\UserApi;
use App\Http\Controllers\Controller;
use App\Models\HakAksesModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HakAksesController extends Controller
{
    public function index(Request $request)
    {
        $auth = $request->attributes->get('auth');
        if (! AuthorizationHelper::canAccessAdminArea($auth)) {
            abort(403, 'Akun Anda tidak diizinkan mengakses area admin.');
        }

        $isEditor = $this->checkIsEditor($auth);
        if (! $isEditor) {
            abort(403, 'Anda tidak memiliki izin untuk mengakses modul ini.');
        }

        return Inertia::render('app/hak-akses/hak-akses-page', [
            // SELALU diperlukan, tapi LAZY loading
            'aksesList' => function () {
                $aksesList = HakAksesModel::all();

                $response = UserApi::postReqUsersByIds(
                    ToolsHelper::getAuthToken(),
                    $aksesList->pluck('user_id')->unique()->toArray(),
                );

                $usersList = [];
                if ($response && isset($response->data->users)) {
                    $usersList = collect($response->data->users)->map(function ($user) {
                        return (object) $user;
                    })->all();
                }

                foreach ($aksesList as $akses) {
                    $akses->user = collect($usersList)->firstWhere('id', $akses->user_id);
                    $data_akses = explode(',', $akses->akses);
                    sort($data_akses);
                    $akses->data_akses = $data_akses;
                }

                return $aksesList->sortBy(function ($item) {
                    $user = $item->user;

                    return $user ? strtolower($user->name) : '';
                })->values();
            },
            // SELALU diperlukan dan SELALU dikirim
            'pageName' => Inertia::always('Hak Akses'),
            'auth' => Inertia::always($auth),
            'isEditor' => Inertia::always($isEditor),
            'optionRoles' => Inertia::always(ConstHelper::getOptionRoles()),
        ]);
    }

    public function postChange(Request $request)
    {
        $auth = $request->attributes->get('auth');
        if (! AuthorizationHelper::canAccessAdminArea($auth)) {
            abort(403, 'Akun Anda tidak diizinkan mengakses area admin.');
        }

        if (! $this->checkIsEditor($auth)) {
            abort(403, 'Anda tidak memiliki izin untuk mengubah hak akses.');
        }

        $request->validate([
            'userId' => 'required',
            'hakAkses' => 'required|array',
        ]);

        // Hapus akses lama
        HakAksesModel::where('user_id', $request->userId)->delete();

        // Simpan hak akses baru
        HakAksesModel::create([
            'id' => ToolsHelper::generateId(),
            'user_id' => $request->userId,
            'akses' => implode(',', $request->hakAkses),
        ]);

        return back()->with('success', 'Hak akses berhasil diperbarui.');
    }

    public function postDelete(Request $request)
    {
        $auth = $request->attributes->get('auth');
        if (! AuthorizationHelper::canAccessAdminArea($auth)) {
            abort(403, 'Akun Anda tidak diizinkan mengakses area admin.');
        }

        if (! $this->checkIsEditor($auth)) {
            abort(403, 'Anda tidak memiliki izin untuk mengubah hak akses.');
        }

        $request->validate([
            'userId' => 'required',
        ]);

        // Hapus akses
        HakAksesModel::where('user_id', $request->userId)->delete();

        return back()->with('success', 'Hak akses pengguna berhasil dihapus.');
    }

    public function postDeleteSelected(Request $request)
    {
        $auth = $request->attributes->get('auth');
        if (! AuthorizationHelper::canAccessAdminArea($auth)) {
            abort(403, 'Akun Anda tidak diizinkan mengakses area admin.');
        }

        if (! $this->checkIsEditor($auth)) {
            abort(403, 'Anda tidak memiliki izin untuk mengubah hak akses.');
        }

        $request->validate([
            'userIds' => 'required|array',
        ]);

        // Hapus akses
        HakAksesModel::whereIn('user_id', $request->userIds)->delete();

        return back()->with('success', 'Hak akses untuk pengguna yang dipilih berhasil dihapus.');
    }

    private function checkIsEditor($auth)
    {
        return AuthorizationHelper::hasAccess($auth, 'Admin');
    }
}
