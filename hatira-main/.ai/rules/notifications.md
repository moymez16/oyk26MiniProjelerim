---
paths:
    - 'app/Notifications/**'
---

# Notifications

## Unnamed impression notifications omit the author

ImpressionReceivedNotification must never put author_name in toArray or toMail when shows_author_name is false. Feed headlines for unnamed impressions use Someone wrote about :subject and go through ImpressionPresenter.
