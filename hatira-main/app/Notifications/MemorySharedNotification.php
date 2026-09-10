<?php

namespace App\Notifications;

use App\Models\Memory;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MemorySharedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Memory $memory)
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
        $this->memory->loadMissing(['event', 'participant']);

        return (new MailMessage)
            ->subject(__('A new memory was shared'))
            ->line($this->message())
            ->action(__('Read it'), $this->url());
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $this->memory->loadMissing(['event', 'participant']);

        return [
            'type' => 'new_memory',
            'event_ulid' => $this->memory->event->ulid,
            'event_name' => $this->memory->event->name,
            'author_name' => $this->memory->participant->name,
            'memory_ulid' => $this->memory->ulid,
            'message' => $this->message(),
            'url' => $this->url(),
        ];
    }

    private function message(): string
    {
        return __(':name shared a memory in :event.', [
            'name' => $this->memory->participant->name,
            'event' => $this->memory->event->name,
        ]);
    }

    private function url(): string
    {
        return route('events.memories.index', $this->memory->event);
    }
}
