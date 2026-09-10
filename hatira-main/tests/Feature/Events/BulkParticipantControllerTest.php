<?php

use App\Models\Event;
use App\Models\User;

test('the owner can add participants from a multiline list', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();

    $this->actingAs($owner)
        ->post(route('events.participants.bulk.store', $event), [
            'list' => "Ali Berk, ali@example.com\nAyşe Yılmaz, ayse@example.com\nMehmet Demir",
        ])
        ->assertRedirect(route('events.participants.index', $event));

    expect($event->participants()->where('name', 'Ali Berk')->where('email', 'ali@example.com')->exists())->toBeTrue()
        ->and($event->participants()->where('name', 'Ayşe Yılmaz')->where('email', 'ayse@example.com')->exists())->toBeTrue()
        ->and($event->participants()->where('name', 'Mehmet Demir')->whereNull('email')->exists())->toBeTrue();
});

test('an invalid email in the list is rejected', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();

    $this->actingAs($owner)
        ->from(route('events.participants.index', $event))
        ->post(route('events.participants.bulk.store', $event), [
            'list' => 'Ali Berk, ali-degil',
        ])
        ->assertRedirect(route('events.participants.index', $event))
        ->assertSessionHasErrors('participants.0.email');
});

test('an empty list is rejected', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();

    $this->actingAs($owner)
        ->from(route('events.participants.index', $event))
        ->post(route('events.participants.bulk.store', $event), [
            'list' => "\n\n  \n",
        ])
        ->assertRedirect(route('events.participants.index', $event))
        ->assertSessionHasErrors('participants');
});

test('a duplicate email in the same list is rejected', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();

    $this->actingAs($owner)
        ->from(route('events.participants.index', $event))
        ->post(route('events.participants.bulk.store', $event), [
            'list' => "Ali Berk, ali@example.com\nAli Tekrar, ali@example.com",
        ])
        ->assertRedirect(route('events.participants.index', $event))
        ->assertSessionHasErrors('participants.1.email');
});
