<?php

namespace App\Http\Requests\Admin;

use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreBannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:4096'],
            'button_text' => ['nullable', 'string', 'max:255'],
            'button_url' => [
                'nullable',
                'string',
                'max:255',
                function (string $attribute, mixed $value, Closure $fail): void {
                    if (! is_string($value) || $value === '') {
                        return;
                    }

                    $isInternalPath = Str::startsWith($value, '/') && ! Str::startsWith($value, '//');
                    $scheme = parse_url($value, PHP_URL_SCHEME);
                    $isExternalUrl = filter_var($value, FILTER_VALIDATE_URL)
                        && in_array(strtolower((string) $scheme), ['http', 'https'], true);

                    if (! $isInternalPath && ! $isExternalUrl) {
                        $fail('URL tombol harus berupa tautan http/https atau path internal seperti /berita.');
                    }
                },
            ],
            'order_number' => ['nullable', 'integer', 'min:0'],
            'is_shown' => ['required', 'boolean'],
        ];
    }
}
