<?php

namespace App\Support;

use App\Actions\StorePublicImage;
use App\Models\Attachment;
use App\Models\Memory;
use App\Models\Participant;

class MemoryPresenter
{
    public function __construct(private StorePublicImage $storeImage) {}

    /**
     * @return array<string, mixed>
     */
    public function forViewer(Memory $memory, Participant $viewer): array
    {
        $displayDate = $memory->displayDate();

        return [
            'ulid' => $memory->ulid,
            'body' => $memory->body,
            'occurred_on' => $memory->occurred_on?->toDateString(),
            'created_at' => $memory->created_at?->toIso8601String(),
            'event_day_label' => $this->eventDayLabel($memory),
            'display_date' => $displayDate->timezone(config('app.timezone'))->locale('tr')->translatedFormat('j F'),
            'author_name' => $memory->participant->name,
            'author_ulid' => $memory->participant->ulid,
            'author_photo_url' => $this->storeImage->url($memory->participant->photo_path),
            'attachments' => $memory->attachments
                ->map(fn (Attachment $attachment): array => [
                    'ulid' => $attachment->ulid,
                    'url' => $attachment->url(),
                ])
                ->all(),
            'can_update' => $viewer->is($memory->participant) && $memory->isWithinEditWindow(),
            'can_delete' => $viewer->is($memory->participant),
            'can_report' => ! $viewer->is($memory->participant),
        ];
    }

    /**
     * @param  iterable<int, Memory>  $memories
     * @return list<array<string, mixed>>
     */
    public function manyForViewer(iterable $memories, Participant $viewer): array
    {
        $presented = [];

        foreach ($memories as $memory) {
            $presented[] = $this->forViewer($memory, $viewer);
        }

        return $presented;
    }

    private function eventDayLabel(Memory $memory): string
    {
        $displayDate = $memory->displayDate();
        $startsOn = $memory->event->starts_on;
        $date = $displayDate->copy()->timezone(config('app.timezone'))->locale('tr')->translatedFormat('j F');
        $day = $startsOn->copy()->startOfDay()->diffInDays($displayDate->copy()->startOfDay()) + 1;

        if ($day < 1) {
            return $date;
        }

        return $date.' — '.$day.'. gün';
    }
}
