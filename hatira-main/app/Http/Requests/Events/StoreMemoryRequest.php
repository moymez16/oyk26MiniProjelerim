<?php

namespace App\Http\Requests\Events;

use App\Concerns\ImageValidationRules;
use App\Models\Event;
use App\Models\Memory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreMemoryRequest extends FormRequest
{
    use ImageValidationRules;

    public function authorize(): bool
    {
        $event = $this->route('event');

        if (! $event instanceof Event) {
            return false;
        }

        Gate::authorize('create', [Memory::class, $event]);

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
            'images' => ['nullable', 'array', 'max:4'],
            'images.*' => $this->publicImageRules(),
        ];
    }
}
