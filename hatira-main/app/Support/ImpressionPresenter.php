<?php

namespace App\Support;

use App\Actions\StorePublicImage;
use App\Models\Attachment;
use App\Models\Impression;
use App\Models\Participant;

class ImpressionPresenter
{
    public function __construct(private StorePublicImage $storeImage) {}

    /**
     * @return array<string, mixed>
     */
    public function forViewer(Impression $impression, Participant $viewer): array
    {
        $payload = [
            'ulid' => $impression->ulid,
            'body' => $impression->body,
            'created_at' => $impression->created_at?->toIso8601String(),
            'event_day_label' => $this->eventDayLabel($impression),
            'attachments' => $impression->attachments
                ->map(fn (Attachment $attachment): array => [
                    'ulid' => $attachment->ulid,
                    'url' => $attachment->url(),
                ])
                ->all(),
            'can_update' => $viewer->is($impression->author) && $impression->isWithinEditWindow(),
            'can_delete' => $viewer->is($impression->author),
            'can_hide' => $viewer->is($impression->subject),
            'can_report' => ! $viewer->is($impression->author),
        ];

        if ($viewer->is($impression->author) || $impression->shows_author_name) {
            $payload['author_name'] = $impression->author->name;
            $payload['author_ulid'] = $impression->author->ulid;
            $payload['author_photo_url'] = $this->storeImage->url($impression->author->photo_path);
        }

        if ($viewer->is($impression->author)) {
            $payload['shows_author_name'] = $impression->shows_author_name;
            $payload['subject_name'] = $impression->subject->name;
            $payload['subject_ulid'] = $impression->subject->ulid;
        }

        return $payload;
    }

    /**
     * Yearbook / PDF payload. Never reveals the author of an unnamed impression,
     * including when the current viewer wrote it.
     *
     * @return array<string, mixed>
     */
    public function forYearbook(Impression $impression): array
    {
        $payload = [
            'ulid' => $impression->ulid,
            'body' => $impression->body,
            'created_at' => $impression->created_at?->toIso8601String(),
            'event_day_label' => $this->eventDayLabel($impression),
            'attachments' => $impression->attachments
                ->map(fn (Attachment $attachment): array => [
                    'ulid' => $attachment->ulid,
                    'url' => $attachment->url(),
                ])
                ->all(),
            'subject_name' => $impression->subject->name,
            'subject_ulid' => $impression->subject->ulid,
        ];

        if ($impression->shows_author_name) {
            $payload['author_name'] = $impression->author->name;
            $payload['author_ulid'] = $impression->author->ulid;
            $payload['author_photo_url'] = $this->storeImage->url($impression->author->photo_path);
        }

        return $payload;
    }

    /**
     * @param  iterable<int, Impression>  $impressions
     * @return list<array<string, mixed>>
     */
    public function manyForViewer(iterable $impressions, Participant $viewer): array
    {
        $presented = [];

        foreach ($impressions as $impression) {
            $presented[] = $this->forViewer($impression, $viewer);
        }

        return $presented;
    }

    /**
     * @param  iterable<int, Impression>  $impressions
     * @return list<array<string, mixed>>
     */
    public function manyForYearbook(iterable $impressions): array
    {
        $presented = [];

        foreach ($impressions as $impression) {
            $presented[] = $this->forYearbook($impression);
        }

        return $presented;
    }

    private function eventDayLabel(Impression $impression): string
    {
        $createdAt = $impression->created_at;
        $startsOn = $impression->event->starts_on;

        if ($createdAt === null) {
            return '';
        }

        $date = $createdAt->copy()->timezone(config('app.timezone'))->locale('tr')->translatedFormat('j F');
        $day = $startsOn->copy()->startOfDay()->diffInDays($createdAt->copy()->startOfDay()) + 1;

        return $date.' — '.$day.'. gün';
    }
}
