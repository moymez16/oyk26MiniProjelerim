<?php

use App\Models\Event;
use App\Models\Impression;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;

test('a named impression includes the author name for other participants', function () {
    [$owner, $event, $author, $subject, $subjectUser] = namedImpressionPair();

    Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
        'body' => 'İsmimle duran bir cümle.',
        'shows_author_name' => true,
    ]);

    $this->actingAs($subjectUser)
        ->get(route('events.participants.show', [$event, $subject]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/participants/show')
            ->where('impressions.0.body', 'İsmimle duran bir cümle.')
            ->where('impressions.0.author_name', 'Uğur Arıcı')
            ->where('impressions.0.author_ulid', $author->ulid));
});

test('an unnamed impression never leaks the author identity in the response', function () {
    [$owner, $event, $author, $subject, $subjectUser] = namedImpressionPair();

    Impression::factory()->for($event)->unnamed()->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
        'body' => 'İsimsiz duran bir cümle.',
    ]);

    $response = $this->actingAs($subjectUser)
        ->get(route('events.participants.show', [$event, $subject]))
        ->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('events/participants/show')
        ->where('impressions.0.body', 'İsimsiz duran bir cümle.')
        ->missing('impressions.0.author_name')
        ->missing('impressions.0.author_ulid')
        ->missing('impressions.0.author_photo_url')
        ->missing('impressions.0.shows_author_name'));

    expect($response->content())
        ->not->toContain('Uğur Arıcı')
        ->not->toContain($author->ulid);
});

test('the author still sees their own name on an unnamed impression they wrote', function () {
    [$owner, $event, $author, $subject] = namedImpressionPair();

    Impression::factory()->for($event)->unnamed()->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
        'body' => 'İsimsiz bıraktığım cümle.',
    ]);

    $this->actingAs($owner)
        ->get(route('events.impressions.index', $event))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('impressions.0.author_name', 'Uğur Arıcı')
            ->where('impressions.0.shows_author_name', false)
            ->where('impressions.0.subject_name', 'Ali Berk'));
});

test('a participant can read visible impressions written about them', function () {
    [, $event, $author, $subject, $subjectUser] = namedImpressionPair();

    Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Hakkında yazılan görünür cümle.',
    ]);
    Impression::factory()->for($event)->hidden()->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Gizlenmiş cümle.',
    ]);
    Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Yarın açılacak cümle.',
        'visible_from' => now()->addDay(),
    ]);

    $this->actingAs($subjectUser)
        ->get(route('events.participants.show', [$event, $subject]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('impressions', 1)
            ->where('impressions.0.body', 'Hakkında yazılan görünür cümle.')
            ->where('prompt', null));
});

test('another participant can read visible impressions on a profile', function () {
    [$owner, $event, $author, $subject] = namedImpressionPair();
    $visitor = User::factory()->create();
    Participant::factory()->for($event)->forUser($visitor)->create();

    Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Herkese açık cümle.',
    ]);

    $this->actingAs($visitor)
        ->get(route('events.participants.show', [$event, $subject]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('impressions', 1)
            ->where('impressions.0.body', 'Herkese açık cümle.')
            ->where('prompt', 'Bu kişiyle ilk tanıştığında ne düşündün?'));
});

test('the writing prompt changes after the first impression', function () {
    [$owner, $event, $author, $subject] = namedImpressionPair();

    Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
    ]);

    $this->actingAs($owner)
        ->get(route('events.participants.show', [$event, $subject]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('prompt', 'Onu tanıdıkça fikrin değişti mi?'));
});

test('impression dates are labeled with the event day', function () {
    [$owner, $event, $author, $subject] = namedImpressionPair();

    Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Dördüncü gün.',
        'created_at' => '2026-08-18 20:00:00',
    ]);

    $this->actingAs($owner)
        ->get(route('events.participants.show', [$event, $subject]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('impressions.0.event_day_label', '18 Ağustos — 4. gün'));
});

test('a stranger is denied as not found when viewing an impression', function () {
    [, $event, $author, $subject] = namedImpressionPair();
    $impression = Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
    ]);
    $stranger = User::factory()->create();

    expect(Gate::forUser($stranger)->inspect('view', $impression)->status())->toBe(404)
        ->and(Gate::forUser($stranger)->inspect('create', [Impression::class, $event])->status())->toBe(404)
        ->and(Gate::forUser($stranger)->inspect('update', $impression)->status())->toBe(404)
        ->and(Gate::forUser($stranger)->inspect('delete', $impression)->status())->toBe(404);
});

test('the author is denied from updating after the edit window closes', function () {
    [$owner, $event, $author, $subject] = namedImpressionPair();
    $impression = Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
    ]);

    $this->travel(Impression::EDIT_WINDOW_MINUTES + 1)->minutes();

    expect(Gate::forUser($owner)->inspect('update', $impression)->denied())->toBeTrue()
        ->and(Gate::forUser($owner)->inspect('delete', $impression)->allowed())->toBeTrue();
});

/**
 * @return array{0: User, 1: Event, 2: Participant, 3: Participant, 4: User}
 */
function namedImpressionPair(): array
{
    $owner = User::factory()->create(['name' => 'Uğur Arıcı']);
    $event = Event::factory()->for($owner, 'owner')->create([
        'starts_on' => '2026-08-15',
    ]);
    $subjectUser = User::factory()->create(['name' => 'Ali Berk']);
    $subject = Participant::factory()->for($event)->forUser($subjectUser)->create();
    $author = $event->participantFor($owner);

    return [$owner, $event, $author, $subject, $subjectUser];
}
