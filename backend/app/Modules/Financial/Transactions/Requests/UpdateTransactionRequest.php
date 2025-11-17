<?php

namespace App\Modules\Financial\Transactions\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sheet_id'    => 'nullable|exists:sheets,id',
            'type'        => 'nullable|in:income,expense',
            'value'       => 'nullable|numeric',
            'description' => 'nullable|string|max:500',
            'category_id' => 'nullable|exists:categories,id',
            'date'        => 'nullable|date',
        ];
    }
}
