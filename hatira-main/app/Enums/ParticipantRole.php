<?php

namespace App\Enums;

enum ParticipantRole: string
{
    case Owner = 'owner';
    case Moderator = 'moderator';
    case Participant = 'participant';
}
