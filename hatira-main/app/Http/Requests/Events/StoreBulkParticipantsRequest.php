<?php

namespace App\Http\Requests\Events;

use App\Concerns\ParticipantValidationRules;
use App\Models\Event;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class StoreBulkParticipantsRequest extends FormRequest
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
        $this->merge([
            'participants' => $this->parseParticipantList(),
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $event = $this->route('event');

        if (! $event instanceof Event) {
            return [];
        }

        return [
            'list' => ['required', 'string'],
            'participants' => ['required', 'array', 'min:1'],
            'participants.*.name' => ['required', 'string', 'max:255'],
            'participants.*.email' => [
                ...$this->participantEmailRules($event),
                'distinct',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'list' => 'Katılımcı listesi',
            'participants' => 'Katılımcı listesi',
            'participants.*.name' => 'Ad',
            'participants.*.email' => 'E-posta adresi',
        ];
    }

    /**
     * @return array<int, array{name: string, email: string|null}>
     */
    private function parseParticipantList(): array
    {
        $lines = preg_split('/\r\n|\r|\n/', (string) $this->input('list', '')) ?: [];
        $participants = [];

        foreach ($lines as $line) {
            $line = trim($line);

            if ($line === '') {
                continue;
            }

            $participants[] = $this->parseParticipantLine($line);
        }

        return $participants;
    }

    /**
     * @return array{name: string, email: string|null}
     */
    private function parseParticipantLine(string $line): array
    {
        if (! str_contains($line, ',')) {
            return ['name' => $line, 'email' => null];
        }

        $segments = explode(',', $line);
        $possibleEmail = Str::lower(trim((string) array_pop($segments)));
        $possibleName = trim(implode(',', $segments));

        if ($possibleName === '') {
            return ['name' => $line, 'email' => null];
        }

        return [
            'name' => $possibleName,
            'email' => $possibleEmail === '' ? null : $possibleEmail,
        ];
    }
}
