<?php

namespace App\Enums;

enum ReportStatus: string
{
    case Open = 'open';
    case Hidden = 'hidden';
    case Removed = 'removed';
    case Dismissed = 'dismissed';
}
