<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;

trait ImageValidationRules
{
    /**
     * @return array<int, ValidationRule|string>
     */
    protected function publicImageRules(bool $required = false): array
    {
        return [
            $required ? 'required' : 'nullable',
            'image',
            'mimes:jpg,jpeg,png,webp',
            'max:4096',
        ];
    }
}
