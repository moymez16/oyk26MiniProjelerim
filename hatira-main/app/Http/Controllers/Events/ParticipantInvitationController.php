<?php

namespace App\Http\Controllers\Events;

use App\Actions\SendParticipantInvitation;
use App\Enums\ParticipantStatus;
use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ParticipantInvitationController extends Controller
{
    public function store(
        Request $request,
        Event $event,
        Participant $participant,
        SendParticipantInvitation $sendInvitation,
    ): RedirectResponse {
        Gate::authorize('manageParticipants', $event);

        $sendInvitation->handle($participant);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Invitation sent.')]);

        return to_route('events.participants.index', $event);
    }

    public function destroy(Request $request, Event $event, Participant $participant): RedirectResponse
    {
        Gate::authorize('manageParticipants', $event);

        if (! $participant->canBeRevoked()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('This invitation cannot be revoked.')]);

            return to_route('events.participants.index', $event);
        }

        $participant->invitation_token = null;
        $participant->status = ParticipantStatus::InvitationRevoked;
        $participant->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Invitation revoked.')]);

        return to_route('events.participants.index', $event);
    }
}
