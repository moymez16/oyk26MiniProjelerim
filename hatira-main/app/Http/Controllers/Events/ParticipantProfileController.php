<?php

namespace App\Http\Controllers\Events;

use App\Actions\StorePublicImage;
use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Impression;
use App\Models\Participant;
use App\Support\ImpressionPresenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantProfileController extends Controller
{
    public function show(
        Request $request,
        Event $event,
        Participant $participant,
        StorePublicImage $storeImage,
        ImpressionPresenter $presenter,
    ): Response {
        Gate::authorize('view', $event);

        $viewer = $event->participantFor($request->user());
        abort_unless($viewer instanceof Participant, 403);

        $impressions = Impression::query()
            ->visible()
            ->where('event_id', $event->id)
            ->where('subject_participant_id', $participant->id)
            ->with(['author', 'subject', 'event', 'attachments'])
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();

        $previousCount = Impression::query()
            ->where('event_id', $event->id)
            ->where('author_participant_id', $viewer->id)
            ->where('subject_participant_id', $participant->id)
            ->count();

        return Inertia::render('events/participants/show', [
            'event' => [
                'ulid' => $event->ulid,
                'name' => $event->name,
            ],
            'participant' => [
                'ulid' => $participant->ulid,
                'name' => $participant->name,
                'bio' => $participant->bio,
                'links' => $participant->links ?? [],
                'photo_url' => $storeImage->url($participant->photo_path),
                'is_owner' => $participant->isOwner(),
                'is_self' => $viewer->is($participant),
            ],
            'impressions' => $presenter->manyForViewer($impressions, $viewer),
            'prompt' => $viewer->is($participant)
                ? null
                : ($previousCount === 0
                    ? 'Bu kişiyle ilk tanıştığında ne düşündün?'
                    : 'Onu tanıdıkça fikrin değişti mi?'),
        ]);
    }
}
