<?php

namespace App\Http\Requests\Events;

use App\Concerns\ImageValidationRules;
use App\Models\Event;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateProfileRequest extends FormRequest
{
    use ImageValidationRules;

    public function authorize(): bool
    {
        $event = $this->route('event');

        if (! $event instanceof Event) {
            return false;
        }

        Gate::authorize('view', $event);

        $participant = $event->participantFor($this->user());

        if ($participant === null) {
            return false;
        }

        Gate::authorize('update', $participant);

        return true;
    }

    protected function prepareForValidation(): void
    {
        $rawLinks = $this->input('links');
        $links = [];

        if (is_array($rawLinks)) {
            foreach ($rawLinks as $link) {
                if (! is_array($link)) {
                    continue;
                }

                $label = trim((string) ($link['label'] ?? ''));
                $url = trim((string) ($link['url'] ?? ''));

                if ($label === '' && $url === '') {
                    continue;
                }

                $links[] = [
                    'label' => $label,
                    'url' => $url,
                ];
            }
        }

        $this->merge([
            'links' => $links === [] ? null : $links,
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'photo' => $this->publicImageRules(),
            'remove_photo' => ['sometimes', 'boolean'],
            'bio' => ['nullable', 'string', 'max:280'],
            'links' => ['nullable', 'array', 'max:5'],
            'links.*.label' => ['required_with:links', 'string', 'max:40'],
            'links.*.url' => ['required_with:links', 'url:http,https', 'max:255'],
        ];
    }
}
