<?php

use App\Enums\ParticipantRole;
use App\Enums\ParticipantStatus;
use App\Models\Event;
use App\Models\Participant;
use App\Models\User;

test('the owner can add a participant with only a name', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();

    $this->actingAs($owner)
        ->post(route('events.participants.store', $event), [
            'name' => 'Ali Berk',
        ])
        ->assertRedirect(route('events.participants.index', $event));

    $participant = $event->participants()->where('name', 'Ali Berk')->first();

    expect($participant)->not->toBeNull()
        ->and($participant->email)->toBeNull()
        ->and($participant->user_id)->toBeNull()
        ->and($participant->role)->toBe(ParticipantRole::Participant)
        ->and($participant->status)->toBe(ParticipantStatus::NotInvited);
});

test('the owner can add a participant with a name and email', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();

    $this->actingAs($owner)
        ->post(route('events.participants.store', $event), [
            'name' => 'Ayşe Yılmaz',
            'email' => 'ayse@example.com',
        ])
        ->assertRedirect(route('events.participants.index', $event));

    expect($event->participants()->where('email', 'ayse@example.com')->exists())->toBeTrue();
});

test('the same email cannot be added twice to an event', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    Participant::factory()->for($event)->create([
        'email' => 'ayse@example.com',
    ]);

    $this->actingAs($owner)
        ->from(route('events.participants.index', $event))
        ->post(route('events.participants.store', $event), [
            'name' => 'Ayşe Tekrar',
            'email' => 'ayse@example.com',
        ])
        ->assertRedirect(route('events.participants.index', $event))
        ->assertSessionHasErrors([
            'email' => 'E-posta adresi daha önce kullanılmış.',
        ]);
});

test('the owner can remove a participant', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $participant = Participant::factory()->for($event)->create();

    $this->actingAs($owner)
        ->delete(route('events.participants.destroy', [$event, $participant]))
        ->assertRedirect(route('events.participants.index', $event));

    expect(Participant::query()->find($participant->id))->toBeNull();
});

test('the owner cannot remove their own participant record', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $ownerParticipant = $event->participantFor($owner);

    $this->actingAs($owner)
        ->delete(route('events.participants.destroy', [$event, $ownerParticipant]))
        ->assertForbidden();

    expect(Participant::query()->find($ownerParticipant->id))->not->toBeNull();
});

test('a participant cannot add another participant', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $member = User::factory()->create();
    Participant::factory()->for($event)->forUser($member)->create();

    $this->actingAs($member)
        ->post(route('events.participants.store', $event), [
            'name' => 'Mehmet Demir',
        ])
        ->assertForbidden();
});

test('a stranger cannot view the participant list', function () {
    $event = Event::factory()->create();
    $stranger = User::factory()->create();

    $this->actingAs($stranger)
        ->get(route('events.participants.index', $event))
        ->assertNotFound();
});
