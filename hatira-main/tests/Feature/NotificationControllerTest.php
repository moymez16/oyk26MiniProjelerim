<?php

use App\Models\Event;
use App\Models\Impression;
use App\Models\Participant;
use App\Models\User;
use App\Notifications\ImpressionReceivedNotification;
use App\Notifications\MemorySharedNotification;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

test('writing an impression notifies the subject without leaking an unnamed author', function () {
    Notification::fake();

    $owner = User::factory()->create(['name' => 'Uğur Arıcı']);
    $event = Event::factory()->for($owner, 'owner')->create();
    $member = User::factory()->create(['name' => 'Ali Berk']);
    $subject = Participant::factory()->for($event)->forUser($member)->create();

    $this->actingAs($owner)
        ->post(route('events.impressions.store', [$event, $subject]), [
            'body' => 'İsimsiz bir cümle.',
            'shows_author_name' => '0',
        ])
        ->assertRedirect();

    Notification::assertSentTo($member, ImpressionReceivedNotification::class, function (ImpressionReceivedNotification $notification) use ($member): bool {
        $payload = $notification->toArray($member);

        expect($payload['message'])->toBe('Hakkında isimsiz bir izlenim bırakıldı.')
            ->and($payload)->not->toHaveKey('author_name');

        $mail = (string) $notification->toMail($member)->render();

        expect($mail)
            ->toContain('Hakkında isimsiz bir izlenim bırakıldı.')
            ->not->toContain('Uğur Arıcı');

        return true;
    });
});

test('sharing a memory notifies other participants', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $member = User::factory()->create();
    Participant::factory()->for($event)->forUser($member)->create();

    $this->actingAs($owner)
        ->post(route('events.memories.store', $event), [
            'body' => 'Market kuyruğu.',
        ])
        ->assertRedirect();

    Notification::assertSentTo($member, MemorySharedNotification::class);
    Notification::assertNotSentTo($owner, MemorySharedNotification::class);
});

test('disabled notification preferences skip delivery', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $event = Event::factory()->for($owner, 'owner')->create();
    $member = User::factory()->create([
        'notification_preferences' => [
            'new_impression' => false,
            'new_memory' => true,
            'new_participant' => true,
        ],
    ]);
    $subject = Participant::factory()->for($event)->forUser($member)->create();

    $this->actingAs($owner)
        ->post(route('events.impressions.store', [$event, $subject]), [
            'body' => 'Haber gitmesin.',
            'shows_author_name' => '1',
        ])
        ->assertRedirect();

    Notification::assertNotSentTo($member, ImpressionReceivedNotification::class);
});

test('the notifications page lists and marks items as read', function () {
    $user = User::factory()->create();
    $event = Event::factory()->for($user, 'owner')->create();
    $impression = Impression::factory()->for($event)->create([
        'author_participant_id' => $event->participantFor($user)?->id,
        'subject_participant_id' => $event->participantFor($user)?->id,
    ]);

    $user->notify(new ImpressionReceivedNotification($impression));

    expect($user->unreadNotifications()->count())->toBe(1);

    $this->actingAs($user)
        ->get(route('notifications.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('notifications/index')
            ->has('notifications', 1));

    expect($user->fresh()->unreadNotifications()->count())->toBe(0);
});

test('a user can update notification preferences', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put(route('notifications.preferences.update'), [
            'new_impression' => '0',
            'new_memory' => '1',
            'new_participant' => '0',
        ])
        ->assertRedirect();

    expect($user->fresh()->wantsNotification('new_impression'))->toBeFalse()
        ->and($user->fresh()->wantsNotification('new_memory'))->toBeTrue()
        ->and($user->fresh()->wantsNotification('new_participant'))->toBeFalse();
});
