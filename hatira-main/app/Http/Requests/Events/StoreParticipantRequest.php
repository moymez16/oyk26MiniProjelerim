<?php

namespace App\Http\Requests\Events;

use App\Concerns\ParticipantValidationRules;
use App\Models\Event;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreParticipantRequest extends FormRequest
{
    use ParticipantValidationRules;

    public function authorize(): bool
    {
        $event = $this->route('event');

        if (! $event instanceof Event) {
            return false;
        }

        Gate::authorize('manageParticipants', $event);

        return true;
    }

    protected function prepareForValidation(): void
    {
        $email = $this->string('email')->trim()->lower()->toString();

        $this->merge([
            'email' => $email === '' ? null : $email,
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $event = $this->route('event');

        return $event instanceof Event
            ? $this->participantRules($event)
            : [];
    }
}
