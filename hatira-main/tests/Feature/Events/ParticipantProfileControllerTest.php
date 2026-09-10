<?php

use App\Models\Event;
use App\Models\Participant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('an active participant can view another participant profile', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $member = User::factory()->create();
    $participant = Participant::factory()->for($event)->forUser($member)->create([
        'bio' => 'Kampın en komik insanı.',
    ]);

    $this->actingAs($owner)
        ->get(route('events.participants.show', [$event, $participant]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/participants/show')
            ->where('participant.name', $member->name)
            ->where('participant.bio', 'Kampın en komik insanı.')
            ->where('participant.is_self', false)
            ->has('impressions')
            ->where('prompt', 'Bu kişiyle ilk tanıştığında ne düşündün?'));
});

test('a stranger cannot view a participant profile', function () {
    $event = Event::factory()->create();
    $participant = $event->participants()->first();
    $stranger = User::factory()->create();

    $this->actingAs($stranger)
        ->get(route('events.participants.show', [$event, $participant]))
        ->assertNotFound();
});

test('the event home page renders for an active participant', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create([
        'name' => 'Laravel Kampı',
    ]);

    $this->actingAs($owner)
        ->get(route('events.show', $event))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/show')
            ->where('event.name', 'Laravel Kampı')
            ->has('event.participants')
            ->has('event.cover_url')
            ->has('feed'));
});
