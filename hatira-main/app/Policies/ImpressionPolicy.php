<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\Impression;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ImpressionPolicy
{
    public function view(User $user, Impression $impression): Response
    {
        $event = $impression->event;
        $viewer = $event->participantFor($user);

        if ($viewer === null || $viewer->hasLeft()) {
            return Response::denyAsNotFound();
        }

        if ($impression->author_participant_id === $viewer->id) {
            return Response::allow();
        }

        return $impression->hidden_at === null
            && ($impression->visible_from === null || $impression->visible_from->lte(now()))
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    public function create(User $user, Event $event): Response
    {
        return app(EventPolicy::class)->writeContent($user, $event);
    }

    public function hide(User $user, Impression $impression): Response
    {
        $viewer = $impression->event->participantFor($user);

        if ($viewer === null || $viewer->hasLeft()) {
            return Response::denyAsNotFound();
        }

        return $impression->subject_participant_id === $viewer->id
            ? Response::allow()
            : Response::deny();
    }

    public function update(User $user, Impression $impression): Response
    {
        $viewer = $impression->event->participantFor($user);

        if ($viewer === null || $viewer->hasLeft()) {
            return Response::denyAsNotFound();
        }

        if ($impression->author_participant_id !== $viewer->id) {
            return Response::deny();
        }

        return $impression->isWithinEditWindow()
            ? Response::allow()
            : Response::deny(__('The edit window for this impression has closed.'));
    }

    public function delete(User $user, Impression $impression): Response
    {
        $viewer = $impression->event->participantFor($user);

        if ($viewer === null || $viewer->hasLeft()) {
            return Response::denyAsNotFound();
        }

        return $impression->author_participant_id === $viewer->id
            ? Response::allow()
            : Response::deny();
    }
}
