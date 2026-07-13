<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreInstagramPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:4096'],
            'instagram_url' => ['required', 'url', 'max:255'],
            'order_number' => ['nullable', 'integer', 'min:0'],
            'is_shown' => ['required', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
