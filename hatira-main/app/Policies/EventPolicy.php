<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class EventPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Event $event): Response
    {
        $participant = $event->participantFor($user);

        if ($participant === null || $participant->hasLeft()) {
            return Response::denyAsNotFound();
        }

        if (! $participant->hasAcceptedConsent() && ! $participant->isOwner()) {
            return Response::deny();
        }

        return Response::allow();
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Event $event): Response
    {
        return $this->ownerResponse($user, $event);
    }

    public function delete(User $user, Event $event): Response
    {
        return $this->ownerResponse($user, $event);
    }

    public function manageParticipants(User $user, Event $event): Response
    {
        return $this->ownerResponse($user, $event);
    }

    public function moderate(User $user, Event $event): Response
    {
        return $this->ownerResponse($user, $event);
    }

    public function writeContent(User $user, Event $event): Response
    {
        $participant = $event->participantFor($user);

        if ($participant === null || $participant->hasLeft()) {
            return Response::denyAsNotFound();
        }

        return $event->acceptsNewContent()
            ? Response::allow()
            : Response::deny(__('This event is no longer accepting new content.'));
    }

    private function ownerResponse(User $user, Event $event): Response
    {
        if ($event->participantFor($user) === null) {
            return Response::denyAsNotFound();
        }

        return $event->isOwnedBy($user)
            ? Response::allow()
            : Response::deny();
    }
}
