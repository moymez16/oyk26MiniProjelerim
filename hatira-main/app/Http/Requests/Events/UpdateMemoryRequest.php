<?php

namespace App\Http\Requests\Events;

use App\Models\Memory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateMemoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        $memory = $this->route('memory');

        if (! $memory instanceof Memory) {
            return false;
        }

        Gate::authorize('update', $memory);

        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'max:4000'],
            'occurred_on' => ['nullable', 'date'],
        ];
    }
}
