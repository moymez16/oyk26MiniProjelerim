<?php

namespace App\Http\Controllers\Events;

use App\Actions\StorePublicImage;
use App\Enums\ParticipantRole;
use App\Enums\ParticipantStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Events\StoreParticipantRequest;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    public function index(Request $request, Event $event, StorePublicImage $storeImage): Response
    {
        Gate::authorize('view', $event);

        $event->load(['participants' => fn ($query) => $query->orderBy('id')]);

        return Inertia::render('events/participants/index', [
            'event' => [
                'ulid' => $event->ulid,
                'name' => $event->name,
                'is_owner' => $event->isOwnedBy($request->user()),
                'can_manage_participants' => $request->user()->can('manageParticipants', $event),
            ],
            'participants' => $event->participants
                ->map(fn (Participant $participant): array => [
                    'ulid' => $participant->ulid,
                    'name' => $participant->name,
                    'email' => $participant->email,
                    'role' => $participant->role->value,
                    'status' => $participant->status->value,
                    'status_label' => $this->statusLabel($participant->status),
                    'is_owner' => $participant->isOwner(),
                    'photo_url' => $storeImage->url($participant->photo_path),
                    'can_delete' => $request->user()->can('delete', $participant),
                    'can_invite' => $request->user()->can('manageParticipants', $event) && $participant->canBeInvited(),
                    'can_revoke' => $request->user()->can('manageParticipants', $event) && $participant->canBeRevoked(),
                ])
                ->all(),
        ]);
    }

    public function store(StoreParticipantRequest $request, Event $event): RedirectResponse
    {
        $event->participants()->create([
            ...$request->safe()->only(['name', 'email']),
            'role' => ParticipantRole::Participant,
            'status' => ParticipantStatus::NotInvited,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Participant added.')]);

        return to_route('events.participants.index', $event);
    }

    public function destroy(Request $request, Event $event, Participant $participant): RedirectResponse
    {
        Gate::authorize('delete', $participant);

        $participant->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Participant removed.')]);

        return to_route('events.participants.index', $event);
    }

    private function statusLabel(ParticipantStatus $status): string
    {
        return match ($status) {
            ParticipantStatus::NotInvited => __('Not invited'),
            ParticipantStatus::Invited => __('Invited'),
            ParticipantStatus::InvitationSeen => __('Invitation seen'),
            ParticipantStatus::InvitationAccepted => __('Invitation accepted'),
            ParticipantStatus::Active => __('Active'),
            ParticipantStatus::Left => __('Left'),
            ParticipantStatus::InvitationRevoked => __('Invitation revoked'),
        };
    }
}
