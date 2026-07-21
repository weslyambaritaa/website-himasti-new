<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property string|null $organization_name
 * @property string|null $short_name
 * @property string|null $tagline
 * @property string|null $cabinet_name
 * @property string|null $period
 * @property string|null $description
 * @property string|null $email
 * @property string|null $phone
 * @property string|null $logo
 * @property string|null $instagram_url
 */
class OrganizationProfile extends Model
{
    protected $fillable = [
        'organization_name',
        'short_name',
        'tagline',
        'cabinet_name',
        'period',
        'description',
        'vision',
        'mission',
        'logo',
        'address',
        'email',
        'phone',
        'instagram_url',
    ];
}
