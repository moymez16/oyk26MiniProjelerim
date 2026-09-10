<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Memory;
use App\Models\Participant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Memory>
 */
class MemoryFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $event = Event::factory();

        return [
            'event_id' => $event,
            'participant_id' => Participant::factory()->for($event),
            'body' => fake()->paragraph(),
            'occurred_on' => null,
        ];
    }

    public function hidden(): static
    {
        return $this->state(fn (array $attributes): array => [
            'hidden_at' => now(),
        ]);
    }
}
