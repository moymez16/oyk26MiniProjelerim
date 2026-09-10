<?php

use App\Models\Event;
use App\Models\Impression;
use App\Models\Participant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('only participants can view the event yearbook', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create(['name' => 'Laravel Kampı']);
    $stranger = User::factory()->create();

    $this->actingAs($owner)
        ->get(route('events.yearbook.show', $event))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('yearbook/event')
            ->where('event.name', 'Laravel Kampı')
            ->has('participants')
            ->has('memories'));

    $this->actingAs($stranger)
        ->get(route('events.yearbook.show', $event))
        ->assertNotFound();
});

test('hidden and unnamed impressions follow the same rules in the yearbook', function () {
    $owner = User::factory()->create(['name' => 'Uğur Arıcı']);
    $event = Event::factory()->for($owner, 'owner')->create();
    $member = User::factory()->create(['name' => 'Ali Berk']);
    $subject = Participant::factory()->for($event)->forUser($member)->create();
    $author = $event->participantFor($owner);

    Impression::factory()->for($event)->create([
        'author_participant_id' => $author?->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Görünür cümle.',
    ]);
    Impression::factory()->for($event)->unnamed()->create([
        'author_participant_id' => $author?->id,
        'subject_participant_id' => $subject->id,
        'body' => 'İsimsiz yıllık cümlesi.',
    ]);
    Impression::factory()->for($event)->hidden()->create([
        'author_participant_id' => $author?->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Gizli cümle.',
    ]);

    $response = $this->actingAs($member)
        ->get(route('events.yearbook.show', $event))
        ->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->has('participants.1.impressions', 2)
        ->where('participants.1.impressions.0.body', 'Görünür cümle.')
        ->where('participants.1.impressions.1.body', 'İsimsiz yıllık cümlesi.')
        ->missing('participants.1.impressions.1.author_name'));

    $this->actingAs($owner)
        ->get(route('events.yearbook.show', $event))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('participants.1.impressions.1.body', 'İsimsiz yıllık cümlesi.')
            ->missing('participants.1.impressions.1.author_name'));
});

test('the event yearbook keeps pages for participants who left', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $member = User::factory()->create(['name' => 'Ali Berk']);
    $subject = Participant::factory()->for($event)->forUser($member)->create();
    $author = $event->participantFor($owner);

    Impression::factory()->for($event)->create([
        'author_participant_id' => $author?->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Ayrılmadan önceki cümle.',
    ]);

    $subject->markAsLeft();

    $this->actingAs($owner)
        ->get(route('events.yearbook.show', $event))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('participants', 2)
            ->where('participants.1.name', 'Ali Berk')
            ->where('participants.1.impressions.0.body', 'Ayrılmadan önceki cümle.'));
});

test('the personal yearbook only includes the viewer events and visible writing', function () {
    $owner = User::factory()->create(['name' => 'Uğur Arıcı']);
    $mine = Event::factory()->for($owner, 'owner')->create(['name' => 'Benim kampım']);
    $otherOwner = User::factory()->create();
    Event::factory()->for($otherOwner, 'owner')->create(['name' => 'Başkasının kampı']);
    $member = User::factory()->create(['name' => 'Ali Berk']);
    $subject = Participant::factory()->for($mine)->forUser($member)->create();

    Impression::factory()->for($mine)->unnamed()->create([
        'author_participant_id' => $mine->participantFor($owner)?->id,
        'subject_participant_id' => $subject->id,
        'body' => 'Kişisel yıllığa girecek isimsiz cümle.',
    ]);

    $this->actingAs($member)
        ->get(route('yearbook.show'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('yearbook/me')
            ->has('events', 1)
            ->where('events.0.name', 'Benim kampım')
            ->has('events.0.about_me', 1)
            ->missing('events.0.about_me.0.author_name'));
});
