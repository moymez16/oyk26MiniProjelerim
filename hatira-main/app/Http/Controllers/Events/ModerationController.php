<?php

namespace App\Http\Controllers\Events;

use App\Enums\ReportStatus;
use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Impression;
use App\Models\Memory;
use App\Models\Participant;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ModerationController extends Controller
{
    public function index(Request $request, Event $event): Response
    {
        Gate::authorize('moderate', $event);

        $reports = Report::query()
            ->where('event_id', $event->id)
            ->with(['reporter', 'reportable'])
            ->latest('id')
            ->get()
            ->map(fn (Report $report): array => [
                'ulid' => $report->ulid,
                'reason' => $report->reason->value,
                'note' => $report->note,
                'status' => $report->status->value,
                'reporter_name' => $report->reporter->name,
                'body' => $this->reportableBody($report),
                'type' => class_basename($report->reportable_type),
            ]);

        return Inertia::render('events/moderation/index', [
            'event' => [
                'ulid' => $event->ulid,
                'name' => $event->name,
            ],
            'reports' => $reports,
        ]);
    }

    public function update(Request $request, Event $event, Report $report): RedirectResponse
    {
        Gate::authorize('moderate', $event);

        $moderator = $event->participantFor($request->user());
        abort_unless($moderator instanceof Participant, 403);

        $action = $request->validate([
            'action' => ['required', Rule::in(['hide', 'remove', 'dismiss'])],
        ])['action'];

        $reportable = $report->reportable;

        if ($action === 'hide' && $reportable instanceof Impression) {
            $reportable->update([
                'hidden_at' => now(),
                'hidden_by_participant_id' => $moderator->id,
            ]);
            $report->status = ReportStatus::Hidden;
        } elseif ($action === 'hide' && $reportable instanceof Memory) {
            $reportable->update([
                'hidden_at' => now(),
                'hidden_by_participant_id' => $moderator->id,
            ]);
            $report->status = ReportStatus::Hidden;
        } elseif ($action === 'remove' && ($reportable instanceof Impression || $reportable instanceof Memory)) {
            $reportable->attachments->each->delete();
            $reportable->delete();
            $report->status = ReportStatus::Removed;
        } else {
            $report->status = ReportStatus::Dismissed;
        }

        $report->resolved_by_participant_id = $moderator->id;
        $report->resolved_at = now();
        $report->save();

        if (in_array($action, ['hide', 'remove'], true)) {
            Report::query()
                ->where('event_id', $event->id)
                ->where('reportable_type', $report->reportable_type)
                ->where('reportable_id', $report->reportable_id)
                ->whereKeyNot($report->id)
                ->where('status', ReportStatus::Open)
                ->update([
                    'status' => $report->status,
                    'resolved_by_participant_id' => $moderator->id,
                    'resolved_at' => now(),
                ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Moderation decision saved.')]);

        return back();
    }

    private function reportableBody(Report $report): string
    {
        $reportable = $report->reportable;

        if ($reportable instanceof Impression || $reportable instanceof Memory) {
            return $reportable->body;
        }

        return '';
    }
}
