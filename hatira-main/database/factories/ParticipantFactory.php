<?php

namespace Database\Factories;

use App\Enums\ParticipantRole;
use App\Enums\ParticipantStatus;
use App\Models\Event;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Participant>
 */
class ParticipantFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'user_id' => null,
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'role' => ParticipantRole::Participant,
            'status' => ParticipantStatus::NotInvited,
        ];
    }

    public function withoutEmail(): static
    {
        return $this->state(fn (array $attributes): array => [
            'email' => null,
        ]);
    }

    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes): array => [
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'status' => ParticipantStatus::Active,
            'joined_at' => now(),
            'consent_accepted_at' => now(),
        ]);
    }

    public function invited(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => ParticipantStatus::Invited,
            'invitation_token' => fake()->unique()->regexify('[A-Za-z0-9]{64}'),
            'invited_at' => now(),
        ]);
    }
}
