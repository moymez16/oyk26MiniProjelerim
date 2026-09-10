---
paths:
    - 'app/Actions/**'
    - 'app/Actions/*Invitation*.php'
    - app/Actions/StorePublicImage.php
---

# Actions

## Creating an event also creates the owner participant

Never create an Event row directly for the product flow. Use the CreateEvent action so the owner gets a Participant with role=owner and status=active. Factories also attach that owner participant afterCreating so tests stay consistent.

## Invitations use DB tokens and matching email

Invitation links resolve participants by invitation_token in the database, not signed URLs, so revoke and resend can invalidate the old token. Accepting requires the signed-in user's email to match the participant email when one is set. Tokens expire 14 days after invited_at. Consent must be recorded before a non-owner can view the event.

## Images go on the public disk with random names

Store cover, profile, and later impression/memory images with StorePublicImage on the public disk. Do not add an image package or a gated download controller. Validate jpg/png/webp up to 4MB. Delete the previous file when replacing or removing.
