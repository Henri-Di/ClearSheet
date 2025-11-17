<?php

namespace App\Modules\Financial\Sheets\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Modules\Financial\Sheets\Models\SheetItem;

class Sheet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'month',
        'year',
        'initial_balance',
    ];

    protected $casts = [
        'month'           => 'integer',
        'year'            => 'integer',
        'initial_balance' => 'decimal:2',
    ];

    /*
    |--------------------------------------------------------------------------
    | Factory Override (IMPORTANTE)
    |--------------------------------------------------------------------------
    |
    | Como o model está em um namespace customizado dentro de Modules/,
    | o Laravel tenta localizar a factory em:
    |
    |   Database\Factories\Modules\Financial\Sheets\Models\SheetFactory
    |
    | Mas sua factory está em database/factories/SheetFactory.php.
    | Então definimos explicitamente.
    |
    */

    protected static function newFactory()
    {
        return \Database\Factories\SheetFactory::new();
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(SheetItem::class, 'sheet_id', 'id');
    }
}
