<?php

namespace App\Policies;

use App\Models\Participant;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ParticipantPolicy
{
    public function update(User $user, Participant $participant): Response
    {
        $event = $participant->event;
        $viewer = $event->participantFor($user);

        if ($viewer === null) {
            return Response::denyAsNotFound();
        }

        return $viewer->is($participant)
            ? Response::allow()
            : Response::deny();
    }

    public function delete(User $user, Participant $participant): Response
    {
        $event = $participant->event;

        if ($event->participantFor($user) === null) {
            return Response::denyAsNotFound();
        }

        if (! $event->isOwnedBy($user)) {
            return Response::deny();
        }

        if ($participant->isOwner()) {
            return Response::deny(__('You cannot remove the event owner from the list.'));
        }

        return Response::allow();
    }
}
