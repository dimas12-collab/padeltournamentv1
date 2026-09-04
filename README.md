# Padel Battle Series V1

Interactive frontend for the Padel Battle Series tournament website and organizer workspace. The UI follows `prd.md` and `uiux.md` and uses English copy throughout.

## Run locally

Requirements: Node.js 20.9 or later and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Tournament data is loaded from PostgreSQL/Supabase; a browser-local copy is only used as a temporary fallback if the database is unavailable.

## PostgreSQL and Better Auth

The durable backend is ready for PostgreSQL, Drizzle, and Better Auth.

```bash
cp .env.example .env
docker compose up -d postgres
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Set a strong, unique `BETTER_AUTH_SECRET` before deployment. Better Auth is mounted at `/api/auth/*`; it supports email-and-password accounts and stores sessions in PostgreSQL. The authenticated user profile includes a server-side role and assigned event, so permission checks do not rely on hidden client controls.

`pnpm db:generate` creates a new SQL migration whenever the Drizzle schema changes. Commit generated files under `drizzle/`; run `pnpm db:migrate` against each environment. Do not run the seed command in production unless its sample data is wanted. The first account created at `/login` becomes Super Admin; later accounts start as Scorekeeper and can be assigned a role/event in **Users**.

## Deploy with GitHub and Coolify

The repository includes a production [Dockerfile](Dockerfile). It builds the Next.js standalone server, runs it as an unprivileged user, and listens on port `3000`. PostgreSQL stays in Supabase; it is not bundled into the application container.

### 1. Push the project to GitHub

Create an empty GitHub repository, then run these commands from the project directory. Replace the GitHub URL with the URL of the repository you created.

```bash
git init
git add .
git commit -m "Prepare Coolify deployment"
git branch -M main
git remote add origin https://github.com/YOUR-ACCOUNT/YOUR-REPOSITORY.git
git push -u origin main
```

Never commit `.env`; it is excluded by `.gitignore` and `.dockerignore`.

### 2. Create the Coolify resource

1. In Coolify, create **New Resource** and select the connected GitHub repository and the `main` branch.
2. Set the build pack to **Dockerfile**. Coolify will use the root `Dockerfile` automatically.
3. Set the exposed port to `3000` and add your HTTPS domain.
4. Add the following environment variables in Coolify, then deploy:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | The PostgreSQL connection string from Supabase. Use the connection-pooler string when Coolify runs outside Supabase's private network. |
| `BETTER_AUTH_URL` | Your final public URL, for example `https://padel.example.com`, without a trailing slash. |
| `BETTER_AUTH_SECRET` | A new random secret of at least 32 characters. Generate one with `openssl rand -base64 32`. |

`PORT=3000` and `HOSTNAME=0.0.0.0` are already set by the Docker image, so they do not need to be added in Coolify. Configure Coolify's health check to request `/` on port `3000`.

### 3. Apply database migrations

Before the first production deployment, point a local `.env` temporarily at the same Supabase database configured in Coolify and run:

```bash
pnpm db:migrate
```

Run that command again after every committed Drizzle migration. Do not run `pnpm db:seed` against the production database unless you intentionally want the sample tournament data. After migration, deploy from Coolify; each later push to `main` triggers a new build and deployment.

## Available areas

- Public event list and event overview
- Schedule with URL-based search and filters
- Derived standings with compact mobile and full-table views
- Team and match details
- Responsive knockout bracket
- Organizer dashboard and event selection
- CRUD, duplicate, Trash, restore, and guarded permanent delete flows
- Group assignment and round-robin match generation
- Scorekeeper match centre, finished-score correction, reopen, and reset
- Configurable points and tie-break order
- Role-aware navigation and demo access restrictions
- Human-readable audit history

Authenticated changes are written to Supabase and then refreshed in the client. **Tournament settings → Refresh live data** reloads the latest snapshot.

## Quality checks

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

The test suite covers score validation, standings and tie-breaks, point-rule changes, score corrections, delete/restore behavior, bracket progression, schedule conflicts, CRUD, roles, round-robin generation, persistence, and corrupt-storage recovery.

## Architecture and backend boundary

- `src/lib/types.ts` defines tournament records plus repository and session adapter interfaces.
- `src/lib/engine.ts` contains pure tournament calculations and validation.
- `src/lib/store.ts` keeps the responsive client state and synchronizes it with the secured tournament API.
- `src/db/schema.ts`, `src/db/index.ts`, and `drizzle/` are the PostgreSQL schema, connection, and immutable migration history.
- `src/lib/auth.ts`, `src/app/api/auth/[...all]/route.ts`, and `src/app/api/tournament/route.ts` provide Better Auth sessions plus the protected tournament API.
- `src/components` contains shared public, admin, form, and scorekeeper surfaces.

File storage remains intentionally deferred. Phone numbers and email addresses are kept out of all public views.
