<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Services\SettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends AdminCrudController
{
    public function __construct(private readonly SettingService $settingService) {}

    public function edit(Request $request)
    {
        $this->ensureModuleAccess($request, 'Pengaturan');

        return Inertia::render('admin/settings/edit-page', [
            'pageName' => Inertia::always('Pengaturan Website'),
            'settings' => $this->settingService->getEditableSettings(),
            'allowedKeys' => \App\Models\Setting::allowedKeys(),
        ]);
    }

    public function update(UpdateSettingsRequest $request)
    {
        $this->ensureModuleAccess($request, 'Pengaturan');

        $validated = $request->validated();
        $this->settingService->update($validated['settings'] ?? []);

        return redirect()->route('admin.settings.edit')->with('success', 'Pengaturan website berhasil diperbarui.');
    }
}
