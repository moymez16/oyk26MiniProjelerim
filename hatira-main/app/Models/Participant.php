<?php

namespace App\Models;

use App\Enums\ParticipantRole;
use App\Enums\ParticipantStatus;
use Carbon\CarbonInterface;
use Database\Factories\ParticipantFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $ulid
 * @property int $event_id
 * @property int|null $user_id
 * @property string $name
 * @property string|null $email
 * @property ParticipantRole $role
 * @property ParticipantStatus $status
 * @property string|null $photo_path
 * @property string|null $bio
 * @property array<int, array<string, string>>|null $links
 * @property string|null $invitation_token
 * @property CarbonInterface|null $invited_at
 * @property CarbonInterface|null $invitation_seen_at
 * @property CarbonInterface|null $joined_at
 * @property CarbonInterface|null $left_at
 * @property CarbonInterface|null $consent_accepted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Event $event
 * @property-read User|null $user
 */
#[Fillable([
    'event_id',
    'user_id',
    'name',
    'email',
    'role',
    'status',
    'photo_path',
    'bio',
    'links',
    'joined_at',
    'consent_accepted_at',
])]
class Participant extends Model
{
    /** @use HasFactory<ParticipantFactory> */
    use HasFactory, HasUlids;

    /**
     * @var list<string>
     */
    protected $hidden = [
        'invitation_token',
    ];

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
            'role' => ParticipantRole::class,
            'status' => ParticipantStatus::class,
            'links' => 'array',
            'invited_at' => 'datetime',
            'invitation_seen_at' => 'datetime',
            'joined_at' => 'datetime',
            'left_at' => 'datetime',
            'consent_accepted_at' => 'datetime',
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
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isOwner(): bool
    {
        return $this->role === ParticipantRole::Owner;
    }

    public function hasJoined(): bool
    {
        return in_array($this->status, [
            ParticipantStatus::InvitationAccepted,
            ParticipantStatus::Active,
        ], true) || $this->user_id !== null;
    }

    public function invitationExpiresAt(): ?CarbonInterface
    {
        return $this->invited_at?->addDays(14);
    }

    public function invitationHasExpired(): bool
    {
        $expiresAt = $this->invitationExpiresAt();

        return $expiresAt !== null && $expiresAt->isPast();
    }

    public function isAcceptable(): bool
    {
        if ($this->invitation_token === null || $this->invitationHasExpired()) {
            return false;
        }

        return in_array($this->status, [
            ParticipantStatus::Invited,
            ParticipantStatus::InvitationSeen,
        ], true);
    }

    public function canBeRevoked(): bool
    {
        return in_array($this->status, [
            ParticipantStatus::Invited,
            ParticipantStatus::InvitationSeen,
        ], true);
    }

    public function canBeInvited(): bool
    {
        if ($this->isOwner() || $this->email === null || $this->hasJoined()) {
            return false;
        }

        return in_array($this->status, [
            ParticipantStatus::NotInvited,
            ParticipantStatus::Invited,
            ParticipantStatus::InvitationSeen,
            ParticipantStatus::InvitationRevoked,
        ], true);
    }

    public function hasMismatchedEmailFor(User $user): bool
    {
        if ($this->email === null) {
            return false;
        }

        return mb_strtolower($this->email) !== mb_strtolower($user->email);
    }

    public function hasAcceptedConsent(): bool
    {
        return $this->consent_accepted_at !== null;
    }

    public function hasLeft(): bool
    {
        return $this->status === ParticipantStatus::Left || $this->left_at !== null;
    }

    public function markAsLeft(): void
    {
        $this->status = ParticipantStatus::Left;
        $this->left_at = now();
        $this->save();
    }
}
