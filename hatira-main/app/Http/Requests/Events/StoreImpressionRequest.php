<?php

namespace App\Http\Requests\Events;

use App\Concerns\ImageValidationRules;
use App\Models\Event;
use App\Models\Impression;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreImpressionRequest extends FormRequest
{
    use ImageValidationRules;

    public function authorize(): bool
    {
        $event = $this->route('event');

        if (! $event instanceof Event) {
            return false;
        }

        Gate::authorize('create', [Impression::class, $event]);

        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'max:2000'],
            'shows_author_name' => ['required', 'boolean'],
            'images' => ['nullable', 'array', 'max:4'],
            'images.*' => $this->publicImageRules(),
        ];
    }
}
