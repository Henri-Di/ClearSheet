<?php

namespace App\Modules\Financial\Sheets\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSheetItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // mesmo padrão do Create
            'type'        => 'sometimes|required|in:entrada,saida,income,expense',
            'value'       => 'sometimes|required|numeric|min:0.01',

            // corrigido: era "category" (inválido)
            'category_id' => 'nullable|integer|exists:categories,id',

            // novo: banco
            'bank_id'     => 'nullable|integer|exists:banks,id',

            'description' => 'nullable|string|max:500',
            'date'        => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'type.in'          => 'O tipo deve ser "entrada", "saida", "income" ou "expense".',
            'value.numeric'    => 'O valor deve ser numérico.',
            'value.min'        => 'O valor deve ser maior que zero.',

            'category_id.exists' => 'A categoria selecionada é inválida.',
            'bank_id.exists'     => 'O banco selecionado é inválido.',

            'date.date'        => 'A data deve estar em um formato válido.',
        ];
    }
}
