<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Banner extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'subtitle',
        'image',
        'button_text',
        'button_url',
        'order_number',
        'is_shown',
    ];

    protected function casts(): array
    {
        return [
            'is_shown' => 'boolean',
        ];
    }
}
