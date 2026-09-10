<?php

namespace App\Http\Controllers;

use App\Actions\StorePublicImage;
use App\Models\Impression;
use App\Models\Memory;
use App\Models\Participant;
use App\Support\ImpressionPresenter;
use App\Support\MemoryPresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class YearbookController extends Controller
{
    public function show(
        Request $request,
        StorePublicImage $storeImage,
        ImpressionPresenter $impressionPresenter,
        MemoryPresenter $memoryPresenter,
    ): Response {
        $user = $request->user();

        $participations = Participant::query()
            ->where('user_id', $user->id)
            ->whereNull('left_at')
            ->with('event')
            ->orderBy('id')
            ->get();

        $eventIds = $participations->pluck('event_id');

        $impressions = Impression::query()
            ->visible()
            ->whereIn('event_id', $eventIds)
            ->with(['author', 'subject', 'event', 'attachments'])
            ->orderBy('created_at')
            ->get()
            ->groupBy('event_id');

        $memories = Memory::query()
            ->visible()
            ->whereIn('event_id', $eventIds)
            ->with(['participant', 'event', 'attachments'])
            ->orderByRaw('coalesce(occurred_on, date(created_at))')
            ->get()
            ->groupBy('event_id');

        $events = $participations->map(function (Participant $viewer) use ($storeImage, $impressionPresenter, $memoryPresenter, $impressions, $memories): array {
            $event = $viewer->event;
            $eventImpressions = $impressions->get($event->id, collect());
            $eventMemories = $memories->get($event->id, collect());

            return [
                'ulid' => $event->ulid,
                'name' => $event->name,
                'cover_url' => $storeImage->url($event->cover_image_path),
                'starts_on' => $event->starts_on->toDateString(),
                'profile' => [
                    'name' => $viewer->name,
                    'bio' => $viewer->bio,
                    'photo_url' => $storeImage->url($viewer->photo_path),
                ],
                'about_me' => $impressionPresenter->manyForYearbook(
                    $eventImpressions->where('subject_participant_id', $viewer->id),
                ),
                'written_by_me' => $impressionPresenter->manyForYearbook(
                    $eventImpressions->where('author_participant_id', $viewer->id),
                ),
                'my_memories' => $memoryPresenter->manyForViewer(
                    $eventMemories->where('participant_id', $viewer->id),
                    $viewer,
                ),
            ];
        })->all();

        return Inertia::render('yearbook/me', [
            'events' => $events,
        ]);
    }
}
