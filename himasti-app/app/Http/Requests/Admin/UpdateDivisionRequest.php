<?php

namespace App\Http\Requests\Admin;

use Illuminate\Validation\Rule;

class UpdateDivisionRequest extends StoreDivisionRequest
{
    public function rules(): array
    {
        $divisionId = $this->route('division')->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('divisions', 'slug')->ignore($divisionId)],
            'short_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'max:4096'],
            'cover_image' => ['nullable', 'image', 'max:4096'],
            'order_number' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
