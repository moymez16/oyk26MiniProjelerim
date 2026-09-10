---
paths:
    - 'app/Models/{Event,Participant}.php'
---

# Models

## Event and Participant route keys are ULID

These models keep an incrementing id primary key and a unique ulid column. HasUlids uniqueIds() is ['ulid'] and getRouteKeyName() returns ulid. Do not expose sequential ids in URLs.
