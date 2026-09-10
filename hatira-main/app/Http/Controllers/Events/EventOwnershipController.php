<?php

namespace App\Http\Controllers\Events;

use App\Enums\ParticipantRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Events\TransferEventOwnershipRequest;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class EventOwnershipController extends Controller
{
    public function update(TransferEventOwnershipRequest $request, Event $event): RedirectResponse
    {
        Gate::authorize('update', $event);

        $successor = $event->participants()
            ->where('ulid', $request->validated('participant_ulid'))
            ->first();

        if ($successor === null || $successor->user_id === null || $successor->hasLeft()) {
            throw ValidationException::withMessages([
                'participant_ulid' => __('Ownership can only be transferred to an active participant.'),
            ]);
        }

        if ($successor->isOwner()) {
            throw ValidationException::withMessages([
                'participant_ulid' => __('This participant already owns the event.'),
            ]);
        }

        DB::transaction(function () use ($event, $successor): void {
            $currentOwner = $event->participants()->where('role', ParticipantRole::Owner)->first();

            if ($currentOwner instanceof Participant) {
                $currentOwner->role = ParticipantRole::Participant;
                $currentOwner->save();
            }

            $successor->role = ParticipantRole::Owner;
            $successor->save();

            $event->owner_id = $successor->user_id;
            $event->save();
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event ownership transferred.')]);

        return to_route('events.show', $event);
    }
}
