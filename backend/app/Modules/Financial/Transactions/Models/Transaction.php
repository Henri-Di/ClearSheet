<?php

namespace App\Modules\Financial\Transactions\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Models\User;
use App\Modules\Financial\Sheets\Models\Sheet;
use App\Modules\Financial\Categories\Models\Category;
use App\Modules\Financial\Banks\Models\Bank;
use Carbon\Carbon;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'sheet_id',
        'type',
        'value',
        'description',
        'category_id',
        'bank_id',
        'date',
        'paid_at',
    ];

    protected $casts = [
        'value'   => 'decimal:2',
        'date'    => 'date:Y-m-d',
        'paid_at' => 'date:Y-m-d',
    ];

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

    public function bank()
    {
        return $this->belongsTo(Bank::class);
    }

    protected function type(): Attribute
    {
        return Attribute::make(
            set: fn($value) => match ($value) {
                'entrada' => 'income',
                'saida'   => 'expense',
                default   => $value,
            }
        );
    }

    protected function date(): Attribute
    {
        return Attribute::make(
            set: fn($value) => $value
                ? Carbon::parse($value)->format('Y-m-d')
                : null
        );
    }

    protected function paidAt(): Attribute
    {
        return Attribute::make(
            set: fn($value) => $value
                ? Carbon::parse($value)->format('Y-m-d')
                : null
        );
    }

    public function isIncome(): bool
    {
        return $this->type === 'income';
    }

    public function isExpense(): bool
    {
        return $this->type === 'expense';
    }

    public function toUnifiedArray(): array
    {
        return [
            'id'          => $this->id,
            'origin'      => 'transaction',
            'sheet_id'    => $this->sheet_id,
            'type'        => $this->type,
            'value'       => (float) $this->value,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'bank_id'     => $this->bank_id,
            'date'        => $this->date?->format('Y-m-d'),
            'paid_at'     => $this->paid_at?->format('Y-m-d'),
            'category'    => $this->category
                ? [
                    'id'   => $this->category->id,
                    'name' => $this->category->name,
                    'icon' => $this->category->icon ?? null,
                ]
                : null,
            'bank' => $this->bank
                ? [
                    'id'   => $this->bank->id,
                    'name' => $this->bank->name,
                ]
                : null,
        ];
    }
}
