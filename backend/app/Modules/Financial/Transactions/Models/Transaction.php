<?php

namespace App\Modules\Financial\Transactions\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Models\User;
use App\Modules\Financial\Sheets\Models\Sheet;
use App\Modules\Financial\Categories\Models\Category;
use Carbon\Carbon;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'sheet_id',
        'type',         // income | expense
        'value',
        'description',
        'category_id',
        'date',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'date'  => 'date:Y-m-d',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sheet()
    {
        return $this->belongsTo(Sheet::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Mutators
    |--------------------------------------------------------------------------
    | Normaliza 'entrada' → income ; 'saida' → expense
    */

    protected function type(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => match ($value) {
                'entrada' => 'income',
                'saida'   => 'expense',
                default   => $value,
            }
        );
    }

    protected function date(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => $value ? Carbon::parse($value)->format('Y-m-d') : null
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isIncome(): bool
    {
        return $this->type === 'income';
    }

    public function isExpense(): bool
    {
        return $this->type === 'expense';
    }
}
