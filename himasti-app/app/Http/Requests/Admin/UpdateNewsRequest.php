<?php

namespace App\Http\Requests\Admin;

use Illuminate\Validation\Rule;

class UpdateNewsRequest extends StoreNewsRequest
{
    public function rules(): array
    {
        $newsId = $this->route('news')->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('news', 'slug')->ignore($newsId)],
            'cover_image' => ['nullable', 'image', 'max:4096'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
