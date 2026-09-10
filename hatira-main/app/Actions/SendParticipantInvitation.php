<?php

namespace App\Actions;

use App\Enums\ParticipantStatus;
use App\Mail\ParticipantInvitationMail;
use App\Models\Participant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SendParticipantInvitation
{
    public function handle(Participant $participant): Participant
    {
        $this->ensureCanBeInvited($participant);

        $participant = DB::transaction(function () use ($participant): Participant {
            $participant->invitation_token = Str::random(64);
            $participant->invited_at = now();
            $participant->invitation_seen_at = null;
            $participant->status = ParticipantStatus::Invited;
            $participant->save();

            return $participant->fresh(['event.owner']);
        });

        Mail::to($participant->email)->send(new ParticipantInvitationMail($participant));

        return $participant;
    }

    private function ensureCanBeInvited(Participant $participant): void
    {
        if ($participant->isOwner()) {
            throw ValidationException::withMessages([
                'invitation' => __('The event owner cannot be invited.'),
            ]);
        }

        if ($participant->email === null) {
            throw ValidationException::withMessages([
                'invitation' => __('An email address is required to send an invitation.'),
            ]);
        }

        if ($participant->hasJoined()) {
            throw ValidationException::withMessages([
                'invitation' => __('This participant has already joined the event.'),
            ]);
        }
    }
}
