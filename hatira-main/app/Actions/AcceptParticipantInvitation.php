<?php

namespace App\Actions;

use App\Enums\ParticipantStatus;
use App\Models\Participant;
use App\Models\User;
use App\Notifications\ParticipantJoinedNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AcceptParticipantInvitation
{
    public function __construct(private NotifyEventParticipants $notifyParticipants) {}

    public function handle(Participant $participant, User $user): Participant
    {
        $this->ensureCanBeAccepted($participant, $user);

        $accepted = DB::transaction(function () use ($participant, $user): Participant {
            $participant->user_id = $user->id;
            $participant->invitation_token = null;
            $participant->joined_at = now();
            $participant->consent_accepted_at = now();
            $participant->status = ParticipantStatus::InvitationAccepted;
            $participant->save();

            return $participant;
        });

        $this->notifyParticipants->handle(
            $accepted->event,
            new ParticipantJoinedNotification($accepted),
            'new_participant',
            [$user->id],
        );

        return $accepted;
    }

    private function ensureCanBeAccepted(Participant $participant, User $user): void
    {
        if (! $participant->isAcceptable()) {
            throw ValidationException::withMessages([
                'invitation' => __('This invitation is no longer valid.'),
            ]);
        }

        if ($participant->hasMismatchedEmailFor($user)) {
            throw ValidationException::withMessages([
                'invitation' => __('This invitation was sent to a different email address.'),
            ]);
        }

        $alreadyJoined = Participant::query()
            ->where('event_id', $participant->event_id)
            ->where('user_id', $user->id)
            ->whereKeyNot($participant->id)
            ->exists();

        if ($alreadyJoined) {
            throw ValidationException::withMessages([
                'invitation' => __('You are already a participant of this event.'),
            ]);
        }
    }
}
