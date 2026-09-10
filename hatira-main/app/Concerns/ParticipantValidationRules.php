<?php

namespace App\Concerns;

use App\Models\Event;
use App\Models\Participant;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ParticipantValidationRules
{
    /**
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function participantRules(Event $event): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => $this->participantEmailRules($event),
        ];
    }

    /**
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function participantEmailRules(Event $event): array
    {
        return [
            'nullable',
            'string',
            'email',
            'max:255',
            Rule::unique(Participant::class, 'email')->where(
                fn ($query) => $query->where('event_id', $event->id),
            ),
        ];
    }
}
