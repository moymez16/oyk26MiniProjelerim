<?php

namespace App\Models;

use App\Concerns\HasAttachments;
use App\Concerns\Reportable;
use Carbon\CarbonInterface;
use Database\Factories\ImpressionFactory;
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
 * @property int $author_participant_id
 * @property int $subject_participant_id
 * @property string $body
 * @property bool $shows_author_name
 * @property CarbonInterface|null $visible_from
 * @property CarbonInterface|null $hidden_at
 * @property int|null $hidden_by_participant_id
 * @property CarbonInterface|null $created_at
 * @property-read Event $event
 * @property-read Participant $author
 * @property-read Participant $subject
 */
#[Fillable([
    'event_id',
    'author_participant_id',
    'subject_participant_id',
    'body',
    'shows_author_name',
    'visible_from',
    'hidden_at',
    'hidden_by_participant_id',
])]
class Impression extends Model
{
    /** @use HasFactory<ImpressionFactory> */
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
            'shows_author_name' => 'boolean',
            'visible_from' => 'datetime',
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
    public function author(): BelongsTo
    {
        return $this->belongsTo(Participant::class, 'author_participant_id');
    }

    /**
     * @return BelongsTo<Participant, $this>
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Participant::class, 'subject_participant_id');
    }

    /**
     * @param  Builder<Impression>  $query
     */
    #[Scope]
    protected function visible(Builder $query): void
    {
        $query->whereNull('hidden_at')
            ->where(function (Builder $visible): void {
                $visible->whereNull('visible_from')
                    ->orWhere('visible_from', '<=', now());
            });
    }

    public function isWithinEditWindow(): bool
    {
        if ($this->created_at === null) {
            return false;
        }

        return $this->created_at->addMinutes(self::EDIT_WINDOW_MINUTES)->isFuture();
    }
}
