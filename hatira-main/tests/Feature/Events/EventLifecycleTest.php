<?php

use App\Enums\EventStatus;
use App\Enums\ParticipantRole;
use App\Enums\ParticipantStatus;
use App\Models\Event;
use App\Models\Impression;
use App\Models\Memory;
use App\Models\Participant;
use App\Models\User;

test('a locked completed event rejects new impressions and memories', function () {
    [$owner, $event, , $subject] = lifecyclePair();
    $event->status = EventStatus::Completed;
    $event->allows_content_after_close = false;
    $event->save();

    $this->actingAs($owner)
        ->from(route('events.participants.show', [$event, $subject]))
        ->post(route('events.impressions.store', [$event, $subject]), [
            'body' => 'Geç kaldım.',
            'shows_author_name' => '1',
        ])
        ->assertForbidden();

    $this->actingAs($owner)
        ->from(route('events.memories.index', $event))
        ->post(route('events.memories.store', $event), [
            'body' => 'Geç anı.',
        ])
        ->assertForbidden();
});

test('a completed event with memories open still accepts a memory', function () {
    [$owner, $event] = lifecyclePair();
    $event->status = EventStatus::Completed;
    $event->allows_content_after_close = true;
    $event->save();

    $this->actingAs($owner)
        ->post(route('events.memories.store', $event), [
            'body' => 'Hatıralar açıkken yazılan anı.',
        ])
        ->assertRedirect();

    expect(Memory::query()->count())->toBe(1);
});

test('leaving an event keeps content and cuts access', function () {
    [$owner, $event, $author, $subject, $subjectUser] = lifecyclePair();
    Impression::factory()->for($event)->create([
        'author_participant_id' => $subject->id,
        'subject_participant_id' => $author->id,
        'body' => 'Ayrılınca duracak cümle.',
    ]);

    $this->actingAs($subjectUser)
        ->delete(route('events.leave', $event))
        ->assertRedirect(route('events.index'));

    expect($subject->fresh()->status)->toBe(ParticipantStatus::Left)
        ->and(Impression::query()->count())->toBe(1);

    $this->actingAs($subjectUser)
        ->get(route('events.show', $event))
        ->assertNotFound();

    $this->actingAs($subjectUser)
        ->get(route('events.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('events', 0));
});

test('the owner can end a participant access without deleting their content', function () {
    [$owner, $event, $author, $subject] = lifecyclePair();
    Impression::factory()->for($event)->create([
        'author_participant_id' => $subject->id,
        'subject_participant_id' => $author->id,
    ]);

    $this->actingAs($owner)
        ->post(route('events.participants.leave', [$event, $subject]))
        ->assertRedirect();

    expect($subject->fresh()->hasLeft())->toBeTrue()
        ->and(Impression::query()->count())->toBe(1);
});

test('ownership can only be transferred to an active participant', function () {
    [$owner, $event, , $subject, $subjectUser] = lifecyclePair();

    $this->actingAs($owner)
        ->put(route('events.owner.update', $event), [
            'participant_ulid' => $subject->ulid,
        ])
        ->assertRedirect(route('events.show', $event));

    expect($event->fresh()->owner_id)->toBe($subjectUser->id)
        ->and($subject->fresh()->role)->toBe(ParticipantRole::Owner)
        ->and($event->participantFor($owner)?->role)->toBe(ParticipantRole::Participant);
});

test('event status follows the allowed transition matrix', function () {
    [$owner, $event] = lifecyclePair();

    $this->actingAs($owner)
        ->put(route('events.status.update', $event), [
            'status' => EventStatus::Archived->value,
        ])
        ->assertRedirect()
        ->assertSessionHasErrors('status');

    $this->actingAs($owner)
        ->put(route('events.status.update', $event), [
            'status' => EventStatus::Active->value,
        ])
        ->assertRedirect();

    expect($event->fresh()->status)->toBe(EventStatus::Active);

    $this->actingAs($owner)
        ->put(route('events.status.update', $event), [
            'status' => EventStatus::Completed->value,
            'allows_content_after_close' => '0',
        ])
        ->assertRedirect();

    expect($event->fresh()->status)->toBe(EventStatus::Completed)
        ->and($event->fresh()->allows_content_after_close)->toBeFalse();
});

test('a participant who left cannot update or delete their content', function () {
    [$owner, $event, $author, $subject, $subjectUser] = lifecyclePair();
    $impression = Impression::factory()->for($event)->create([
        'author_participant_id' => $subject->id,
        'subject_participant_id' => $author->id,
        'body' => 'Ayrılınca dokunulmayacak.',
    ]);

    $this->actingAs($subjectUser)
        ->delete(route('events.leave', $event))
        ->assertRedirect();

    $this->actingAs($subjectUser)
        ->put(route('events.impressions.update', [$event, $impression]), [
            'body' => 'Gizli düzenleme.',
            'shows_author_name' => '1',
        ])
        ->assertNotFound();

    $this->actingAs($subjectUser)
        ->delete(route('events.impressions.destroy', [$event, $impression]))
        ->assertNotFound();

    expect($impression->fresh()->body)->toBe('Ayrılınca dokunulmayacak.');
});

test('the owner cannot leave without transferring ownership', function () {
    [$owner, $event] = lifecyclePair();

    $this->actingAs($owner)
        ->from(route('events.edit', $event))
        ->delete(route('events.leave', $event))
        ->assertRedirect()
        ->assertSessionHasErrors('event');
});

/**
 * @return array{0: User, 1: Event, 2: Participant|null, 3: Participant, 4: User}
 */
function lifecyclePair(): array
{
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $subjectUser = User::factory()->create();
    $subject = Participant::factory()->for($event)->forUser($subjectUser)->create();

    return [$owner, $event, $event->participantFor($owner), $subject, $subjectUser];
}
