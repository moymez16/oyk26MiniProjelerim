<?php

use App\Models\Event;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

test('the owner is allowed to view update delete and manage participants', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();

    expect(Gate::forUser($owner)->inspect('view', $event)->allowed())->toBeTrue()
        ->and(Gate::forUser($owner)->inspect('update', $event)->allowed())->toBeTrue()
        ->and(Gate::forUser($owner)->inspect('delete', $event)->allowed())->toBeTrue()
        ->and(Gate::forUser($owner)->inspect('manageParticipants', $event)->allowed())->toBeTrue();
});

test('a participant can view the event but cannot manage it', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $member = User::factory()->create();
    Participant::factory()->for($event)->forUser($member)->create();

    expect(Gate::forUser($member)->inspect('view', $event)->allowed())->toBeTrue()
        ->and(Gate::forUser($member)->inspect('update', $event)->denied())->toBeTrue()
        ->and(Gate::forUser($member)->inspect('manageParticipants', $event)->denied())->toBeTrue();
});

test('a stranger is denied as not found', function () {
    $event = Event::factory()->create();
    $stranger = User::factory()->create();

    expect(Gate::forUser($stranger)->inspect('view', $event)->status())->toBe(404)
        ->and(Gate::forUser($stranger)->inspect('update', $event)->status())->toBe(404)
        ->and(Gate::forUser($stranger)->inspect('delete', $event)->status())->toBe(404);
});
