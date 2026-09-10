<?php

namespace App\Support;

use App\Models\Event;
use App\Models\Impression;
use App\Models\Memory;
use App\Models\Participant;

class EventFeedBuilder
{
    public function __construct(
        private ImpressionPresenter $impressionPresenter,
        private MemoryPresenter $memoryPresenter,
    ) {}

    /**
     * @return list<array<string, mixed>>
     */
    public function forViewer(Event $event, Participant $viewer): array
    {
        $items = [
            ...$this->memoryItems($event, $viewer),
            ...$this->impressionItems($event, $viewer),
            ...$this->participantItems($event),
        ];

        usort($items, fn (array $left, array $right): int => strcmp((string) $right['occurred_at'], (string) $left['occurred_at']));

        return array_slice($items, 0, 20);
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function memoryItems(Event $event, Participant $viewer): array
    {
        $memories = Memory::query()
            ->visible()
            ->where('event_id', $event->id)
            ->with(['participant', 'event', 'attachments'])
            ->orderByDesc('id')
            ->limit(20)
            ->get();

        $items = [];

        foreach ($memories as $memory) {
            $items[] = [
                'type' => 'memory',
                'occurred_at' => $memory->displayDate()->toIso8601String(),
                'headline' => __(':name shared a memory.', ['name' => $memory->participant->name]),
                'memory' => $this->memoryPresenter->forViewer($memory, $viewer),
            ];
        }

        return $items;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function impressionItems(Event $event, Participant $viewer): array
    {
        $impressions = Impression::query()
            ->visible()
            ->where('event_id', $event->id)
            ->with(['author', 'subject', 'event', 'attachments'])
            ->orderByDesc('id')
            ->limit(20)
            ->get();

        $items = [];

        foreach ($impressions as $impression) {
            $presented = $this->impressionPresenter->forViewer($impression, $viewer);
            $items[] = [
                'type' => 'impression',
                'occurred_at' => $impression->created_at?->toIso8601String(),
                'headline' => $this->impressionHeadline($impression, $presented),
                'impression' => $presented,
            ];
        }

        return $items;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function participantItems(Event $event): array
    {
        $participants = $event->participants()
            ->whereNotNull('joined_at')
            ->orderByDesc('joined_at')
            ->limit(20)
            ->get();

        $items = [];

        foreach ($participants as $participant) {
            $items[] = [
                'type' => 'participant',
                'occurred_at' => $participant->joined_at?->toIso8601String(),
                'headline' => __(':name joined the event.', ['name' => $participant->name]),
                'participant' => [
                    'ulid' => $participant->ulid,
                    'name' => $participant->name,
                ],
            ];
        }

        return $items;
    }

    /**
     * @param  array<string, mixed>  $presented
     */
    private function impressionHeadline(Impression $impression, array $presented): string
    {
        if (isset($presented['author_name'])) {
            return __(':author wrote about :subject.', [
                'author' => $presented['author_name'],
                'subject' => $impression->subject->name,
            ]);
        }

        return __('Someone wrote about :subject.', [
            'subject' => $impression->subject->name,
        ]);
    }
}
