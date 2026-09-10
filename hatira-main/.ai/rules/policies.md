---
paths:
    - 'app/Policies/**'
---

# Policies

## Event access uses policies and 404 for strangers

Authorize event-scoped actions through EventPolicy / ParticipantPolicy and Gate::authorize(), not a dedicated membership middleware. Users who are not participants of an event must be denyAsNotFound() (HTTP 404) so the event's existence is not leaked. Participants who lack a privilege (for example updating an event they do not own) get a normal 403.
