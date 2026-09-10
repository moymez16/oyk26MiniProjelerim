<?php

namespace App\Models;

use App\Concerns\HasAttachments;
use App\Concerns\Reportable;
use Carbon\CarbonInterface;
use Database\Factories\MemoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $ulid
 * @property int $event_id
 * @property int $participant_id
 * @property string $body
 * @property CarbonInterface|null $occurred_on
 * @property CarbonInterface|null $hidden_at
 * @property int|null $hidden_by_participant_id
 * @property CarbonInterface|null $created_at
 * @property-read Event $event
 * @property-read Participant $participant
 */
#[Fillable([
    'event_id',
    'participant_id',
    'body',
    'occurred_on',
    'hidden_at',
    'hidden_by_participant_id',
])]
class Memory extends Model
{
    /** @use HasFactory<MemoryFactory> */
    use HasAttachments, HasFactory, HasUlids, Reportable;

    public const EDIT_WINDOW_MINUTES = 15;

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
            'occurred_on' => 'date',
            'hidden_at' => 'datetime',
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
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    /**
     * @param  Builder<Memory>  $query
     */
    #[Scope]
    protected function visible(Builder $query): void
    {
        $query->whereNull('hidden_at');
    }

    public function isWithinEditWindow(): bool
    {
        if ($this->created_at === null) {
            return false;
        }

        return $this->created_at->addMinutes(self::EDIT_WINDOW_MINUTES)->isFuture();
    }

    public function displayDate(): CarbonInterface
    {
        return $this->occurred_on ?? $this->created_at ?? now();
    }
}
