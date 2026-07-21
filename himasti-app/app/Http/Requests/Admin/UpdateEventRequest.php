<?php

namespace App\Http\Requests\Admin;

use Illuminate\Validation\Rule;

class UpdateEventRequest extends StoreEventRequest
{
    public function rules(): array
    {
        $eventId = $this->route('event')->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('events', 'slug')->ignore($eventId)],
            'cover_image' => ['nullable', 'image', 'max:4096'],
            'description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'registration_url' => ['nullable', 'url', 'max:255'],
            'status' => ['required', Rule::in(['upcoming', 'ongoing', 'completed', 'cancelled'])],
            'is_published' => ['required', 'boolean'],
            'is_featured' => ['required', 'boolean'],
        ];
    }
}
