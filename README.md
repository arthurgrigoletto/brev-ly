# Brev.ly

### How to run

1. Open two terminals and execute on each of them:
   1. `cd server`
   2. `cd web`
2. On the server terminal
   1. Copy `.env.example` to `.env`
   2. Fill with yours credentials
   3. Run `docker compose up -d` to run the database locally
   4. Run `pnpm install`
   5. Run `pnpm run dev`
3. On the web terminal
   1.  Run `pnpm install`
   2. Run `pnpm run dev`