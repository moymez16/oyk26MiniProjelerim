<?php

namespace App\Http\Controllers\Events;

use App\Actions\StorePublicImage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Events\UpdateProfileRequest;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request, Event $event, StorePublicImage $storeImage): Response
    {
        Gate::authorize('view', $event);

        $participant = $event->participantFor($request->user());
        abort_unless($participant instanceof Participant, 403);
        Gate::authorize('update', $participant);

        return Inertia::render('events/profile', [
            'event' => [
                'ulid' => $event->ulid,
                'name' => $event->name,
            ],
            'profile' => [
                'name' => $participant->name,
                'bio' => $participant->bio,
                'links' => $participant->links ?? [],
                'photo_url' => $storeImage->url($participant->photo_path),
            ],
        ]);
    }

    public function update(
        UpdateProfileRequest $request,
        Event $event,
        StorePublicImage $storeImage,
    ): RedirectResponse {
        $participant = $event->participantFor($request->user());
        abort_unless($participant instanceof Participant, 403);

        if ($request->boolean('remove_photo')) {
            $storeImage->delete($participant->photo_path);
            $participant->photo_path = null;
        } elseif ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            abort_unless($photo instanceof UploadedFile, 422);

            $participant->photo_path = $storeImage->handle(
                $photo,
                'profiles',
                $participant->photo_path,
            );
        }

        $participant->bio = $request->validated('bio');
        $participant->links = $this->normalizedLinks($request->validated('links'));
        $participant->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event profile updated.')]);

        return to_route('events.participants.show', [$event, $participant]);
    }

    /**
     * @param  array<int, array{label?: string, url?: string}>|null  $links
     * @return list<array{label: string, url: string}>|null
     */
    private function normalizedLinks(?array $links): ?array
    {
        if ($links === null) {
            return null;
        }

        $normalized = [];

        foreach ($links as $link) {
            $label = trim((string) ($link['label'] ?? ''));
            $url = trim((string) ($link['url'] ?? ''));

            if ($label === '' || $url === '') {
                continue;
            }

            $normalized[] = [
                'label' => $label,
                'url' => $url,
            ];
        }

        return $normalized === [] ? null : $normalized;
    }
}
