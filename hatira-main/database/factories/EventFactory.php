<?php

namespace Database\Factories;

use App\Enums\EventStatus;
use App\Enums\ImpressionRevealMode;
use App\Enums\ParticipantRole;
use App\Enums\ParticipantStatus;
use App\Models\Event;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startsOn = fake()->dateTimeBetween('-1 week', '+1 week');

        return [
            'owner_id' => User::factory(),
            'name' => fake()->sentence(3),
            'description' => fake()->sentence(12),
            'long_description' => fake()->optional()->paragraph(),
            'location' => fake()->optional()->city(),
            'starts_on' => $startsOn,
            'ends_on' => fake()->optional()->dateTimeBetween($startsOn, '+2 weeks'),
            'status' => EventStatus::Draft,
            'impression_reveal_mode' => ImpressionRevealMode::Immediate,
            'allows_content_after_close' => true,
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Event $event): void {
            if ($event->participants()->where('user_id', $event->owner_id)->exists()) {
                return;
            }

            Participant::factory()
                ->for($event)
                ->create([
                    'user_id' => $event->owner_id,
                    'name' => $event->owner->name,
                    'email' => $event->owner->email,
                    'role' => ParticipantRole::Owner,
                    'status' => ParticipantStatus::Active,
                    'joined_at' => now(),
                    'consent_accepted_at' => now(),
                ]);
        });
    }
}
