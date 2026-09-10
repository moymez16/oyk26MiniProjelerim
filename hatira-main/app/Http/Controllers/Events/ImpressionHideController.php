<?php

namespace App\Http\Controllers\Events;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Impression;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ImpressionHideController extends Controller
{
    public function store(Request $request, Event $event, Impression $impression): RedirectResponse
    {
        Gate::authorize('hide', $impression);

        $viewer = $event->participantFor($request->user());
        abort_unless($viewer instanceof Participant, 403);

        $impression->update([
            'hidden_at' => now(),
            'hidden_by_participant_id' => $viewer->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('This impression is now hidden from your profile.')]);

        return back();
    }
}
