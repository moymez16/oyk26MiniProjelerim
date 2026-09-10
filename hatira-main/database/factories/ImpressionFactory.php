<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Impression;
use App\Models\Participant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Impression>
 */
class ImpressionFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $event = Event::factory();

        return [
            'event_id' => $event,
            'author_participant_id' => Participant::factory()->for($event),
            'subject_participant_id' => Participant::factory()->for($event),
            'body' => fake()->paragraph(),
            'shows_author_name' => true,
        ];
    }

    public function unnamed(): static
    {
        return $this->state(fn (array $attributes): array => [
            'shows_author_name' => false,
        ]);
    }

    public function hidden(): static
    {
        return $this->state(fn (array $attributes): array => [
            'hidden_at' => now(),
        ]);
    }
}
