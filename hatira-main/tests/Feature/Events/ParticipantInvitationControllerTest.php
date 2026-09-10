<?php

use App\Enums\ParticipantStatus;
use App\Mail\ParticipantInvitationMail;
use App\Models\Event;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

test('the owner can send an invitation email', function () {
    Mail::fake();

    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $participant = Participant::factory()->for($event)->create([
        'name' => 'Ali Berk',
        'email' => 'ali@example.com',
    ]);

    $this->actingAs($owner)
        ->post(route('events.participants.invitation.store', [$event, $participant]))
        ->assertRedirect(route('events.participants.index', $event));

    $participant->refresh();

    expect($participant->status)->toBe(ParticipantStatus::Invited)
        ->and($participant->invitation_token)->not->toBeNull()
        ->and($participant->invited_at)->not->toBeNull();

    Mail::assertQueued(ParticipantInvitationMail::class, function (ParticipantInvitationMail $mail) use ($participant): bool {
        return $mail->hasTo('ali@example.com')
            && $mail->participant->is($participant);
    });
});

test('the owner can resend an invitation with a new token', function () {
    Mail::fake();

    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $participant = Participant::factory()->for($event)->invited()->create();
    $previousToken = $participant->invitation_token;

    $this->actingAs($owner)
        ->post(route('events.participants.invitation.store', [$event, $participant]))
        ->assertRedirect(route('events.participants.index', $event));

    $participant->refresh();

    expect($participant->invitation_token)->not->toBe($previousToken)
        ->and($participant->status)->toBe(ParticipantStatus::Invited);

    Mail::assertQueued(ParticipantInvitationMail::class);
});

test('the owner can revoke an invitation', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $participant = Participant::factory()->for($event)->invited()->create();
    $token = $participant->invitation_token;

    $this->actingAs($owner)
        ->delete(route('events.participants.invitation.destroy', [$event, $participant]))
        ->assertRedirect(route('events.participants.index', $event));

    expect($participant->fresh()->status)->toBe(ParticipantStatus::InvitationRevoked)
        ->and($participant->fresh()->invitation_token)->toBeNull();

    $this->get(route('invitations.show', $token))->assertNotFound();
});

test('an invitation cannot be sent without an email address', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $participant = Participant::factory()->for($event)->withoutEmail()->create();

    $this->actingAs($owner)
        ->from(route('events.participants.index', $event))
        ->post(route('events.participants.invitation.store', [$event, $participant]))
        ->assertRedirect(route('events.participants.index', $event))
        ->assertSessionHasErrors([
            'invitation' => 'Davet göndermek için e-posta adresi gerekir.',
        ]);
});

test('a participant cannot send invitations', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $member = User::factory()->create();
    Participant::factory()->for($event)->forUser($member)->create();
    $invitee = Participant::factory()->for($event)->create();

    $this->actingAs($member)
        ->post(route('events.participants.invitation.store', [$event, $invitee]))
        ->assertForbidden();
});

test('a stranger cannot send invitations', function () {
    $event = Event::factory()->create();
    $invitee = Participant::factory()->for($event)->create();
    $stranger = User::factory()->create();

    $this->actingAs($stranger)
        ->post(route('events.participants.invitation.store', [$event, $invitee]))
        ->assertNotFound();
});
