<?php

namespace App\Services;

use App\Models\OrganizationProfile;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class SettingService
{
    private const CACHE_KEY = 'website_settings.key_value';

    public function getAllKeyValues(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            return Setting::query()
                ->pluck('value', 'key')
                ->all();
        });
    }

    public function getEditableSettings(): array
    {
        return array_merge($this->defaults(), $this->getAllKeyValues());
    }

    public function update(array $settings): void
    {
        DB::transaction(function () use ($settings) {
            foreach (Setting::allowedKeys() as $key) {
                Setting::query()->updateOrCreate(
                    ['key' => $key],
                    ['value' => $this->normalizeValue($key, $settings[$key] ?? null)]
                );
            }
        });

        $this->clearCache();
    }

    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    public function getValue(string $key, mixed $default = null): mixed
    {
        return $this->getAllKeyValues()[$key] ?? $default;
    }

    public function getInt(string $key, int $default): int
    {
        $value = $this->getValue($key);

        return is_numeric($value) && (int) $value > 0 ? (int) $value : $default;
    }

    public function getBool(string $key, bool $default = false): bool
    {
        $value = $this->getValue($key);

        if ($value === null || $value === '') {
            return $default;
        }

        return filter_var($value, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE) ?? $default;
    }

    public function isMaintenanceMode(): bool
    {
        return $this->getBool('maintenance_mode', false);
    }

    public function getPublicIdentity(?OrganizationProfile $profile = null): array
    {
        $profile ??= OrganizationProfile::query()->first();
        $organizationName = $profile?->organization_name ?: 'HIMASTI';
        $description = $profile?->description ?: 'Website resmi HIMASTI.';

        return [
            'site_title' => $this->getStringWithFallback('site_title', $organizationName),
            'site_description' => $this->getStringWithFallback('site_description', $description),
            'footer_text' => $this->getStringWithFallback(
                'footer_text',
                '© '.now()->year.' '.$organizationName.'. Seluruh hak cipta dilindungi.'
            ),
            'default_meta_description' => $this->getStringWithFallback('default_meta_description', $description),
            'contact_email' => $this->getStringWithFallback('contact_email', $profile?->email),
            'contact_phone' => $this->getStringWithFallback('contact_phone', $profile?->phone),
            'instagram_url' => $this->getStringWithFallback('instagram_url', $profile?->instagram_url),
        ];
    }

    public function getLandingLimits(): array
    {
        return [
            'news' => $this->getInt('landing_news_limit', 3),
            'event' => $this->getInt('landing_event_limit', 3),
            'documentation' => $this->getInt('landing_documentation_limit', 6),
            'instagram' => $this->getInt('landing_instagram_limit', 6),
        ];
    }

    private function defaults(): array
    {
        return [
            'site_title' => '',
            'site_description' => '',
            'footer_text' => '',
            'default_meta_description' => '',
            'contact_email' => '',
            'contact_phone' => '',
            'instagram_url' => '',
            'landing_news_limit' => '3',
            'landing_event_limit' => '3',
            'landing_documentation_limit' => '6',
            'landing_instagram_limit' => '6',
            'maintenance_mode' => '0',
        ];
    }

    private function getStringWithFallback(string $key, ?string $fallback = null): ?string
    {
        $value = $this->getValue($key);

        if (is_string($value) && trim($value) !== '') {
            return $value;
        }

        return $fallback;
    }

    private function normalizeValue(string $key, mixed $value): ?string
    {
        if ($key === 'maintenance_mode') {
            return $value ? '1' : '0';
        }

        if ($value === null) {
            return null;
        }

        return (string) $value;
    }
}
