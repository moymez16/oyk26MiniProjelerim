---
paths:
    - 'docs/plan/**'
---

# Plan

## One branch per phase, then merge to main

Each roadmap phase is implemented on its own branch from main (phase-NN-slug, e.g. phase-02-invitations). When the phase looks done, run composer ci:check plus a Bugbot review loop until both are clean. Only then merge that branch into main. Do not start the next phase until the user says so.
