# Docs: the system of record

This repo is run agent-first (in the spirit of OpenAI's [harness engineering](https://openai.com/index/harness-engineering/)
post): humans steer, agents execute. For that to work, everything an agent needs
in order to act well must live in versioned, repo-local documents, not in chat
threads or in someone's head. This directory is that system of record.

[`AGENTS.md`](../AGENTS.md) at the repo root is the entry point: a short map
with pointers, not an encyclopedia. The depth lives here.

## The documents

| Doc | What it answers |
|---|---|
| [PRODUCT-PLAN.md](PRODUCT-PLAN.md) | What we are building, for whom, how it makes money, launch phases, metrics |
| [CORE-LOOP.md](CORE-LOOP.md) | How the engagement loop works: XP economy, streaks, quests, chests, and the design intent behind them |
| [BACKLOG.md](BACKLOG.md) | What to build next, ordered by value (Now / Next / Later / Shipped) |
| [CURRICULUM.md](CURRICULUM.md) | Content roadmap: A1 to C2 units with can-do statements and shipped status |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System map: layers, dependency direction, routes, data model, integrations |
| [GOLDEN-RULES.md](GOLDEN-RULES.md) | Hard constraints every change must respect |
| [exec-plans/](exec-plans/) | Multi-session work decomposed into agent-sized steps |

## Rules for these docs

- **Docs change with the code.** If a change alters behavior these docs describe
  (mechanics, architecture, product scope), update the doc in the same commit.
  A doc that contradicts the code is a bug in one of them.
- **One source of truth per fact.** Don't restate mechanics in multiple docs;
  link instead. `AGENTS.md` stays a map (roughly 100 lines).
- **Decisions land here, not in chat.** A choice worth remembering (why Lemon
  Squeezy, why the streak needs only one lesson) gets written into the relevant
  doc with its reasoning.
- **Backlog hygiene.** [BACKLOG.md](BACKLOG.md) is the single backlog. Findings
  from audits or agent sessions get appended there as specific, actionable
  items, not left in chat.
