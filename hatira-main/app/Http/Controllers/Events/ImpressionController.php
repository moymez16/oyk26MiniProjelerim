<?php

namespace App\Http\Controllers\Events;

use App\Actions\StorePublicImage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Events\StoreImpressionRequest;
use App\Http\Requests\Events\UpdateImpressionRequest;
use App\Models\Event;
use App\Models\Impression;
use App\Models\Participant;
use App\Notifications\ImpressionReceivedNotification;
use App\Support\ImpressionPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ImpressionController extends Controller
{
    public function index(Request $request, Event $event, ImpressionPresenter $presenter): Response
    {
        Gate::authorize('view', $event);

        $viewer = $event->participantFor($request->user());
        abort_unless($viewer instanceof Participant, 403);

        $impressions = Impression::query()
            ->where('event_id', $event->id)
            ->where('author_participant_id', $viewer->id)
            ->with(['author', 'subject', 'event', 'attachments'])
            ->orderBy('subject_participant_id')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();

        return Inertia::render('events/impressions/index', [
            'event' => [
                'ulid' => $event->ulid,
                'name' => $event->name,
            ],
            'impressions' => $presenter->manyForViewer($impressions, $viewer),
        ]);
    }

    public function store(
        StoreImpressionRequest $request,
        Event $event,
        Participant $participant,
        StorePublicImage $storeImage,
    ): RedirectResponse {
        $author = $event->participantFor($request->user());
        abort_unless($author instanceof Participant, 403);

        if ($author->is($participant)) {
            throw ValidationException::withMessages([
                'body' => __('You cannot write an impression about yourself.'),
            ]);
        }

        $impression = DB::transaction(function () use ($request, $event, $author, $participant, $storeImage): Impression {
            $impression = Impression::query()->create([
                'event_id' => $event->id,
                'author_participant_id' => $author->id,
                'subject_participant_id' => $participant->id,
                'body' => $request->validated('body'),
                'shows_author_name' => $request->boolean('shows_author_name'),
            ]);

            $this->storeImages($impression, $request->file('images', []), $storeImage, $author);

            return $impression;
        });

        $subjectUser = $participant->user;

        if ($subjectUser !== null && $subjectUser->wantsNotification('new_impression')) {
            $subjectUser->notify(new ImpressionReceivedNotification($impression));
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Impression added.')]);

        return to_route('events.participants.show', [$event, $participant]);
    }

    public function update(UpdateImpressionRequest $request, Event $event, Impression $impression): RedirectResponse
    {
        $impression->update([
            'body' => $request->validated('body'),
            'shows_author_name' => $request->boolean('shows_author_name'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Impression updated.')]);

        return back();
    }

    public function destroy(Request $request, Event $event, Impression $impression): RedirectResponse
    {
        Gate::authorize('delete', $impression);

        $impression->attachments->each->delete();
        $impression->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Impression removed.')]);

        return back();
    }

    /**
     * @param  array<int, UploadedFile|null>|UploadedFile|null  $images
     */
    private function storeImages(
        Impression $impression,
        mixed $images,
        StorePublicImage $storeImage,
        Participant $author,
    ): void {
        if (! is_array($images)) {
            return;
        }

        $position = 0;

        foreach ($images as $image) {
            if (! $image instanceof UploadedFile) {
                continue;
            }

            $path = $storeImage->handle($image, 'impressions');

            $impression->attachments()->create([
                'disk' => 'public',
                'path' => $path,
                'original_name' => $image->getClientOriginalName(),
                'mime_type' => (string) $image->getMimeType(),
                'size' => $image->getSize(),
                'position' => $position,
                'uploaded_by_participant_id' => $author->id,
            ]);

            $position++;
        }
    }
}
