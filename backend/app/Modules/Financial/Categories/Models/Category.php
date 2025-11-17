<?php

namespace App\Modules\Financial\Categories\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Database\Factories\CategoryFactory;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $type
 * @property string $color
 * @property string|null $icon
 * @property string|null $description
 */
class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'color',
        'icon',
        'description',
    ];

    protected $casts = [
        'type' => 'string',
        'color' => 'string',
    ];

    protected static function newFactory()
    {
        return CategoryFactory::new();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
