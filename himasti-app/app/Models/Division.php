<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Division extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'short_name',
        'description',
        'logo',
        'cover_image',
        'order_number',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function members(): HasMany
    {
        return $this->hasMany(DivisionMember::class);
    }

    public function workPrograms(): HasMany
    {
        return $this->hasMany(WorkProgram::class);
    }
}
