<?php

namespace App\Services;

use App\Models\OrganizationProfile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class OrganizationProfileService
{
    public function __construct(
        private readonly MediaService $mediaService
    ) {}

    public function getSingleton(): OrganizationProfile
    {
        return OrganizationProfile::query()->firstOrCreate(
            ['id' => 1],
            [
                'organization_name' => 'HIMASTI',
                'short_name' => 'HIMASTI',
            ]
        );
    }

    public function update(array $data, ?UploadedFile $logo): OrganizationProfile
    {
        return DB::transaction(function () use ($data, $logo) {
            $profile = $this->getSingleton();
            $data['logo'] = $this->mediaService->replace($logo, $profile->logo, 'organization-profile');
            $profile->fill($data);
            $profile->save();

            return $profile->fresh();
        });
    }
}
