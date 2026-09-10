<?php

use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use App\Models\Event;
use App\Models\Impression;
use App\Models\Memory;
use App\Models\Participant;
use App\Models\Report;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('a participant can report content once', function () {
    [$owner, $event, $author, $subject, $subjectUser] = moderationPair();
    $impression = Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
    ]);

    $this->actingAs($subjectUser)
        ->post(route('events.impressions.report', [$event, $impression]), [
            'reason' => ReportReason::Inappropriate->value,
        ])
        ->assertRedirect();

    expect(Report::query()->count())->toBe(1);

    $this->actingAs($subjectUser)
        ->from(route('events.participants.show', [$event, $subject]))
        ->post(route('events.impressions.report', [$event, $impression]), [
            'reason' => ReportReason::Spam->value,
        ])
        ->assertRedirect()
        ->assertSessionHasErrors('reason');
});

test('only the owner can view the moderation screen', function () {
    [$owner, $event, , $subject, $subjectUser] = moderationPair();

    $this->actingAs($owner)
        ->get(route('events.moderation.index', $event))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('events/moderation/index'));

    $this->actingAs($subjectUser)
        ->get(route('events.moderation.index', $event))
        ->assertForbidden();
});

test('the subject can hide an impression from their profile without deleting it', function () {
    [$owner, $event, $author, $subject, $subjectUser] = moderationPair();
    $impression = Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Gizlenecek cümle.',
    ]);

    $this->actingAs($subjectUser)
        ->post(route('events.impressions.hide', [$event, $impression]))
        ->assertRedirect();

    expect($impression->fresh()->hidden_at)->not->toBeNull()
        ->and(Impression::query()->visible()->count())->toBe(0)
        ->and(Impression::query()->count())->toBe(1);
});

test('the owner can hide or remove reported content', function () {
    [$owner, $event, $author, $subject, $subjectUser] = moderationPair();
    $impression = Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Kaldırılacak cümle.',
    ]);
    $report = $impression->reports()->create([
        'event_id' => $event->id,
        'reporter_participant_id' => $subject->id,
        'reason' => ReportReason::Inappropriate,
    ]);

    $this->actingAs($owner)
        ->put(route('events.moderation.update', [$event, $report]), [
            'action' => 'remove',
        ])
        ->assertRedirect();

    expect(Impression::query()->count())->toBe(0)
        ->and($report->fresh()->status)->toBe(ReportStatus::Removed);
});

test('a participant can report a memory', function () {
    [$owner, $event, $author, , $subjectUser] = moderationPair();
    $memory = Memory::factory()->for($event)->create([
        'participant_id' => $author->id,
        'body' => 'Bildirilecek anı.',
    ]);

    $this->actingAs($subjectUser)
        ->post(route('events.memories.report', [$event, $memory]), [
            'reason' => ReportReason::Other->value,
            'note' => 'Uygun değil.',
        ])
        ->assertRedirect();

    expect(Report::query()->count())->toBe(1);
});

/**
 * @return array{0: User, 1: Event, 2: Participant, 3: Participant, 4: User}
 */
function moderationPair(): array
{
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $subjectUser = User::factory()->create();
    $subject = Participant::factory()->for($event)->forUser($subjectUser)->create();

    return [$owner, $event, $event->participantFor($owner), $subject, $subjectUser];
}
