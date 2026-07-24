# Cowork "get going" prompt — set up the Cup backend

Paste the prompt below into **Claude Cowork** (the browser agent) to get the
Swap'n'Serve Cup backend going: it creates a fresh Supabase project, applies the
database migrations, and sets up a Stripe test account — pausing to let you log
in / approve where needed.

> ⚠️ **Keys are secrets.** When Cowork reads the anon key, service_role key, or
> any Stripe key back to you, save them in a password manager. Only the **anon**
> key and **project URL** go into the frontend env vars; the **service_role** and
> **Stripe** keys stay as Supabase function secrets and never go in the app.

The repo (with the migration SQL and edge-function code) is
`github.com/dhackettLMK/swapnserve`, branch
`claude/swapnserve-cup-manager-st37km`.

Cowork handles the browser-friendly parts (Stages A–C below). Deploying the edge
functions is quickest from a terminal with the Supabase CLI, or ask Claude Code
to deploy them — see **Stage D** and [`CUP.md`](./CUP.md) steps 5–6.

---

## Prompt to paste into Cowork

```
You are helping me set up the backend for my "Swap'n'Serve Cup" feature. The code
is on GitHub at github.com/dhackettLMK/swapnserve, branch
claude/swapnserve-cup-manager-st37km. Work through the stages below, pausing to
let me log in or approve anything sensitive. Treat all keys as secrets: read them
back to me clearly labelled so I can save them, and never post them anywhere.

STAGE A — Create the Supabase project
1. Go to https://supabase.com/dashboard and sign in (pause for me to log in).
2. Create a new project:
   - Organisation: my existing one (ask me if there is more than one).
   - Name: swapnserve-cup
   - Region: closest to Ireland / western Europe (e.g. West EU (Ireland)).
   - Generate a strong database password and show it to me to save.
3. Wait for provisioning to finish.
4. Open Project Settings → API and read back to me, clearly labelled:
   - Project URL
   - anon public key
   - service_role key  (tell me this one is SECRET)
   - Project ref (the subdomain of the URL)

STAGE B — Apply the database migrations
5. In the Supabase dashboard, open the SQL Editor.
6. On GitHub, open the branch above and go to the supabase/migrations/ folder.
   There are three .sql files. For EACH one, in this exact order, copy its full
   contents and run it in a new SQL Editor query, confirming it succeeds before
   the next:
     a. 20260724000001_cup_schema.sql
     b. 20260724000002_cup_rls.sql
     c. 20260724000003_cup_match_unique.sql
7. Then open Table Editor and confirm these tables now exist: teams, players,
   payments, tournament, groups, group_teams, matches. Tell me if any are missing.

STAGE C — Stripe test account
8. Go to https://dashboard.stripe.com and sign in or create an account (pause for me).
9. Make sure you are in TEST MODE (toggle in the dashboard).
10. Open Developers → API keys and read me the test Secret key (starts sk_test_).
    Tell me it is secret.
11. Do NOT create the webhook yet — that needs the deployed function URL, which
    comes after the functions are deployed (Stage D). Just remind me of that.

WRAP UP
12. Summarise everything you collected, clearly labelled:
    - Supabase: Project URL, anon key, service_role key, Project ref, DB password
    - Stripe: test Secret key
13. Remind me of the next steps:
    - Put Project URL + anon key into VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
      in .env locally AND in Lovable → Project Settings → Environment variables.
    - Deploy the 5 edge functions and set the function secrets (service_role is
      auto-injected; I still set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
      ADMIN_TOKEN and SITE_URL) — see docs/CUP.md steps 5–6.
    - After the stripe-webhook function is deployed, add the Stripe webhook for
      the checkout.session.completed event and save its signing secret.
```

---

## Stage D — deploy the edge functions (after Cowork)

The functions share code under `supabase/functions/_shared/`, so they deploy most
reliably with the Supabase CLI (not the dashboard editor):

```sh
supabase login
supabase link --project-ref <your-project-ref>
supabase db push            # if you didn't run the SQL in Stage B
supabase functions deploy team create-checkout stripe-webhook admin tournament
supabase secrets set \
  STRIPE_SECRET_KEY=sk_test_xxx \
  STRIPE_WEBHOOK_SECRET=whsec_xxx \
  ADMIN_TOKEN=a-long-random-string \
  SITE_URL=https://your-live-site
```

Then register the Stripe webhook (endpoint
`https://<project-ref>.functions.supabase.co/stripe-webhook`, event
`checkout.session.completed`) and put its signing secret into
`STRIPE_WEBHOOK_SECRET`. Full details and the test-card walkthrough are in
[`CUP.md`](./CUP.md).

> Prefer not to touch a terminal? Ask Claude Code to deploy the functions and set
> the secrets for you via its Supabase connection — just share the project ref.
