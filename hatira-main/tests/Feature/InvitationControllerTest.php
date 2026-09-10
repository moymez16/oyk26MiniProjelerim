<?php

use App\Enums\ParticipantStatus;
use App\Models\Event;
use App\Models\Participant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('an invitation preview does not require authentication', function () {
    $event = Event::factory()->create([
        'name' => 'Laravel Kampı',
        'description' => 'Sınıf hatıra alanı',
        'long_description' => 'Bu metin önizlemede olmamalı',
    ]);
    $participant = Participant::factory()->for($event)->invited()->create([
        'name' => 'Ali Berk',
    ]);

    $this->get(route('invitations.show', $participant->invitation_token))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/show')
            ->where('event.name', 'Laravel Kampı')
            ->where('event.description', 'Sınıf hatıra alanı')
            ->missing('event.long_description')
            ->missing('participants')
            ->where('invitee_name', 'Ali Berk')
            ->where('inviter_name', $event->owner->name)
            ->where('is_authenticated', false));

    expect($participant->fresh()->status)->toBe(ParticipantStatus::InvitationSeen)
        ->and($participant->fresh()->invitation_seen_at)->not->toBeNull();
});

test('an invalid invitation token is not found', function () {
    $this->get(route('invitations.show', 'missing-token'))
        ->assertNotFound();
});

test('an expired invitation token is not found', function () {
    $this->freezeTime();

    $event = Event::factory()->create();
    $participant = Participant::factory()->for($event)->invited()->create([
        'invited_at' => now()->subDays(15),
    ]);

    $this->get(route('invitations.show', $participant->invitation_token))
        ->assertNotFound();
});

test('a revoked invitation cannot be accepted', function () {
    $event = Event::factory()->create();
    $participant = Participant::factory()->for($event)->invited()->create([
        'status' => ParticipantStatus::InvitationRevoked,
    ]);
    $user = User::factory()->create(['email' => $participant->email]);

    $this->actingAs($user)
        ->post(route('invitations.store', $participant->invitation_token), [
            'consent' => '1',
        ])
        ->assertNotFound();
});

test('an authenticated user can accept an invitation and is bound to the participant', function () {
    $event = Event::factory()->create();
    $participant = Participant::factory()->for($event)->invited()->create([
        'name' => 'Ayşe Yılmaz',
        'email' => 'ayse@example.com',
    ]);
    $user = User::factory()->create([
        'name' => 'Ayşe Yılmaz',
        'email' => 'ayse@example.com',
    ]);

    $this->actingAs($user)
        ->post(route('invitations.store', $participant->invitation_token), [
            'consent' => '1',
        ])
        ->assertRedirect(route('events.show', $event));

    $participant->refresh();

    expect($participant->user_id)->toBe($user->id)
        ->and($participant->status)->toBe(ParticipantStatus::InvitationAccepted)
        ->and($participant->joined_at)->not->toBeNull()
        ->and($participant->consent_accepted_at)->not->toBeNull()
        ->and($participant->invitation_token)->toBeNull();
});

test('the same invitation cannot be accepted twice', function () {
    $event = Event::factory()->create();
    $participant = Participant::factory()->for($event)->invited()->create();
    $user = User::factory()->create(['email' => $participant->email]);

    $this->actingAs($user)
        ->post(route('invitations.store', $participant->invitation_token), [
            'consent' => '1',
        ])
        ->assertRedirect(route('events.show', $event));

    $this->actingAs($user)
        ->post(route('invitations.store', $participant->invitation_token), [
            'consent' => '1',
        ])
        ->assertNotFound();
});

test('a user cannot accept an invitation sent to a different email', function () {
    $event = Event::factory()->create();
    $participant = Participant::factory()->for($event)->invited()->create([
        'email' => 'ayse@example.com',
    ]);
    $user = User::factory()->create([
        'email' => 'baska@example.com',
    ]);

    $this->actingAs($user)
        ->from(route('invitations.show', $participant->invitation_token))
        ->post(route('invitations.store', $participant->invitation_token), [
            'consent' => '1',
        ])
        ->assertRedirect(route('invitations.show', $participant->invitation_token))
        ->assertSessionHasErrors([
            'invitation' => 'Bu davet başka bir e-posta adresine gönderildi.',
        ]);

    expect($participant->fresh()->user_id)->toBeNull();
});

test('consent is required before an invitation can be accepted', function () {
    $event = Event::factory()->create();
    $participant = Participant::factory()->for($event)->invited()->create();
    $user = User::factory()->create(['email' => $participant->email]);

    $this->actingAs($user)
        ->from(route('invitations.show', $participant->invitation_token))
        ->post(route('invitations.store', $participant->invitation_token), [])
        ->assertRedirect(route('invitations.show', $participant->invitation_token))
        ->assertSessionHasErrors('consent');

    expect($participant->fresh()->user_id)->toBeNull();
});

test('a joined participant without consent cannot view the event', function () {
    $event = Event::factory()->create();
    $member = User::factory()->create();
    Participant::factory()->for($event)->create([
        'user_id' => $member->id,
        'name' => $member->name,
        'email' => $member->email,
        'status' => ParticipantStatus::InvitationAccepted,
        'consent_accepted_at' => null,
    ]);

    $this->actingAs($member)
        ->get(route('events.show', $event))
        ->assertForbidden();
});

test('a newly registered user is redirected back to the invitation', function () {
    $event = Event::factory()->create();
    $participant = Participant::factory()->for($event)->invited()->create([
        'email' => 'yeni@example.com',
    ]);

    $this->withSession([
        'url.intended' => route('invitations.show', $participant->invitation_token),
        'invitation_email' => 'yeni@example.com',
    ])->post(route('register.store'), [
        'name' => 'Yeni Katılımcı',
        'email' => 'yeni@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertRedirect(route('invitations.show', $participant->invitation_token));
});
