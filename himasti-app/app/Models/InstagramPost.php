<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstagramPost extends Model
{
    protected $fillable = [
        'title',
        'image',
        'instagram_url',
        'order_number',
        'is_shown',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'is_shown' => 'boolean',
            'published_at' => 'datetime',
        ];
    }
}
