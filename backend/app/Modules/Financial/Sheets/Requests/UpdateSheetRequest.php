<?php

namespace App\Modules\Financial\Sheets\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSheetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'            => 'sometimes|string|max:255',
            'description'     => 'nullable|string|max:500',
            'month'           => 'sometimes|integer|min:1|max:12',
            'year'            => 'sometimes|integer|min:2000|max:2100',
            'initial_balance' => 'sometimes|numeric|min:0',
        ];
    }
}
