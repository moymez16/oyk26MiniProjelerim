<?php

namespace App\Http\Controllers\Events;

use App\Actions\StorePublicImage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Events\UpdateEventCoverRequest;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class EventCoverController extends Controller
{
    public function update(UpdateEventCoverRequest $request, Event $event, StorePublicImage $storeImage): RedirectResponse
    {
        $cover = $request->file('cover');
        abort_unless($cover instanceof UploadedFile, 422);

        $event->cover_image_path = $storeImage->handle(
            $cover,
            'covers',
            $event->cover_image_path,
        );
        $event->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Cover image updated.')]);

        return to_route('events.edit', $event);
    }

    public function destroy(Request $request, Event $event, StorePublicImage $storeImage): RedirectResponse
    {
        Gate::authorize('update', $event);

        $storeImage->delete($event->cover_image_path);
        $event->cover_image_path = null;
        $event->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Cover image removed.')]);

        return to_route('events.edit', $event);
    }
}
