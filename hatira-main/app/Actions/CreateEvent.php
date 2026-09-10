<?php

namespace App\Actions;

use App\Enums\ParticipantRole;
use App\Enums\ParticipantStatus;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateEvent
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function handle(User $owner, array $attributes): Event
    {
        return DB::transaction(function () use ($owner, $attributes): Event {
            $event = Event::query()->create([
                ...$attributes,
                'owner_id' => $owner->id,
            ]);

            $event->participants()->create([
                'user_id' => $owner->id,
                'name' => $owner->name,
                'email' => $owner->email,
                'role' => ParticipantRole::Owner,
                'status' => ParticipantStatus::Active,
                'joined_at' => now(),
                'consent_accepted_at' => now(),
            ]);

            return $event;
        });
    }
}
