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



    protected static function newFactory()
    {
        return \Database\Factories\SheetFactory::new();
    }



    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(SheetItem::class, 'sheet_id', 'id');
    }
}
