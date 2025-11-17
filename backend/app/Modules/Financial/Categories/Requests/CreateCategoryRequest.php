<?php

namespace App\Modules\Financial\Categories\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateCategoryRequest extends FormRequest
{
    public function rules(): array
{
    return [
        'name'        => 'required|string|max:255',
        'type'        => 'nullable|in:income,expense',
        'color'       => 'nullable|string|max:20',
        'icon'        => 'nullable|string|max:50',
        'description' => 'nullable|string|max:500',
    ];
}

}
