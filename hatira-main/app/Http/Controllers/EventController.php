<?php

namespace App\Http\Controllers;

use App\Actions\CreateEvent;
use App\Actions\StorePublicImage;
use App\Enums\EventStatus;
use App\Http\Requests\Events\StoreEventRequest;
use App\Http\Requests\Events\UpdateEventRequest;
use App\Models\Event;
use App\Models\Participant;
use App\Support\EventFeedBuilder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request, StorePublicImage $storeImage): Response
    {
        Gate::authorize('viewAny', Event::class);

        $events = Event::query()
            ->whereHas('participants', fn ($query) => $query
                ->where('user_id', $request->user()->id)
                ->whereNull('left_at'))
            ->withCount('participants')
            ->latest('id')
            ->get()
            ->map(fn (Event $event): array => $this->eventSummary($event, $request, $storeImage));

        return Inertia::render('events/index', [
            'events' => $events,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Event::class);

        return Inertia::render('events/create');
    }

    public function store(StoreEventRequest $request, CreateEvent $createEvent): RedirectResponse
    {
        $event = $createEvent->handle(
            $request->user(),
            $request->safe()->only([
                'name',
                'description',
                'long_description',
                'location',
                'starts_on',
                'ends_on',
            ]),
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event created.')]);

        return to_route('events.show', $event);
    }

    public function show(Request $request, Event $event, StorePublicImage $storeImage, EventFeedBuilder $feed): Response
    {
        Gate::authorize('view', $event);

        $event->load(['participants' => fn ($query) => $query->orderBy('id')]);
        $viewer = $event->participantFor($request->user());
        abort_unless($viewer instanceof Participant, 403);

        return Inertia::render('events/show', [
            'event' => $this->eventDetail($event, $request, $storeImage),
            'feed' => $feed->forViewer($event, $viewer),
        ]);
    }

    public function edit(Request $request, Event $event, StorePublicImage $storeImage): Response
    {
        Gate::authorize('update', $event);

        $event->load(['participants' => fn ($query) => $query->orderBy('id')]);

        return Inertia::render('events/edit', [
            'event' => $this->eventForm($event, $request, $storeImage),
            'transferable_participants' => $event->participants
                ->filter(fn (Participant $participant): bool => $participant->user_id !== null && ! $participant->isOwner() && ! $participant->hasLeft())
                ->map(fn (Participant $participant): array => [
                    'ulid' => $participant->ulid,
                    'name' => $participant->name,
                ])
                ->values()
                ->all(),
            'allowed_statuses' => array_map(
                fn ($status): string => $status->value,
                $event->allowedStatusTransitions(),
            ),
        ]);
    }

    public function update(UpdateEventRequest $request, Event $event): RedirectResponse
    {
        $event->update($request->safe()->only([
            'name',
            'description',
            'long_description',
            'location',
            'starts_on',
            'ends_on',
        ]));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event updated.')]);

        return to_route('events.show', $event);
    }

    public function destroy(Request $request, Event $event): RedirectResponse
    {
        Gate::authorize('delete', $event);

        $event->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event deleted.')]);

        return to_route('events.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function eventSummary(Event $event, Request $request, StorePublicImage $storeImage): array
    {
        return [
            ...$this->eventForm($event, $request, $storeImage),
            'participants_count' => $event->participants_count,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function eventDetail(Event $event, Request $request, StorePublicImage $storeImage): array
    {
        return [
            ...$this->eventForm($event, $request, $storeImage),
            'participants' => $event->participants
                ->map(fn (Participant $participant): array => [
                    'ulid' => $participant->ulid,
                    'name' => $participant->name,
                    'email' => $participant->email,
                    'role' => $participant->role->value,
                    'status' => $participant->status->value,
                    'is_owner' => $participant->isOwner(),
                    'photo_url' => $storeImage->url($participant->photo_path),
                ])
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function eventForm(Event $event, Request $request, StorePublicImage $storeImage): array
    {
        $viewer = $event->participantFor($request->user());

        return [
            'ulid' => $event->ulid,
            'name' => $event->name,
            'description' => $event->description,
            'long_description' => $event->long_description,
            'location' => $event->location,
            'cover_url' => $storeImage->url($event->cover_image_path),
            'starts_on' => $event->starts_on->toDateString(),
            'ends_on' => $event->ends_on?->toDateString(),
            'status' => $event->status->value,
            'status_label' => $this->statusLabel($event->status),
            'is_owner' => $event->isOwnedBy($request->user()),
            'can_manage_participants' => $request->user()->can('manageParticipants', $event),
            'can_moderate' => $request->user()->can('moderate', $event),
            'accepts_new_content' => $event->acceptsNewContent(),
            'allows_content_after_close' => $event->allows_content_after_close,
            'viewer_participant_ulid' => $viewer?->ulid,
        ];
    }

    private function statusLabel(EventStatus $status): string
    {
        return match ($status) {
            EventStatus::Draft => __('Draft'),
            EventStatus::Active => __('Active'),
            EventStatus::Completed => __('Completed'),
            EventStatus::Archived => __('Archived'),
        };
    }
}
