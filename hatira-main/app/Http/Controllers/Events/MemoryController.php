<?php

namespace App\Http\Controllers\Events;

use App\Actions\NotifyEventParticipants;
use App\Actions\StorePublicImage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Events\StoreMemoryRequest;
use App\Http\Requests\Events\UpdateMemoryRequest;
use App\Models\Event;
use App\Models\Memory;
use App\Models\Participant;
use App\Notifications\MemorySharedNotification;
use App\Support\MemoryPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MemoryController extends Controller
{
    public function index(Request $request, Event $event, MemoryPresenter $presenter): Response
    {
        Gate::authorize('view', $event);

        $viewer = $event->participantFor($request->user());
        abort_unless($viewer instanceof Participant, 403);

        $memories = Memory::query()
            ->visible()
            ->where('event_id', $event->id)
            ->with(['participant', 'event', 'attachments'])
            ->orderByRaw('coalesce(occurred_on, date(created_at)) desc')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('events/memories/index', [
            'event' => [
                'ulid' => $event->ulid,
                'name' => $event->name,
                'starts_on' => $event->starts_on->toDateString(),
                'ends_on' => $event->ends_on?->toDateString(),
            ],
            'memories' => $presenter->manyForViewer($memories, $viewer),
        ]);
    }

    public function store(
        StoreMemoryRequest $request,
        Event $event,
        StorePublicImage $storeImage,
        NotifyEventParticipants $notifyParticipants,
    ): RedirectResponse {
        $author = $event->participantFor($request->user());
        abort_unless($author instanceof Participant, 403);

        $memory = DB::transaction(function () use ($request, $event, $author, $storeImage): Memory {
            $memory = Memory::query()->create([
                'event_id' => $event->id,
                'participant_id' => $author->id,
                'body' => $request->validated('body'),
                'occurred_on' => $request->validated('occurred_on'),
            ]);

            $this->storeImages($memory, $request->file('images', []), $storeImage, $author);

            return $memory;
        });

        $notifyParticipants->handle(
            $event,
            new MemorySharedNotification($memory),
            'new_memory',
            [$request->user()->id],
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Memory added.')]);

        return to_route('events.memories.index', $event);
    }

    public function update(UpdateMemoryRequest $request, Event $event, Memory $memory): RedirectResponse
    {
        $memory->update([
            'body' => $request->validated('body'),
            'occurred_on' => $request->validated('occurred_on'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Memory updated.')]);

        return back();
    }

    public function destroy(Request $request, Event $event, Memory $memory): RedirectResponse
    {
        Gate::authorize('delete', $memory);

        $memory->attachments->each->delete();
        $memory->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Memory removed.')]);

        return back();
    }

    /**
     * @param  array<int, UploadedFile|null>|UploadedFile|null  $images
     */
    private function storeImages(
        Memory $memory,
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

            $path = $storeImage->handle($image, 'memories');

            $memory->attachments()->create([
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
