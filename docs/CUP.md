# Swap'n'Serve Cup — setup & operations guide

A registration, payment and tournament-management feature for the 5-a-side
community Cup (€1,000 prize pot, World-Cup format). It takes the manual
registration and payment-chasing off the organiser.

- **Teams** are 7 players at **€10/head = €70/team**.
- Captains create a team and get a **shareable invite link** — no passwords.
- Payment is flexible: the **captain can pay the full €70**, or **each player
  pays their own €10**, or any **mix**. A team can never be charged over €70.
- A team becomes **`registered`** only when the roster is **7/7 and €70 is fully
  paid**, at which point it's eligible to be seeded into the draw.

## Pages / routes

| Route | Who | What |
| --- | --- | --- |
| `/cup` | Public / captains | Create a team, join via invite link, captain dashboard (`?manage=<token>`), join form (`?invite=<token>`) |
| `/cup/admin` | Organiser only | Passcode-gated: all teams, money in, contacts, generate groups + knockout, record results |
| `/cup/tournament` | Public | Live groups, standings, fixtures and the knockout bracket |

The homepage "Swap'n'Serve Cup" card links to `/cup`.

## Architecture

- **Frontend:** Vite + React + Tailwind + shadcn/ui (matches the rest of the
  site). Supabase browser client in `src/lib/supabase.ts`.
- **Pure logic (unit-tested with Vitest):**
  - `src/lib/teamStatus.ts` — `evaluateTeamStatus()` state machine (draft →
    collecting → registered) with the overpay guard.
  - `src/lib/tournament.ts` — seeded group draw, standings with tiebreakers,
    and the World-Cup knockout bracket with byes.
- **Backend:** Supabase Postgres + Edge Functions (Deno). Because there are no
  user accounts, **all table access goes through the edge functions using the
  service role**; RLS is enabled with no anon policies as defense-in-depth.
  The functions validate the caller's token (or the `ADMIN_TOKEN`) and project
  only public-safe fields on public endpoints.
  - `team` — create / join / get (captain) / public
  - `create-checkout` — Stripe Checkout for €10 or €70, with overpay guard
  - `stripe-webhook` — marks payments paid and re-evaluates team status
  - `admin` — list, generate-groups, generate-knockout, record-match, reset
  - `tournament` — public read (safe fields only)

The `evaluateTeamStatus` and `tournament` engines are mirrored (byte-identical
logic) under `supabase/functions/_shared/` because Deno can't import from
`src/`. The `src/` copies are the source of truth and carry the tests.

---

## 1. Create the Supabase project

You need a Supabase project. If you don't have one yet, use the browser prompt
in [`docs/create-supabase-project.cowork.md`](./create-supabase-project.cowork.md)
with Claude Cowork, or create it manually at https://supabase.com/dashboard.

Then grab, from **Project Settings → API**:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon public key** → `VITE_SUPABASE_ANON_KEY`
- **service_role key** → used by the functions (kept as a secret, not in the app)

## 2. Set the frontend env vars

Copy `.env.example` to `.env` and fill in the two `VITE_` values. In **Lovable**,
set them under **Project → Settings → Environment variables** (same names). The
Cup pages show a friendly "not live yet" notice until these are set.

## 3. Apply the database migrations

Files live in `supabase/migrations/`. Using the [Supabase CLI](https://supabase.com/docs/guides/cli):

```sh
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

Or paste each migration file's SQL into the Supabase **SQL Editor** in order:

1. `20260724000001_cup_schema.sql`
2. `20260724000002_cup_rls.sql`
3. `20260724000003_cup_match_unique.sql`

## 4. Set up Stripe (test mode)

1. Create a Stripe account (or use an existing one) and stay in **Test mode**.
2. Copy your **Secret key** (`sk_test_...`) from **Developers → API keys**.
3. You'll add the **webhook signing secret** in step 6.

## 5. Deploy the edge functions

```sh
supabase functions deploy team
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
supabase functions deploy admin
supabase functions deploy tournament
```

`supabase/config.toml` already sets `verify_jwt = false` for these functions
(they do their own token/secret auth, and Stripe can't send a Supabase JWT).

## 6. Set the function secrets

```sh
supabase secrets set \
  STRIPE_SECRET_KEY=sk_test_xxx \
  STRIPE_WEBHOOK_SECRET=whsec_xxx \
  ADMIN_TOKEN=a-long-random-string \
  SITE_URL=https://your-live-site
```

- `ADMIN_TOKEN` is the passcode you'll type into `/cup/admin`. Make it long and
  random.
- `SITE_URL` is your public site origin — used to build the Stripe success/cancel
  redirect back to `/cup`.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically by
  the Supabase runtime — you don't set those.

### Register the Stripe webhook

In Stripe **Developers → Webhooks → Add endpoint**:

- **Endpoint URL:** `https://<your-project-ref>.functions.supabase.co/stripe-webhook`
- **Event:** `checkout.session.completed`
- Copy the **Signing secret** (`whsec_...`) and set it as `STRIPE_WEBHOOK_SECRET`
  (re-run the `supabase secrets set` above), then redeploy the webhook if needed.

## 7. Test the flow

1. Go to `/cup`, create a team → you land on the captain dashboard.
2. Copy the invite link, open it in another tab, add a teammate.
3. Pay with a Stripe **test card** `4242 4242 4242 4242`, any future expiry, any CVC.
4. Watch the dashboard flip toward `registered` as roster + payments complete.
5. Open `/cup/admin`, enter your `ADMIN_TOKEN`, and once ≥2 teams are
   `registered`, **Draw groups**. Enter group results, then **Generate knockout**.
6. Watch it all appear live on `/cup/tournament`.

Going live: switch Stripe to live keys, update the secrets, and re-register the
webhook with your live signing secret.

---

## How it ships to Lovable

This repo is synced with Lovable via GitHub. Commits pushed here are pulled into
the live site automatically — so once the migrations are applied, the functions
are deployed, and the env vars are set in Lovable, the Cup is live. The frontend
code is already in this repo; Supabase (DB + functions) is deployed separately as
above and is shared by both local dev and the Lovable-hosted site.

## Defaults (configurable)

- **Groups of 4, top 2 advance** — adjustable per draw in the admin page.
- **No registration deadline lock** — sign-ups stay open.
- **No automatic refunds** — teams that never complete are simply left
  `collecting`; handle any refunds manually in Stripe.
