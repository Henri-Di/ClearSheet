<?php

namespace App\Modules\Financial\Sheets\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;
use App\Modules\Financial\Categories\Models\Category;
use App\Modules\Financial\Banks\Models\Bank;

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
        'date'    => 'date',
        'paid_at' => 'date',
    ];

    // ============================
    // RELATIONSHIPS
    // ============================

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

    // ============================
    // ACCESSORS / MUTATORS
    // ============================

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
            ? $this->date->format('d/m/Y')
            : null;
    }

    public function getFormattedPaidAtAttribute()
    {
        return $this->paid_at
            ? $this->paid_at->format('d/m/Y')
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

    // ============================
    // SCOPES
    // ============================

    public function scopeSearch(Builder $query, ?string $term)
    {
        if (!$term) return $query;

        return $query->where(function ($q) use ($term) {
            $q->where('description', 'like', "%{$term}%")
              ->orWhereHas('category', function ($q2) use ($term) {
                  $q2->where('name', 'like', "%{$term}%");
              })
              ->orWhereHas('bank', function ($q3) use ($term) {
                  $q3->where('name', 'like', "%{$term}%");
              })
              ->orWhere('value', 'like', "%{$term}%");
        });
    }

    public function scopeOrderExcel(Builder $query, $column, $direction = 'asc')
    {
        $allowed = ['date', 'value', 'category_id', 'bank_id', 'type', 'created_at', 'paid_at'];

        if (!in_array($column, $allowed)) {
            $column = 'date';
        }

        return $query->orderBy($column, $direction);
    }

    // ============================
    // SCOPES FALTANTES (ERRO 500)
    // ============================

    // ✔ BETWEEN DATES (filtro de datas)
    public function scopeBetweenDates(Builder $query, $start, $end)
    {
        if ($start) {
            $query->whereDate('date', '>=', $start);
        }

        if ($end) {
            $query->whereDate('date', '<=', $end);
        }

        return $query;
    }

    // ✔ RANGE DE VALORES (mínimo/máximo)
    public function scopeValueRange(Builder $query, $min, $max)
    {
        if (!is_null($min) && $min !== '') {
            $query->where('value', '>=', $min);
        }

        if (!is_null($max) && $max !== '') {
            $query->where('value', '<=', $max);
        }

        return $query;
    }

    // ============================
    // RESOURCE ARRAY
    // ============================

    public function toResourceArray()
    {
        return [
            'id'               => $this->id,
            'sheet_id'         => $this->sheet_id,

            'type'             => $this->type,
            'value'            => $this->value,
            'formatted_value'  => $this->formatted_value,

            'category' => $this->category
                ? ['id' => $this->category->id, 'name' => $this->category->name]
                : null,

            'bank' => $this->bank
                ? ['id' => $this->bank->id, 'name' => $this->bank->name]
                : null,

            'bank_id' => $this->bank_id,

            'description'        => $this->description,
            'date'               => $this->date,
            'formatted_date'     => $this->formatted_date,

            'paid_at'            => $this->paid_at,
            'formatted_paid_at'  => $this->formatted_paid_at,

            'color' => $this->color,
        ];
    }
}
