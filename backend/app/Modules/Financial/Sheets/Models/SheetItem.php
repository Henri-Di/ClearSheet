<?php

namespace App\Modules\Financial\Sheets\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;
use App\Modules\Financial\Categories\Models\Category;
use App\Modules\Financial\Banks\Models\Bank;
use App\Modules\Financial\Sheets\Models\Sheet;

class SheetItem extends Model
{
    use HasFactory;

    protected $table = 'sheet_items';

    protected $fillable = [
        'sheet_id',
        'type',
        'value',
        'category_id',
        'bank_id',
        'description',
        'date',
        'paid_at',
    ];

    protected $casts = [
        'value'   => 'decimal:2',
        'date'    => 'string',
        'paid_at' => 'string',
    ];

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
        return $this->belongsTo(Bank::class, 'bank_id');
    }

    public function setTypeAttribute($value)
    {
        $map = [
            'entrada' => 'income',
            'income'  => 'income',
            'saida'   => 'expense',
            'expense' => 'expense',
        ];

        $this->attributes['type'] = $map[$value] ?? 'income';
    }

    public function setDateAttribute($value)
    {
        $this->attributes['date'] = $value
            ? Carbon::parse($value)->format('Y-m-d')
            : null;
    }

    public function setPaidAtAttribute($value)
    {
        $this->attributes['paid_at'] = $value
            ? Carbon::parse($value)->format('Y-m-d')
            : null;
    }

    public function getFormattedValueAttribute()
    {
        return 'R$ ' . number_format($this->value, 2, ',', '.');
    }

    public function getFormattedDateAttribute()
    {
        return $this->date
            ? Carbon::parse($this->date)->format('d/m/Y')
            : null;
    }

    public function getFormattedPaidAtAttribute()
    {
        return $this->paid_at
            ? Carbon::parse($this->paid_at)->format('d/m/Y')
            : null;
    }

    public function getColorAttribute()
    {
        if ($this->type === 'income') {
            return '#16A34A';
        }

        if ($this->paid_at) {
            return '#16A34A';
        }

        return '#DC2626';
    }

    public function scopeSearch(Builder $query, ?string $term)
    {
        if (!$term) return $query;

        return $query->where(function ($q) use ($term) {
            $q->where('description', 'like', "%{$term}%")
                ->orWhereHas('category', fn($q2) =>
                    $q2->where('name', 'like', "%{$term}%")
                )
                ->orWhereHas('bank', fn($q3) =>
                    $q3->where('name', 'like', "%{$term}%")
                )
                ->orWhere('value', 'like', "%{$term}%");
        });
    }

    public function scopeOrderExcel(Builder $query, $column, $direction = 'asc')
    {
        $allowed = [
            'date',
            'value',
            'category_id',
            'bank_id',
            'type',
            'created_at',
            'paid_at',
        ];

        if (!in_array($column, $allowed)) {
            $column = 'date';
        }

        return $query->orderBy($column, $direction);
    }

    public function scopeBetweenDates(Builder $query, $start, $end)
    {
        if ($start) $query->whereDate('date', '>=', $start);
        if ($end)   $query->whereDate('date', '<=', $end);

        return $query;
    }

    public function scopeValueRange(Builder $query, $min, $max)
    {
        if ($min !== null && $min !== '') {
            $query->where('value', '>=', $min);
        }

        if ($max !== null && $max !== '') {
            $query->where('value', '<=', $max);
        }

        return $query;
    }

    public function toResourceArray()
    {
        return [
            'id'               => $this->id,
            'sheet_id'         => $this->sheet_id,
            'type'             => $this->type,
            'value'            => $this->value,
            'formatted_value'  => $this->formatted_value,
            'category_id'      => $this->category_id,
            'bank_id'          => $this->bank_id,
            'category'         => $this->category
                ? [
                    'id'   => $this->category->id,
                    'name' => $this->category->name,
                    'icon' => $this->category->icon,
                ]
                : null,
            'bank'             => $this->bank
                ? [
                    'id'   => $this->bank->id,
                    'name' => $this->bank->name,
                ]
                : null,
            'description'       => $this->description,
            'date'              => $this->date,
            'formatted_date'    => $this->formatted_date,
            'paid_at'           => $this->paid_at,
            'formatted_paid_at' => $this->formatted_paid_at,
            'color'             => $this->color,
        ];
    }
}
