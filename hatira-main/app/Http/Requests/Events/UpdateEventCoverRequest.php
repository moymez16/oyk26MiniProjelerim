<?php

namespace App\Http\Requests\Events;

use App\Concerns\ImageValidationRules;
use App\Models\Event;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateEventCoverRequest extends FormRequest
{
    use ImageValidationRules;

    public function authorize(): bool
    {
        $event = $this->route('event');

        if (! $event instanceof Event) {
            return false;
        }

        Gate::authorize('update', $event);

        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'cover' => $this->publicImageRules(required: true),
        ];
    }
}
