<?php

namespace App\Http\Controllers\Events;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class EventLeaveController extends Controller
{
    public function destroy(Request $request, Event $event): RedirectResponse
    {
        Gate::authorize('view', $event);

        $participant = $event->participantFor($request->user());
        abort_unless($participant instanceof Participant, 403);

        if ($participant->isOwner()) {
            throw ValidationException::withMessages([
                'event' => __('Transfer ownership before leaving the event.'),
            ]);
        }

        $participant->markAsLeft();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('You left the event. Your content stays in the yearbook.')]);

        return to_route('events.index');
    }

    public function store(Request $request, Event $event, Participant $participant): RedirectResponse
    {
        Gate::authorize('manageParticipants', $event);

        if ($participant->isOwner()) {
            throw ValidationException::withMessages([
                'participant' => __('You cannot end the owner\'s access.'),
            ]);
        }

        $participant->markAsLeft();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Participant access ended. Their content remains.')]);

        return back();
    }
}
