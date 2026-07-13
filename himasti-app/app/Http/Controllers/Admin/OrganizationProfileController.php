<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\UpdateOrganizationProfileRequest;
use App\Services\OrganizationProfileService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationProfileController extends AdminCrudController
{
    public function __construct(
        private readonly OrganizationProfileService $organizationProfileService
    ) {}

    public function edit(Request $request)
    {
        $this->ensureModuleAccess($request, 'Profil Organisasi');

        return Inertia::render('admin/organization-profile/edit-page', [
            'pageName' => Inertia::always('Profil Organisasi'),
            'profile' => $this->organizationProfileService->getSingleton(),
        ]);
    }

    public function update(UpdateOrganizationProfileRequest $request)
    {
        $this->ensureModuleAccess($request, 'Profil Organisasi');

        $this->organizationProfileService->update(
            $request->safe()->except('logo'),
            $request->file('logo')
        );

        return redirect()->route('admin.organization-profile.edit')->with('success', 'Profil organisasi berhasil diperbarui.');
    }
}
