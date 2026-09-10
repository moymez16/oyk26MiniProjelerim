<?php

use App\Models\Event;
use App\Models\Memory;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('a participant can share a memory with an optional event day', function () {
    [$owner, $event] = memoryEvent();

    $this->actingAs($owner)
        ->post(route('events.memories.store', $event), [
            'body' => 'Elektriklerin kesildiği gece…',
            'occurred_on' => '2026-08-18',
        ])
        ->assertRedirect(route('events.memories.index', $event));

    $memory = Memory::query()->first();

    expect($memory)->not->toBeNull()
        ->and($memory->body)->toBe('Elektriklerin kesildiği gece…')
        ->and($memory->occurred_on?->toDateString())->toBe('2026-08-18')
        ->and($memory->participant_id)->toBe($event->participantFor($owner)?->id);
});

test('a memory can include multiple images', function () {
    Storage::fake('public');

    [$owner, $event] = memoryEvent();

    $this->actingAs($owner)
        ->post(route('events.memories.store', $event), [
            'body' => 'Market kuyruğu.',
            'images' => [
                UploadedFile::fake()->image('one.jpg'),
                UploadedFile::fake()->image('two.webp'),
            ],
        ])
        ->assertRedirect();

    $memory = Memory::query()->first();

    expect($memory?->attachments)->toHaveCount(2);
});

test('a stranger cannot create or view memories', function () {
    [, $event] = memoryEvent();
    $stranger = User::factory()->create();

    $this->actingAs($stranger)
        ->get(route('events.memories.index', $event))
        ->assertNotFound();

    $this->actingAs($stranger)
        ->post(route('events.memories.store', $event), [
            'body' => 'Davetsiz anı.',
        ])
        ->assertNotFound();
});

test('a participant can only delete their own memory', function () {
    [$owner, $event] = memoryEvent();
    $other = User::factory()->create();
    Participant::factory()->for($event)->forUser($other)->create();
    $memory = Memory::factory()->for($event)->create([
        'participant_id' => $event->participantFor($owner)?->id,
        'body' => 'Sahibin anısı.',
    ]);

    $this->actingAs($other)
        ->delete(route('events.memories.destroy', [$event, $memory]))
        ->assertForbidden();

    $this->actingAs($owner)
        ->delete(route('events.memories.destroy', [$event, $memory]))
        ->assertRedirect();

    expect(Memory::query()->count())->toBe(0);
});

test('the memories page falls back to created_at when occurred_on is empty', function () {
    [$owner, $event] = memoryEvent();
    Memory::factory()->for($event)->create([
        'participant_id' => $event->participantFor($owner)?->id,
        'body' => 'Günü yazılmamış anı.',
        'occurred_on' => null,
        'created_at' => '2026-08-18 21:00:00',
    ]);

    $this->actingAs($owner)
        ->get(route('events.memories.index', $event))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/memories/index')
            ->where('memories.0.body', 'Günü yazılmamış anı.')
            ->where('memories.0.occurred_on', null)
            ->where('memories.0.event_day_label', '18 Ağustos — 4. gün'));
});

test('creating a memory requires a body', function () {
    [$owner, $event] = memoryEvent();

    $this->actingAs($owner)
        ->from(route('events.memories.index', $event))
        ->post(route('events.memories.store', $event), [])
        ->assertRedirect(route('events.memories.index', $event))
        ->assertSessionHasErrors('body');
});

/**
 * @return array{0: User, 1: Event}
 */
function memoryEvent(): array
{
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create([
        'starts_on' => '2026-08-15',
    ]);

    return [$owner, $event];
}
