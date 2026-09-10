<?php

namespace App\Enums;

enum ImpressionRevealMode: string
{
    case Immediate = 'immediate';
    case AtEventEnd = 'at_event_end';
}
