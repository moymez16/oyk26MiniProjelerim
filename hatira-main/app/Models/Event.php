<?php

namespace App\Models;

use App\Concerns\HasAttachments;
use App\Enums\EventStatus;
use App\Enums\ImpressionRevealMode;
use Database\Factories\EventFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $ulid
 * @property int $owner_id
 * @property string $name
 * @property string $description
 * @property string|null $long_description
 * @property string|null $location
 * @property string|null $cover_image_path
 * @property Carbon $starts_on
 * @property Carbon|null $ends_on
 * @property EventStatus $status
 * @property ImpressionRevealMode $impression_reveal_mode
 * @property Carbon|null $reveal_at
 * @property bool $allows_content_after_close
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read User $owner
 * @property-read int $participants_count
 * @property-read Collection<int, Participant> $participants
 * @property-read Collection<int, Impression> $impressions
 * @property-read Collection<int, Memory> $memories
 * @property-read Collection<int, Report> $reports
 */
#[Fillable([
    'owner_id',
    'name',
    'description',
    'long_description',
    'location',
    'starts_on',
    'ends_on',
    'cover_image_path',
])]
class Event extends Model
{
    /** @use HasFactory<EventFactory> */
    use HasAttachments, HasFactory, HasUlids, SoftDeletes;

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
            'starts_on' => 'date',
            'ends_on' => 'date',
            'status' => EventStatus::class,
            'impression_reveal_mode' => ImpressionRevealMode::class,
            'reveal_at' => 'datetime',
            'allows_content_after_close' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * @return HasMany<Participant, $this>
     */
    public function participants(): HasMany
    {
        return $this->hasMany(Participant::class);
    }

    /**
     * @return HasMany<Impression, $this>
     */
    public function impressions(): HasMany
    {
        return $this->hasMany(Impression::class);
    }

    /**
     * @return HasMany<Memory, $this>
     */
    public function memories(): HasMany
    {
        return $this->hasMany(Memory::class);
    }

    /**
     * @return HasMany<Report, $this>
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function participantFor(User $user): ?Participant
    {
        if ($this->relationLoaded('participants')) {
            return $this->participants->firstWhere('user_id', $user->id);
        }

        return $this->participants()->where('user_id', $user->id)->first();
    }

    public function isOwnedBy(User $user): bool
    {
        return $this->owner_id === $user->id;
    }

    public function acceptsNewContent(): bool
    {
        return match ($this->status) {
            EventStatus::Archived => false,
            EventStatus::Completed => $this->allows_content_after_close,
            default => true,
        };
    }

    /**
     * @return list<EventStatus>
     */
    public function allowedStatusTransitions(): array
    {
        return match ($this->status) {
            EventStatus::Draft => [EventStatus::Active],
            EventStatus::Active => [EventStatus::Completed],
            EventStatus::Completed => [EventStatus::Archived, EventStatus::Active],
            EventStatus::Archived => [],
        };
    }
}
