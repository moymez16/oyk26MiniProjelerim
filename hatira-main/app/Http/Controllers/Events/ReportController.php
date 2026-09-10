<?php

namespace App\Http\Controllers\Events;

use App\Http\Controllers\Controller;
use App\Http\Requests\Events\StoreReportRequest;
use App\Models\Event;
use App\Models\Impression;
use App\Models\Memory;
use App\Models\Participant;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function storeImpression(StoreReportRequest $request, Event $event, Impression $impression): RedirectResponse
    {
        return $this->storeReport($request, $event, $impression);
    }

    public function storeMemory(StoreReportRequest $request, Event $event, Memory $memory): RedirectResponse
    {
        return $this->storeReport($request, $event, $memory);
    }

    private function storeReport(StoreReportRequest $request, Event $event, Impression|Memory $reportable): RedirectResponse
    {
        Gate::authorize('view', $event);

        $reporter = $event->participantFor($request->user());
        abort_unless($reporter instanceof Participant && ! $reporter->hasLeft(), 403);

        $alreadyReported = Report::query()
            ->where('event_id', $event->id)
            ->where('reportable_type', $reportable::class)
            ->where('reportable_id', $reportable->getKey())
            ->where('reporter_participant_id', $reporter->id)
            ->exists();

        if ($alreadyReported) {
            throw ValidationException::withMessages([
                'reason' => __('You have already reported this content.'),
            ]);
        }

        $reportable->reports()->create([
            'event_id' => $event->id,
            'reporter_participant_id' => $reporter->id,
            'reason' => $request->validated('reason'),
            'note' => $request->validated('note'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Content reported.')]);

        return back();
    }
}
