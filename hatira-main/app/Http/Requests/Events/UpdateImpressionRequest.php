<?php

namespace App\Http\Requests\Events;

use App\Models\Impression;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateImpressionRequest extends FormRequest
{
    public function authorize(): bool
    {
        $impression = $this->route('impression');

        if (! $impression instanceof Impression) {
            return false;
        }

        Gate::authorize('update', $impression);

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
        ];
    }
}
