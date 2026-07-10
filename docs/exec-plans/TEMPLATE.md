# Exec plan: <name>

An exec plan decomposes a backlog item too big for one session into steps an
agent can complete and verify independently. Copy this file, fill it in, link
it from the backlog item, and keep the status log current: the plan is the
memory between sessions.

## Goal

One paragraph: what exists when this is done, and how we'll know it works.

## Context

- Backlog item: [BACKLOG.md](../BACKLOG.md#...)
- Relevant docs: which parts of [CORE-LOOP.md](../CORE-LOOP.md) /
  [ARCHITECTURE.md](../ARCHITECTURE.md) this touches
- Golden rules at risk: which of the [rules](../GOLDEN-RULES.md) this work
  brushes against (schema changes? i18n? XP economy?)

## Out of scope

What this plan deliberately does NOT do, so sessions don't wander.

## Steps

Each step: small enough for one session, independently verifiable, leaves the
app deployable (build + lint green).

1. ⬜ **<step>**: scope, files touched, how to verify
2. ⬜ ...

## Status log

Append one line per session: `YYYY-MM-DD | step | what happened | commit`.
