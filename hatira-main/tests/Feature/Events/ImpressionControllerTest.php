<?php

use App\Models\Event;
use App\Models\Impression;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('a participant can write an impression about another participant', function () {
    [$owner, $event, $author, $subject] = impressionPair();

    $this->actingAs($owner)
        ->from(route('events.participants.show', [$event, $subject]))
        ->post(route('events.impressions.store', [$event, $subject]), [
            'body' => 'İlk gün biraz mesafeli biri olduğunu düşündüm.',
            'shows_author_name' => '1',
        ])
        ->assertRedirect(route('events.participants.show', [$event, $subject]));

    $impression = Impression::query()->first();

    expect($impression)->not->toBeNull()
        ->and($impression->event_id)->toBe($event->id)
        ->and($impression->author_participant_id)->toBe($author->id)
        ->and($impression->subject_participant_id)->toBe($subject->id)
        ->and($impression->body)->toBe('İlk gün biraz mesafeli biri olduğunu düşündüm.')
        ->and($impression->shows_author_name)->toBeTrue();
});

test('a participant cannot write an impression about themselves', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $author = $event->participantFor($owner);

    $this->actingAs($owner)
        ->from(route('events.participants.show', [$event, $author]))
        ->post(route('events.impressions.store', [$event, $author]), [
            'body' => 'Kendim hakkında bir şey.',
            'shows_author_name' => '1',
        ])
        ->assertRedirect(route('events.participants.show', [$event, $author]))
        ->assertSessionHasErrors([
            'body' => 'Kendin hakkında izlenim yazamazsın.',
        ]);

    expect(Impression::query()->count())->toBe(0);
});

test('a second impression about the same person does not replace the first', function () {
    [$owner, $event, $author, $subject] = impressionPair();

    Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
        'body' => 'İlk cümle.',
    ]);

    $this->actingAs($owner)
        ->post(route('events.impressions.store', [$event, $subject]), [
            'body' => 'İkinci cümle.',
            'shows_author_name' => '1',
        ])
        ->assertRedirect();

    expect(Impression::query()->pluck('body')->all())->toEqualCanonicalizing([
        'İlk cümle.',
        'İkinci cümle.',
    ]);
});

test('an impression can include multiple images', function () {
    Storage::fake('public');

    [$owner, $event, $author, $subject] = impressionPair();

    $this->actingAs($owner)
        ->post(route('events.impressions.store', [$event, $subject]), [
            'body' => 'Fotoğraflı bir izlenim.',
            'shows_author_name' => '1',
            'images' => [
                UploadedFile::fake()->image('one.jpg'),
                UploadedFile::fake()->image('two.png'),
            ],
        ])
        ->assertRedirect();

    $impression = Impression::query()->first();

    expect($impression?->attachments)->toHaveCount(2);

    foreach ($impression->attachments as $attachment) {
        Storage::disk('public')->assertExists($attachment->path);
    }
});

test('creating an impression requires a body and a name visibility choice', function () {
    [$owner, $event, , $subject] = impressionPair();

    $this->actingAs($owner)
        ->from(route('events.participants.show', [$event, $subject]))
        ->post(route('events.impressions.store', [$event, $subject]), [])
        ->assertRedirect(route('events.participants.show', [$event, $subject]))
        ->assertSessionHasErrors(['body', 'shows_author_name']);
});

test('the author can update an impression inside the edit window', function () {
    [$owner, $event, $author, $subject] = impressionPair();
    $impression = Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Yanlış yazılmış cümle.',
        'shows_author_name' => true,
    ]);

    $this->actingAs($owner)
        ->put(route('events.impressions.update', [$event, $impression]), [
            'body' => 'Düzeltilmiş cümle.',
            'shows_author_name' => '0',
        ])
        ->assertRedirect();

    $impression->refresh();

    expect($impression->body)->toBe('Düzeltilmiş cümle.')
        ->and($impression->shows_author_name)->toBeFalse();
});

