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

            'type' => 'required|in:entrada,saida,income,expense',

    
            'value' => 'required|numeric|min:0.01',

         
            'category_id' => 'nullable|integer|exists:categories,id',
            'bank_id'     => 'nullable|integer|exists:banks,id',

            'description' => 'nullable|string|max:500',

       
            'date' => 'nullable|date',

        
            'paid_at' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'type.in'       => 'O tipo deve ser "entrada", "saida", "income" ou "expense".',
            'value.numeric' => 'O valor deve ser numérico.',
            'value.min'     => 'O valor deve ser maior que zero.',

            'category_id.exists' => 'A categoria selecionada é inválida.',
            'bank_id.exists'     => 'O banco selecionado é inválido.',

            'description.string' => 'A descrição deve ser um texto válido.',
            'date.date'          => 'A data deve estar em um formato válido.',
            'paid_at.date'       => 'A data de pagamento deve estar em um formato válido.',
        ];
    }
}
