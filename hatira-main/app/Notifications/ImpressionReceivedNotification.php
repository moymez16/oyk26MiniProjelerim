<?php

namespace App\Notifications;

use App\Models\Impression;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ImpressionReceivedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Impression $impression)
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
        $this->impression->loadMissing(['event', 'author', 'subject']);

        return (new MailMessage)
            ->subject(__('A new impression was left about you'))
            ->line($this->message())
            ->action(__('Read it'), $this->url());
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $this->impression->loadMissing(['event', 'author', 'subject']);

        $payload = [
            'type' => 'new_impression',
            'event_ulid' => $this->impression->event->ulid,
            'event_name' => $this->impression->event->name,
            'subject_ulid' => $this->impression->subject->ulid,
            'message' => $this->message(),
            'url' => $this->url(),
        ];

        if ($this->impression->shows_author_name) {
            $payload['author_name'] = $this->impression->author->name;
        }

        return $payload;
    }

    private function message(): string
    {
        if ($this->impression->shows_author_name) {
            return __(':author left an impression about you.', [
                'author' => $this->impression->author->name,
            ]);
        }

        return __('Someone left an impression about you.');
    }

    private function url(): string
    {
        return route('events.participants.show', [
            $this->impression->event,
            $this->impression->subject,
        ]);
    }
}