test('the author cannot update an impression after the edit window closes', function () {
    [$owner, $event, $author, $subject] = impressionPair();
    $impression = Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Kalacak cümle.',
    ]);

    $this->travel(Impression::EDIT_WINDOW_MINUTES + 1)->minutes();

    $this->actingAs($owner)
        ->put(route('events.impressions.update', [$event, $impression]), [
            'body' => 'Geç kaldım.',
            'shows_author_name' => '1',
        ])
        ->assertForbidden();

    expect($impression->fresh()->body)->toBe('Kalacak cümle.');
});

test('the author can delete an impression after the edit window closes', function () {
    [$owner, $event, $author, $subject] = impressionPair();
    $impression = Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
    ]);

    $this->travel(Impression::EDIT_WINDOW_MINUTES + 1)->minutes();

    $this->actingAs($owner)
        ->delete(route('events.impressions.destroy', [$event, $impression]))
        ->assertRedirect();

    expect(Impression::query()->count())->toBe(0);
});

test('another participant cannot update or delete someone elses impression', function () {
    [$owner, $event, $author, $subject] = impressionPair();
    $other = User::factory()->create();
    Participant::factory()->for($event)->forUser($other)->create();
    $impression = Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Dokunulmayacak cümle.',
    ]);

    $this->actingAs($other)
        ->put(route('events.impressions.update', [$event, $impression]), [
            'body' => 'Başkasının cümlesi.',
            'shows_author_name' => '1',
        ])
        ->assertForbidden();

    $this->actingAs($other)
        ->delete(route('events.impressions.destroy', [$event, $impression]))
        ->assertForbidden();

    expect($impression->fresh()->body)->toBe('Dokunulmayacak cümle.');
});

test('a stranger cannot write or list impressions', function () {
    [, $event, , $subject] = impressionPair();
    $stranger = User::factory()->create();

    $this->actingAs($stranger)
        ->get(route('events.impressions.index', $event))
        ->assertNotFound();

    $this->actingAs($stranger)
        ->post(route('events.impressions.store', [$event, $subject]), [
            'body' => 'Davetsiz cümle.',
            'shows_author_name' => '1',
        ])
        ->assertNotFound();
});

test('guests are redirected away from impression routes', function () {
    [, $event, , $subject] = impressionPair();

    $this->get(route('events.impressions.index', $event))
        ->assertRedirect(route('login'));

    $this->post(route('events.impressions.store', [$event, $subject]), [
        'body' => 'Misafir cümlesi.',
        'shows_author_name' => '1',
    ])->assertRedirect(route('login'));
});

test('the author can list the impressions they wrote grouped by subject', function () {
    [$owner, $event, $author, $subject] = impressionPair();
    $otherSubjectUser = User::factory()->create(['name' => 'Ayşe Yılmaz']);
    $otherSubject = Participant::factory()->for($event)->forUser($otherSubjectUser)->create();

    Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Ali hakkında.',
    ]);
    Impression::factory()->for($event)->create([
        'author_participant_id' => $author->id,
        'subject_participant_id' => $otherSubject->id,
        'body' => 'Ayşe hakkında.',
    ]);
    Impression::factory()->for($event)->create([
        'author_participant_id' => $subject->id,
        'subject_participant_id' => $author->id,
        'body' => 'Sahip hakkında başkasının yazısı.',
    ]);

    $this->actingAs($owner)
        ->get(route('events.impressions.index', $event))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/impressions/index')
            ->has('impressions', 2)
            ->where('impressions.0.body', 'Ali hakkında.')
            ->where('impressions.0.subject_name', $subject->name)
            ->where('impressions.1.body', 'Ayşe hakkında.')
            ->where('impressions.1.subject_name', 'Ayşe Yılmaz'));
});

/**
 * @return array{0: User, 1: Event, 2: Participant, 3: Participant}
 */
function impressionPair(): array
{
    $owner = User::factory()->create(['name' => 'Uğur Arıcı']);
    $event = Event::factory()->for($owner, 'owner')->create([
        'starts_on' => '2026-08-15',
    ]);
    $subjectUser = User::factory()->create(['name' => 'Ali Berk']);
    $subject = Participant::factory()->for($event)->forUser($subjectUser)->create();
    $author = $event->participantFor($owner);

    return [$owner, $event, $author, $subject];
}
