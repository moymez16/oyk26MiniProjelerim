<?php

use App\Models\Event;
use App\Models\Impression;
use App\Models\Memory;
use App\Models\Participant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('the event home page shows a feed of memories impressions and joins', function () {
    $owner = User::factory()->create(['name' => 'Uğur Arıcı']);
    $event = Event::factory()->for($owner, 'owner')->create([
        'name' => 'Laravel Kampı',
        'starts_on' => '2026-08-15',
    ]);
    $member = User::factory()->create(['name' => 'Ali Berk']);
    $subject = Participant::factory()->for($event)->forUser($member)->create();
    $author = $event->participantFor($owner);

    Memory::factory()->for($event)->create([
        'participant_id' => $author?->id,
        'body' => 'Market kuyruğu.',
        'occurred_on' => '2026-08-16',
    ]);
    Impression::factory()->for($event)->unnamed()->create([
        'author_participant_id' => $author?->id,
        'subject_participant_id' => $subject->id,
        'body' => 'İsimsiz cümle.',
    ]);

    $this->actingAs($member)
        ->get(route('events.show', $event))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/show')
            ->has('feed')
            ->where('event.name', 'Laravel Kampı')
            ->has('feed', 4));
});

test('the event feed never leaks an unnamed impression author', function () {
    $owner = User::factory()->create(['name' => 'Uğur Arıcı']);
    $event = Event::factory()->for($owner, 'owner')->create();
    $member = User::factory()->create(['name' => 'Ali Berk']);
    $subject = Participant::factory()->for($event)->forUser($member)->create();

    Impression::factory()->for($event)->unnamed()->create([
        'author_participant_id' => $event->participantFor($owner)?->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Gizli yazar.',
    ]);

    $response = $this->actingAs($member)
        ->get(route('events.show', $event))
        ->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->has('feed')
        ->where('feed', function (mixed $feed): bool {
            $impression = collect($feed)->firstWhere('type', 'impression');

            return is_array($impression)
                && ($impression['headline'] ?? null) === 'Ali Berk hakkında bir izlenim bırakıldı.'
                && ! array_key_exists('author_name', $impression['impression'] ?? []);
        }));
});

test('a stranger cannot view the event feed', function () {
    $event = Event::factory()->create();
    $stranger = User::factory()->create();

    $this->actingAs($stranger)
        ->get(route('events.show', $event))
        ->assertNotFound();
});
