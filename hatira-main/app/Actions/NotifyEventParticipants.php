<?php

namespace App\Actions;

use App\Models\Event;
use App\Models\User;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Notification as NotificationFacade;

class NotifyEventParticipants
{
    /**
     * @param  list<int>  $exceptUserIds
     */
    public function handle(Event $event, Notification $notification, string $preference, array $exceptUserIds = []): void
    {
        $users = User::query()
            ->whereHas('participations', function ($query) use ($event): void {
                $query->where('event_id', $event->id)
                    ->whereNotNull('user_id');
            })
            ->when($exceptUserIds !== [], fn ($query) => $query->whereKeyNot($exceptUserIds))
            ->get()
            ->filter(fn (User $user): bool => $user->wantsNotification($preference))
            ->values();

        if ($users->isEmpty()) {
            return;
        }

        NotificationFacade::send($users, $notification);
    }
}
