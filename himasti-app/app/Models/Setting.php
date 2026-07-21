<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    public const ALLOWED_KEYS = [
        'site_title',
        'site_description',
        'footer_text',
        'default_meta_description',
        'contact_email',
        'contact_phone',
        'instagram_url',
        'landing_news_limit',
        'landing_event_limit',
        'landing_documentation_limit',
        'landing_instagram_limit',
        'maintenance_mode',
    ];

    public const INTEGER_KEYS = [
        'landing_news_limit',
        'landing_event_limit',
        'landing_documentation_limit',
        'landing_instagram_limit',
    ];

    public static function allowedKeys(): array
    {
        return self::ALLOWED_KEYS;
    }

    public static function integerKeys(): array
    {
        return self::INTEGER_KEYS;
    }

    public static function getValue(string $key, mixed $default = null): mixed
    {
        return app(\App\Services\SettingService::class)->getValue($key, $default);
    }
}
