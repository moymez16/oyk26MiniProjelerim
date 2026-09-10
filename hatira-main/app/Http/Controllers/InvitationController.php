<?php

namespace App\Http\Controllers;

use App\Actions\AcceptParticipantInvitation;
use App\Enums\ParticipantStatus;
use App\Http\Requests\Events\AcceptInvitationRequest;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    public function show(Request $request, string $token): Response
    {
        $participant = $this->participantForToken($token);

        if ($participant->status === ParticipantStatus::Invited) {
            $participant->invitation_seen_at = now();
            $participant->status = ParticipantStatus::InvitationSeen;
            $participant->save();
        }

        $request->session()->put('url.intended', route('invitations.show', $token));
        $request->session()->put('invitation_email', $participant->email);

        $user = $request->user();

        return Inertia::render('invitations/show', [
            'token' => $token,
            'event' => [
                'name' => $participant->event->name,
                'description' => $participant->event->description,
                'location' => $participant->event->location,
                'starts_on' => $participant->event->starts_on->toDateString(),
                'ends_on' => $participant->event->ends_on?->toDateString(),
            ],
            'invitee_name' => $participant->name,
            'inviter_name' => $participant->event->owner->name,
            'is_authenticated' => $user !== null,
            'email_mismatch' => $user !== null && $participant->hasMismatchedEmailFor($user),
            'already_joined' => $user !== null && $participant->user_id === $user->id,
        ]);
    }

    public function store(
        AcceptInvitationRequest $request,
        string $token,
        AcceptParticipantInvitation $acceptInvitation,
    ): RedirectResponse {
        $participant = $this->participantForToken($token);

        $acceptInvitation->handle($participant, $request->user());

        $request->session()->forget('url.intended');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Invitation accepted.')]);

        return to_route('events.show', $participant->event);
    }

    private function participantForToken(string $token): Participant
    {
        $participant = Participant::query()
            ->with(['event.owner'])
            ->where('invitation_token', $token)
            ->first();

        if ($participant === null || ! $participant->isAcceptable()) {
            abort(404);
        }

        return $participant;
    }
}
