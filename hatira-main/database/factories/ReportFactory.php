<?php

namespace Database\Factories;

use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use App\Models\Event;
use App\Models\Impression;
use App\Models\Participant;
use App\Models\Report;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $event = Event::factory();

        return [
            'event_id' => $event,
            'reportable_type' => Impression::class,
            'reportable_id' => Impression::factory()->for($event),
            'reporter_participant_id' => Participant::factory()->for($event),
            'reason' => ReportReason::Inappropriate,
            'note' => null,
            'status' => ReportStatus::Open,
        ];
    }
}
