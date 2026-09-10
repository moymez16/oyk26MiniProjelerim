<?php

namespace App\Enums;

enum ParticipantStatus: string
{
    case NotInvited = 'not_invited';
    case Invited = 'invited';
    case InvitationSeen = 'invitation_seen';
    case InvitationAccepted = 'invitation_accepted';
    case Active = 'active';
    case Left = 'left';
    case InvitationRevoked = 'invitation_revoked';
}
