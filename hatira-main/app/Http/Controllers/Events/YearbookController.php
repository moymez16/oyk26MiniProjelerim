<?php

namespace App\Http\Controllers\Events;

use App\Actions\StorePublicImage;
use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Impression;
use App\Models\Memory;
use App\Models\Participant;
use App\Support\ImpressionPresenter;
use App\Support\MemoryPresenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class YearbookController extends Controller
{
    public function show(
        Request $request,
        Event $event,
        StorePublicImage $storeImage,
        ImpressionPresenter $impressionPresenter,
        MemoryPresenter $memoryPresenter,
    ): Response {
        Gate::authorize('view', $event);

        $viewer = $event->participantFor($request->user());
        abort_unless($viewer instanceof Participant, 404);

        $event->load(['participants' => fn ($query) => $query->whereNotNull('joined_at')->orderBy('id')]);

        $impressions = Impression::query()
            ->visible()
            ->where('event_id', $event->id)
            ->with(['author', 'subject', 'event', 'attachments'])
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();

        $memories = Memory::query()
            ->visible()
            ->where('event_id', $event->id)
            ->with(['participant', 'event', 'attachments'])
            ->orderByRaw('coalesce(occurred_on, date(created_at))')
            ->orderBy('id')
            ->get();

        $impressionsBySubject = $impressions->groupBy('subject_participant_id');

        return Inertia::render('yearbook/event', [
            'event' => [
                'ulid' => $event->ulid,
                'name' => $event->name,
                'description' => $event->description,
                'long_description' => $event->long_description,
                'location' => $event->location,
                'cover_url' => $storeImage->url($event->cover_image_path),
                'starts_on' => $event->starts_on->toDateString(),
                'ends_on' => $event->ends_on?->toDateString(),
            ],
            'memories' => $memoryPresenter->manyForViewer($memories, $viewer),
            'participants' => $event->participants->map(fn (Participant $participant): array => [
                'ulid' => $participant->ulid,
                'name' => $participant->name,
                'bio' => $participant->bio,
                'photo_url' => $storeImage->url($participant->photo_path),
                'impressions' => $impressionPresenter->manyForYearbook(
                    $impressionsBySubject->get($participant->id, collect()),
                ),
            ])->all(),
        ]);
    }
}
