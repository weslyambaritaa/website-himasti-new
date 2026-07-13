<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string|null $cover_image
 * @property-read \Illuminate\Database\Eloquent\Collection<int, DocumentationImage> $images
 */
class Documentation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'work_program_id',
        'title',
        'slug',
        'description',
        'event_date',
        'location',
        'cover_image',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
        ];
    }

    public function workProgram(): BelongsTo
    {
        return $this->belongsTo(WorkProgram::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(DocumentationImage::class);
    }
}
