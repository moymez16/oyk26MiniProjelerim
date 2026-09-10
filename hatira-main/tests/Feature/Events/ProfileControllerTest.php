<?php

use App\Models\Event;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('a participant can update their event profile', function () {
    Storage::fake('public');

    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $member = User::factory()->create();
    Participant::factory()->for($event)->forUser($member)->create();
    $photo = UploadedFile::fake()->image('me.jpg');

    $this->actingAs($member)
        ->put(route('events.profile.update', $event), [
            'photo' => $photo,
            'bio' => 'Laravel öğrenmek için geldim.',
            'links' => [
                ['label' => 'Site', 'url' => 'https://example.com'],
            ],
        ])
        ->assertRedirect();

    $participant = $event->participantFor($member);

    expect($participant->bio)->toBe('Laravel öğrenmek için geldim.')
        ->and($participant->links)->toBe([
            ['label' => 'Site', 'url' => 'https://example.com'],
        ])
        ->and($participant->photo_path)->not->toBeNull();

    Storage::disk('public')->assertExists($participant->photo_path);
});

test('a participant cannot update another participant profile', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $member = User::factory()->create();
    Participant::factory()->for($event)->forUser($member)->create();

    $this->actingAs($member)
        ->put(route('events.profile.update', $event), [
            'bio' => 'Bu sahip profili değil.',
        ])
        ->assertRedirect();

    expect($event->participantFor($owner)->fresh()->bio)->toBeNull()
        ->and($event->participantFor($member)->fresh()->bio)->toBe('Bu sahip profili değil.');
});

test('empty link rows do not block a profile save', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();

    $this->actingAs($owner)
        ->put(route('events.profile.update', $event), [
            'bio' => 'Sadece bir cümle.',
            'links' => [
                ['label' => '', 'url' => ''],
            ],
        ])
        ->assertRedirect();

    expect($event->participantFor($owner)->fresh()->bio)->toBe('Sadece bir cümle.')
        ->and($event->participantFor($owner)->fresh()->links)->toBeNull();
});

test('a stranger cannot update an event profile', function () {
    $event = Event::factory()->create();
    $stranger = User::factory()->create();

    $this->actingAs($stranger)
        ->put(route('events.profile.update', $event), [
            'bio' => 'Görmemem gereken etkinlik',
        ])
        ->assertNotFound();
});

test('an invalid profile link is rejected', function () {
    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();

    $this->actingAs($owner)
        ->from(route('events.profile.edit', $event))
        ->put(route('events.profile.update', $event), [
            'links' => [
                ['label' => 'Kötü', 'url' => 'not-a-url'],
            ],
        ])
        ->assertRedirect(route('events.profile.edit', $event))
        ->assertSessionHasErrors('links.0.url');
});

test('removing a profile photo deletes the stored file', function () {
    Storage::fake('public');

    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $participant = $event->participantFor($owner);
    $participant->photo_path = UploadedFile::fake()->image('old.jpg')->store('profiles', 'public');
    $participant->save();
    $path = $participant->photo_path;

    $this->actingAs($owner)
        ->put(route('events.profile.update', $event), [
            'remove_photo' => '1',
        ])
        ->assertRedirect();

    expect($participant->fresh()->photo_path)->toBeNull();
    Storage::disk('public')->assertMissing($path);
});
