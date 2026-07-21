<?php

namespace App\Http\Requests\Admin;

use Illuminate\Validation\Rule;

class UpdateDocumentationRequest extends StoreDocumentationRequest
{
    public function rules(): array
    {
        $documentationId = $this->route('documentation')->id;
        $rules = parent::rules();
        $rules['slug'] = ['required', 'string', 'max:255', Rule::unique('documentations', 'slug')->ignore($documentationId)];

        return $rules;
    }
}
