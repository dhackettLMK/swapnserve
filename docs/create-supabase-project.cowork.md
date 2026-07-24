# Cowork browser prompt — create the Cup's Supabase project

Paste the prompt below into **Claude Cowork** (the browser agent) to create and
configure a fresh Supabase project for the Swap'n'Serve Cup. It won't have your
passwords — it will pause and ask you to log in / approve where needed.

> ⚠️ Keys are secrets. When Cowork reads the anon key, service_role key, or any
> Stripe key back to you, store them somewhere safe (a password manager). Only
> the **anon** key and **project URL** go into the frontend env vars; the
> service_role and Stripe keys stay as Supabase function secrets.

---

## Prompt to paste into Cowork

```
You are helping me set up the backend for the "Swap'n'Serve Cup" feature.

Goal: create a new Supabase project and collect the values I need to configure it.

Steps:
1. Go to https://supabase.com/dashboard and sign in (pause and let me log in if needed).
2. Create a new project:
   - Organisation: my existing one (ask me if there's more than one).
   - Name: "swapnserve-cup"
   - Region: choose the one closest to Ireland / western Europe (e.g. West EU (Ireland) / eu-west-1).
   - Generate a strong database password and show it to me so I can save it.
3. Wait for the project to finish provisioning.
4. Open Project Settings → API and read back to me, clearly labelled:
   - Project URL
   - anon public key
   - service_role key (tell me this one is secret)
   - the Project ref (the subdomain in the URL)
5. Do NOT deploy anything or run SQL — I'll apply the migrations and deploy the
   edge functions myself from the repo using the Supabase CLI.
6. Summarise the four values at the end so I can copy them.

Then remind me that:
- Project URL + anon key go into VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
  (in .env locally and in Lovable → Project Settings → Environment variables).
- The service_role key is used only by the edge functions and must be kept secret.
- Next I need a Stripe test account and to run the steps in docs/CUP.md.
```

---

After Cowork gives you the values, continue with
[`docs/CUP.md`](./CUP.md) from **step 2** (set env vars) onward.
