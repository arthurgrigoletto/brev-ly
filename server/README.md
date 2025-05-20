# Brev.ly Server

### How to run without docker

1. Copy `.env.example`
2. Change the `DATABASE_URL` from `pg:5432` to `localhost:5432`
3. Fill with yours credentials
4. Run `docker compose up -d pg` to run the database locally (Optional)
5. Run `pnpm install`
6. Run `pnpm run dev`

### How to run with docker

1. Copy `.env.example`
2. Fill with yours credentials
3. Run `docker compose up -d` to run the database locally
4. Run `pnpm install`
5. Run `pnpm run dev`