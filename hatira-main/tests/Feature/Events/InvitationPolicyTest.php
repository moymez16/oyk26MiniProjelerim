<?php

use App\Enums\ParticipantStatus;
use App\Models\Event;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

test('a participant who accepted consent can view the event', function () {
    $event = Event::factory()->create();
    $member = User::factory()->create();
    Participant::factory()->for($event)->forUser($member)->create();

    expect(Gate::forUser($member)->inspect('view', $event)->allowed())->toBeTrue();
});

test('a linked participant without consent is denied from viewing the event', function () {
    $event = Event::factory()->create();
    $member = User::factory()->create();
    Participant::factory()->for($event)->create([
        'user_id' => $member->id,
        'name' => $member->name,
        'email' => $member->email,
        'status' => ParticipantStatus::InvitationAccepted,
        'consent_accepted_at' => null,
    ]);

    expect(Gate::forUser($member)->inspect('view', $event)->denied())->toBeTrue()
        ->and(Gate::forUser($member)->inspect('view', $event)->status())->not->toBe(404);
});
