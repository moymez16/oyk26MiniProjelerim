<?php

namespace App\Models;

use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use Carbon\CarbonInterface;
use Database\Factories\ReportFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property int $id
 * @property string $ulid
 * @property int $event_id
 * @property string $reportable_type
 * @property int $reportable_id
 * @property int $reporter_participant_id
 * @property ReportReason $reason
 * @property string|null $note
 * @property ReportStatus $status
 * @property int|null $resolved_by_participant_id
 * @property CarbonInterface|null $resolved_at
 * @property-read Event $event
 * @property-read Participant $reporter
 * @property-read Model $reportable
 */
#[Fillable([
    'event_id',
    'reporter_participant_id',
    'reason',
    'note',
    'status',
    'resolved_by_participant_id',
    'resolved_at',
])]
class Report extends Model
{
    /** @use HasFactory<ReportFactory> */
    use HasFactory, HasUlids;

    /**
     * @return array<int, string>
     */
    public function uniqueIds(): array
    {
        return ['ulid'];
    }

    public function getRouteKeyName(): string
    {
        return 'ulid';
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'reason' => ReportReason::class,
            'status' => ReportStatus::class,
            'resolved_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Event, $this>
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * @return BelongsTo<Participant, $this>
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(Participant::class, 'reporter_participant_id');
    }

    /**
     * @return MorphTo<Model, $this>
     */
    public function reportable(): MorphTo
    {
        return $this->morphTo();
    }
}
