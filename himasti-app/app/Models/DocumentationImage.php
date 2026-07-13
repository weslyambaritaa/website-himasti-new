<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $documentation_id
 * @property string $image
 * @property string|null $caption
 * @property int $order_number
 */
class DocumentationImage extends Model
{
    protected $fillable = [
        'documentation_id',
        'image',
        'caption',
        'order_number',
    ];

    public function documentation(): BelongsTo
    {
        return $this->belongsTo(Documentation::class);
    }
}
