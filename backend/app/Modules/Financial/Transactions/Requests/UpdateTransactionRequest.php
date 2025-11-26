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
            'sheet_id'    => ['nullable', 'integer', 'exists:financial_sheets,id'],

            'type'        => ['sometimes', 'in:income,expense,entrada,saida'],

            'value'       => ['sometimes', 'numeric', 'min:0'],

            'description' => ['nullable', 'string', 'max:255'],

            'category_id' => ['nullable', 'integer', 'exists:financial_categories,id'],

            'bank_id'     => ['nullable', 'integer', 'exists:financial_banks,id'],

            'date'        => ['nullable', 'date'],

            'paid_at'     => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.in'        => 'Tipo inválido.',
            'value.numeric'  => 'O valor deve ser numérico.',
            'date.date'      => 'Data inválida.',
            'paid_at.date'   => 'A data de pagamento é inválida.',
        ];
    }
}
