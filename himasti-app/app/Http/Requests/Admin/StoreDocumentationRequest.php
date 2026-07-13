<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'work_program_id' => ['nullable', 'exists:work_programs,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:documentations,slug'],
            'description' => ['nullable', 'string'],
            'event_date' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'cover_image' => ['nullable', 'image', 'max:4096'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:4096'],
            'captions' => ['nullable', 'array'],
            'captions.*' => ['nullable', 'string', 'max:255'],
            'existing_image_ids' => ['nullable', 'array'],
            'existing_image_ids.*' => ['integer'],
            'existing_captions' => ['nullable', 'array'],
            'existing_orders' => ['nullable', 'array'],
            'existing_orders.*' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
