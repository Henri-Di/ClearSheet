<?php

namespace App\Modules\Financial\Transactions\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'sheet_id'    => ['nullable', 'integer', 'exists:financial_sheets,id'],

            'type'        => ['required', 'in:income,expense,entrada,saida'],

            'value'       => ['required', 'numeric', 'min:0'],

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
            'value.required' => 'O valor é obrigatório.',
            'type.in'        => 'Tipo inválido.',
            'date.date'      => 'A data informada é inválida.',
            'paid_at.date'   => 'A data de pagamento é inválida.',
        ];
    }
}
