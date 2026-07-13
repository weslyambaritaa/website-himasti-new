<?php

namespace App\Http\Requests\Admin;

use App\Models\Setting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'settings' => ['required', 'array'],
            'settings.site_title' => ['nullable', 'string', 'max:255'],
            'settings.site_description' => ['nullable', 'string', 'max:500'],
            'settings.footer_text' => ['nullable', 'string', 'max:255'],
            'settings.default_meta_description' => ['nullable', 'string', 'max:255'],
            'settings.contact_email' => ['nullable', 'email', 'max:255'],
            'settings.contact_phone' => ['nullable', 'string', 'max:50'],
            'settings.instagram_url' => ['nullable', 'url', 'max:255'],
            'settings.youtube_url' => ['nullable', 'url', 'max:255'],
            'settings.landing_news_limit' => ['nullable', 'integer', 'min:1', 'max:50'],
            'settings.landing_event_limit' => ['nullable', 'integer', 'min:1', 'max:50'],
            'settings.landing_documentation_limit' => ['nullable', 'integer', 'min:1', 'max:50'],
            'settings.landing_instagram_limit' => ['nullable', 'integer', 'min:1', 'max:50'],
            'settings.maintenance_mode' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'settings.required' => 'Payload pengaturan wajib dikirim.',
            'settings.array' => 'Format pengaturan tidak valid.',
            'settings.contact_email.email' => 'Email kontak harus berupa alamat email yang valid.',
            'settings.instagram_url.url' => 'URL Instagram harus valid.',
            'settings.youtube_url.url' => 'URL YouTube harus valid.',
            'settings.landing_news_limit.integer' => 'Batas berita harus berupa angka.',
            'settings.landing_event_limit.integer' => 'Batas kegiatan harus berupa angka.',
            'settings.landing_documentation_limit.integer' => 'Batas dokumentasi harus berupa angka.',
            'settings.landing_instagram_limit.integer' => 'Batas Instagram harus berupa angka.',
            'settings.landing_news_limit.min' => 'Batas berita minimal 1.',
            'settings.landing_event_limit.min' => 'Batas kegiatan minimal 1.',
            'settings.landing_documentation_limit.min' => 'Batas dokumentasi minimal 1.',
            'settings.landing_instagram_limit.min' => 'Batas Instagram minimal 1.',
            'settings.landing_news_limit.max' => 'Batas berita maksimal 50.',
            'settings.landing_event_limit.max' => 'Batas kegiatan maksimal 50.',
            'settings.landing_documentation_limit.max' => 'Batas dokumentasi maksimal 50.',
            'settings.landing_instagram_limit.max' => 'Batas Instagram maksimal 50.',
            'settings.maintenance_mode.boolean' => 'Mode maintenance harus bernilai benar atau salah.',
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $settings = $this->input('settings', []);
                $unknownKeys = array_diff(array_keys($settings), Setting::allowedKeys());

                if ($unknownKeys !== []) {
                    $validator->errors()->add('settings', 'Terdapat key pengaturan yang tidak diizinkan.');
                }
            },
        ];
    }
}
