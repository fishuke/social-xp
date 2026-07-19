# Naming: replacing "Social XP"

Status: **decided** (2026-07-19). Winner: **Convozy** (`convozy.app`). The repo
rename pass (manifest, app strings, emails, `NEXT_PUBLIC_APP_URL` fallback,
README, docs) has landed; the Vercel project/domain, Resend identity, and Lemon
Squeezy store still inherit the name at infra time. The finalists below
(Enheart, Braveish, Small Dares) are kept for historical context.

"Social XP" is a working title: gamer jargon plus the word "social" reads
slightly diagnostic on a home screen. The rename must land **before** the
domain purchase ([BACKLOG.md](BACKLOG.md), "Domain + production launch"),
because the domain, Resend mail identity, Lemon Squeezy store, and store
listings all inherit the name; after those, a rebrand gets expensive.

## Criteria

1. **Glance test.** Users may feel tender about training social skills; the
   name on their phone must not out them (Headspace/Finch pass, "Social Skills
   Trainer" fails).
2. **Method-true.** The product is graded exposure: one small act of courage a
   day. Courage/warmth names fit; charisma/extrovert names alienate the
   proud-introvert half of the audience (they want ease, not a personality
   transplant).
3. **EN + TR.** Brand stays English (Duolingo/Headspace do the same in
   Turkey) but must be easy for a Turkish mouth. English-only wordplay does
   not travel.
4. **Ownable.** Unique in App Store search, trademark-light, domain at
   registrar price.

## Finalists

### Enheart (front-runner)
Archaic English verb: to give heart, to give courage (en + heart, like
enable/empower). "Courage" derives from Latin *cor*, heart, so the name IS the
method; the coach's encourage-first job is literally enhearting.
- Tagline: "Take heart, daily."
- TR phonetics: "enhart", effortless. Parses for anyone with A1 English.
- Diligence (2026-07-10): no consumer/wellness product named Enheart. Distant
  collisions: inHEART (French cardiac-imaging medtech, sounds identical
  spoken), enheart inc. (dormant, Taiwan), Enheart Publishing. An "Enhearten"
  web app exists (app.enhearten.com), so skip the long form as a brand.
- Risks: needs a one-beat parse; heard-not-read users may type "inheart"
  (mitigate: register `inheart.app` and redirect); mild cardiac/romance
  misread in store browsing.

### Braveish (runner-up)
Brave + ish: the user's exact self-image (not brave, brave-ish, working on
it). Disarms shame, instantly readable, funny.
- Tagline: "Braveish today, braver tomorrow."
- `braveish.app` available, `.com` taken.
- Decisive knock: the "-ish" joke is English-only humor; Turkish users just
  see a strange suffix. Half the market misses the point.

### Small Dares (runner-up)
Says the mechanic exactly (one small dare a day), warm, party-game-safe on a
home screen. Only candidate where `.com` AND `.app` were both free.
- Knock: "dare" keyword space is cluttered with truth-or-dare party apps, and
  a small competitor (DareDash, "daily social dares") exists in the niche.

## Verified-available shortlist (checked 2026-07-10 via RDAP)

Availability is perishable; **recheck immediately before registering.**

| Family | Name | Domain |
|---|---|---|
| Heart | Enheart | enheart.app (+ inheart.app, enhearten.app, takeheart.app all free) |
| Brave | Braveish | braveish.app |
| Brave | Tiny Brave | tinybrave.app (+ tinybraves.app) |
| Brave | Daily Brave | dailybrave.app |
| Brave | Braveday / Braveful / Bravly | braveday.app / braveful.app / bravly.app |
| Brave | Braverly | braverly.app (user liked it but hard to read: the -rl- cluster) |
| Brave | Outbrave | outbrave.app (.com taken) |
| Brave | Braveside | braveside.app |
| Dare | Small Dares | smalldares.com + smalldares.app + smalldare.app |
| Dare | Dareling / Daresome / Dare a Day | dareling.app / daresome.app / dareaday.app |
| Club | Courage Club | courageclub.app (.com taken) |
| Bird | BraveWren | bravewren.app |
| Bird | Boldfinch | boldfinch.app (reads derivative next to the Finch app) |
| Bird | Little Wing / First Flight | littlewing.app / firstflight.app |
| Descriptive | Social Reps | socialreps.app |

Loved but parked (aftermarket only): Fledge, Hearten, Braver, Bravely (also
shadowed by Square Enix's Bravely Default in store search), Outgoing, Sayable,
Step Out, Embolden, Embrave, Boldly, Inspirit, Little Wins, Wrenly, Tryday,
Lantern.

Ruled out on positioning: Extro (tells introverts they are the problem),
Rizz/Aura (meme slang, will age), TouchGrass (insult meme, existing apps),
SideQuest (VR store), Butterfly anything (Butterflies AI), Wingman (dating
coded).

## Domain strategy (applies to whichever name wins)

- **One canonical domain: `<name>.app`.** TLD is not a Google ranking factor;
  .app is Google-run, HTTPS-enforced (HSTS preloaded), ideal for the PWA.
  Brand-query SEO ("enheart") is won by the exact-match domain + store
  listings regardless of TLD.
- **Do NOT brand on `<name>app.com` compounds** (enheartapp.com,
  enheartenapp.com): they fork the brand, add typo surface, and buy zero SEO.
  At most, a cheap .com redirect.
- **Buy the misspelling moat as redirects:** for Enheart that is `inheart.app`
  (mishearing) and `enhearten.app` (dictionary form), 301'd to the canonical.
- **Mail:** send via the canonical domain through Resend with SPF/DKIM/DMARC
  from day one; TLD is irrelevant to deliverability.
- Real search traffic comes from content on the canonical domain (/method,
  articles), not the domain name.

## Next steps

1. Final gut-check on Enheart vs Braveish vs Small Dares.
2. Recheck + register the winner same day (Enheart bundle: enheart.app +
   inheart.app, optionally enhearten.app; ~$28-42/yr).
3. Check social handles (@enheart), run a proper trademark search before
   store submission.
4. Rename pass through the repo: manifest + app strings, README + docs,
   `NEXT_PUBLIC_APP_URL`, `SUPPORT_EMAIL`/`MAIL_FROM` placeholders, Lemon
   Squeezy store name, Vercel project/domain. Update this doc's status to
   **decided** with the date.
