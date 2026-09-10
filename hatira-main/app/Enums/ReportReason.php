<?php

namespace App\Enums;

enum ReportReason: string
{
    case Inappropriate = 'inappropriate';
    case Harassment = 'harassment';
    case Spam = 'spam';
    case Other = 'other';
}
