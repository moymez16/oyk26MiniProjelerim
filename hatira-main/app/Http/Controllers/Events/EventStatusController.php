<?php

namespace App\Http\Controllers\Events;

use App\Enums\EventStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Events\UpdateEventStatusRequest;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class EventStatusController extends Controller
{
    public function update(UpdateEventStatusRequest $request, Event $event): RedirectResponse
    {
        Gate::authorize('update', $event);

        $status = $request->enum('status', EventStatus::class);

        if ($status !== $event->status && ! in_array($status, $event->allowedStatusTransitions(), true)) {
            throw ValidationException::withMessages([
                'status' => __('This status change is not allowed.'),
            ]);
        }

        $event->status = $status;

        if ($request->exists('allows_content_after_close')) {
            $event->allows_content_after_close = $request->boolean('allows_content_after_close');
        }

        $event->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event status updated.')]);

        return back();
    }
}
