<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'cover_image',
        'description',
        'location',
        'start_date',
        'end_date',
        'registration_url',
        'status',
        'is_published',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }
}
