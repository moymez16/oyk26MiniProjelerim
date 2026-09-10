---
paths:
    - app/Support/ImpressionPresenter.php
---

# Support

## Unnamed impressions never serialize the author

Never pass an Impression model to Inertia. Always serialize through ImpressionPresenter. If shows_author_name is false and the viewer is not the author, omit author_name, author_ulid, author_photo_url, and shows_author_name. The UI word is isimsiz, never anonim. The 15-minute edit window lives on Impression::EDIT_WINDOW_MINUTES (D-014).

## Yearbooks never reveal unnamed authors

Event and personal yearbooks serialize impressions with ImpressionPresenter::forYearbook() / manyForYearbook(), not forViewer(). Unnamed impressions omit author_name even when the viewer is the author, because the payload is shared and printable. Include left participants who have joined_at so their pages stay in the yearbook (D-017 / PRD 47).
