# Welcome to your Lovable project

## Swap'n'Serve Cup

The site includes the **Swap'n'Serve Cup** — registration, payment and
tournament management for the 5-a-side community tournament (€1,000 prize pot,
World-Cup format). Teams are 7 players at €10/head (€70/team); the captain or the
players (or a mix) pay via Stripe, and a team is auto-eligible for the draw once
it's 7/7 players and fully paid.

- `/cup` — create a team, share an invite link, captain dashboard, teammate join
- `/cup/admin` — organiser-only console (passcode): teams, money in, generate the
  draw and bracket, record results
- `/cup/tournament` — public groups, standings and the knockout bracket

Pure, unit-tested logic lives in `src/lib/tournament.ts` (draw + standings +
bracket) and `src/lib/teamStatus.ts` (registration state machine). The backend is
Supabase (Postgres + Edge Functions) in `supabase/`. Run the tests with `npm test`.

**Setup:** see [`docs/CUP.md`](./docs/CUP.md) for the full guide — creating the
Supabase project, applying the migrations, deploying the edge functions, and the
exact Stripe steps. Environment variables are documented in `.env.example`. If you
don't have a Supabase project yet, [`docs/create-supabase-project.cowork.md`](./docs/create-supabase-project.cowork.md)
has a browser prompt for Claude Cowork to create one.

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
