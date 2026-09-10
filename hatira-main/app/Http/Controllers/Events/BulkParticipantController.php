<?php

namespace App\Http\Controllers\Events;

use App\Enums\ParticipantRole;
use App\Enums\ParticipantStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Events\StoreBulkParticipantsRequest;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BulkParticipantController extends Controller
{
    public function store(StoreBulkParticipantsRequest $request, Event $event): RedirectResponse
    {
        $participants = $request->validated('participants');

        DB::transaction(function () use ($event, $participants): void {
            foreach ($participants as $participant) {
                $event->participants()->create([
                    'name' => $participant['name'],
                    'email' => $participant['email'] ?? null,
                    'role' => ParticipantRole::Participant,
                    'status' => ParticipantStatus::NotInvited,
                ]);
            }
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => trans_choice(':count participant added.|:count participants added.', count($participants)),
        ]);

        return to_route('events.participants.index', $event);
    }
}
