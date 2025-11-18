<?php

namespace App\Modules\Financial\Sheets\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateSheetItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type'        => 'required|in:entrada,saida,income,expense',
            'value'       => 'required|numeric|min:0.01',

            'category_id' => 'nullable|integer|exists:categories,id',
            'bank_id'     => 'nullable|integer|exists:banks,id',

            'description' => 'nullable|string|max:500',
            'date'        => 'nullable|date',

            // CORREÇÃO
            'paid_at'     => 'nullable|date',
        ];
    }
}
