<?php

namespace App\Notifications;

use App\Models\Participant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ParticipantJoinedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Participant $participant)
    {
        $this->afterCommit();
    }

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $this->participant->loadMissing('event');

        return (new MailMessage)
            ->subject(__('Someone joined :event', ['event' => $this->participant->event->name]))
            ->line($this->message())
            ->action(__('Open the event'), $this->url());
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $this->participant->loadMissing('event');

        return [
            'type' => 'new_participant',
            'event_ulid' => $this->participant->event->ulid,
            'event_name' => $this->participant->event->name,
            'participant_ulid' => $this->participant->ulid,
            'participant_name' => $this->participant->name,
            'message' => $this->message(),
            'url' => $this->url(),
        ];
    }

    private function message(): string
    {
        return __(':name joined :event.', [
            'name' => $this->participant->name,
            'event' => $this->participant->event->name,
        ]);
    }

    private function url(): string
    {
        return route('events.show', $this->participant->event);
    }
}
