<?php

namespace App\Mail;

use App\Models\Participant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ParticipantInvitationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Participant $participant) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('You are invited to :event', [
                'event' => $this->participant->event->name,
            ]),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.participant-invitation',
            with: [
                'eventName' => $this->participant->event->name,
                'inviteeName' => $this->participant->name,
                'inviterName' => $this->participant->event->owner->name,
                'invitationUrl' => route('invitations.show', $this->participant->invitation_token),
            ],
        );
    }
}
