<?php

namespace App\Modules\Financial\Sheets\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateSheetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string|max:500',
            'month'           => 'required|integer|min:1|max:12',
            'year'            => 'required|integer|min:2000|max:2100',
            'initial_balance' => 'nullable|numeric|min:0',
        ];
    }
}
