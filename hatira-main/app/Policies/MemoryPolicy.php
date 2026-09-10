<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\Memory;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MemoryPolicy
{
    public function view(User $user, Memory $memory): Response
    {
        $viewer = $memory->event->participantFor($user);

        return $viewer !== null && ! $viewer->hasLeft()
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    public function create(User $user, Event $event): Response
    {
        return app(EventPolicy::class)->writeContent($user, $event);
    }

    public function update(User $user, Memory $memory): Response
    {
        $viewer = $memory->event->participantFor($user);

        if ($viewer === null || $viewer->hasLeft()) {
            return Response::denyAsNotFound();
        }

        if ($memory->participant_id !== $viewer->id) {
            return Response::deny();
        }

        return $memory->isWithinEditWindow()
            ? Response::allow()
            : Response::deny(__('The edit window for this memory has closed.'));
    }

    public function delete(User $user, Memory $memory): Response
    {
        $viewer = $memory->event->participantFor($user);

        if ($viewer === null || $viewer->hasLeft()) {
            return Response::denyAsNotFound();
        }

        return $memory->participant_id === $viewer->id
            ? Response::allow()
            : Response::deny();
    }
}
