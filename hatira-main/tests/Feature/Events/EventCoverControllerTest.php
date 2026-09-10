<?php

use App\Models\Event;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('the owner can upload a cover image', function () {
    Storage::fake('public');

    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $file = UploadedFile::fake()->image('cover.jpg', 800, 400);

    $this->actingAs($owner)
        ->put(route('events.cover.update', $event), [
            'cover' => $file,
        ])
        ->assertRedirect(route('events.edit', $event));

    $event->refresh();

    expect($event->cover_image_path)->not->toBeNull();
    Storage::disk('public')->assertExists($event->cover_image_path);
});

test('an invalid cover image is rejected', function () {
    Storage::fake('public');

    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();

    $this->actingAs($owner)
        ->from(route('events.edit', $event))
        ->put(route('events.cover.update', $event), [
            'cover' => UploadedFile::fake()->create('notes.pdf', 100, 'application/pdf'),
        ])
        ->assertRedirect(route('events.edit', $event))
        ->assertSessionHasErrors('cover');
});

test('removing a cover deletes the stored file', function () {
    Storage::fake('public');

    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create([
        'cover_image_path' => UploadedFile::fake()->image('old.jpg')->store('covers', 'public'),
    ]);
    $path = $event->cover_image_path;

    $this->actingAs($owner)
        ->delete(route('events.cover.destroy', $event))
        ->assertRedirect(route('events.edit', $event));

    expect($event->fresh()->cover_image_path)->toBeNull();
    Storage::disk('public')->assertMissing($path);
});

test('a participant cannot upload a cover image', function () {
    Storage::fake('public');

    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $member = User::factory()->create();
    Participant::factory()->for($event)->forUser($member)->create();

    $this->actingAs($member)
        ->put(route('events.cover.update', $event), [
            'cover' => UploadedFile::fake()->image('cover.jpg'),
        ])
        ->assertForbidden();
});
