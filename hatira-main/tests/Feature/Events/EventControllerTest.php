<?php

use App\Enums\ParticipantRole;
use App\Enums\ParticipantStatus;
use App\Models\Event;
use App\Models\Participant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from the events index', function () {
    $this->get(route('events.index'))
        ->assertRedirect(route('login'));
});

test('a user can view events they own and events they participate in', function () {
    $user = User::factory()->create();
    $ownedEvent = Event::factory()->for($user, 'owner')->create([
        'name' => 'Sahip olduğum etkinlik',
    ]);
    $otherEvent = Event::factory()->create([
        'name' => 'Katıldığım etkinlik',
    ]);
    Participant::factory()->for($otherEvent)->forUser($user)->create();
    Event::factory()->create([
        'name' => 'Görmemem gereken etkinlik',
    ]);

    $this->actingAs($user)
        ->get(route('events.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/index')
            ->has('events', 2)
            ->where('events.0.name', 'Katıldığım etkinlik')
            ->where('events.1.name', 'Sahip olduğum etkinlik'));

    expect($ownedEvent->participants()->where('user_id', $user->id)->exists())->toBeTrue();
});

test('creating an event also creates an active owner participant', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('events.store'), validEventPayload())
        ->assertRedirect();

    $event = Event::query()->first();

    expect($event)->not->toBeNull()
        ->and($event->owner_id)->toBe($user->id)
        ->and($event->name)->toBe('Özgür Yazılım Yaz Kampı 2026 — Laravel');

    $ownerParticipant = $event->participantFor($user);

    expect($ownerParticipant)->not->toBeNull()
        ->and($ownerParticipant->role)->toBe(ParticipantRole::Owner)
        ->and($ownerParticipant->status)->toBe(ParticipantStatus::Active)
        ->and($ownerParticipant->email)->toBe($user->email);
});

test('creating an event requires a name and description', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('events.create'))
        ->post(route('events.store'), [])
        ->assertRedirect(route('events.create'))
        ->assertSessionHasErrors(['name', 'description', 'starts_on']);

    $this->actingAs($user)
        ->from(route('events.create'))
        ->post(route('events.store'), [])
        ->assertSessionHasErrors([
            'name' => 'Ad zorunludur.',
            'description' => 'Kısa açıklama zorunludur.',
        ]);
});

test('the event owner can update the event', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();

    $this->actingAs($owner)
        ->patch(route('events.update', $event), [
            ...validEventPayload(),
            'name' => 'Güncellenmiş etkinlik',
        ])
        ->assertRedirect(route('events.show', $event));

    expect($event->refresh()->name)->toBe('Güncellenmiş etkinlik');
});

test('a participant cannot update the event', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $participant = User::factory()->create();
    Participant::factory()->for($event)->forUser($participant)->create();

    $this->actingAs($participant)
        ->patch(route('events.update', $event), validEventPayload())
        ->assertForbidden();
});

test('a stranger cannot view an event', function () {
    $event = Event::factory()->create();
    $stranger = User::factory()->create();

    $this->actingAs($stranger)
        ->get(route('events.show', $event))
        ->assertNotFound();
});

test('the event owner can delete the event', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();

    $this->actingAs($owner)
        ->delete(route('events.destroy', $event))
        ->assertRedirect(route('events.index'));

    expect(Event::query()->find($event->id))->toBeNull()
        ->and(Event::withTrashed()->find($event->id))->not->toBeNull();
});

/**
 * @return array<string, string>
 */
function validEventPayload(): array
{
    return [
        'name' => 'Özgür Yazılım Yaz Kampı 2026 — Laravel',
        'description' => 'Dokuz gün boyunca aynı sınıfta eğitim alan Laravel sınıfının ortak hatıra alanı.',
        'starts_on' => '2026-08-15',
        'ends_on' => '2026-08-23',
    ];
}
