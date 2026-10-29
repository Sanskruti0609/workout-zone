# Database guide

PostgreSQL, accessed through Prisma. The schema is in `backend/prisma/schema.prisma`.

## Two connection strings
- `DATABASE_URL`: pooled connection, used by the running API.
- `DIRECT_URL`: direct connection, used by `prisma migrate`.

Neon's pooled string has `-pooler` in the host name. Remove `&channel_binding=require` if present.

## Changing the schema
1. Edit `schema.prisma`.
2. In `backend`, run `npx prisma migrate dev --name describe_the_change`.
3. Commit the new folder in `prisma/migrations/`.

## Applying migrations on the live database
Use `npx prisma migrate deploy` (never `migrate dev`, which can reset data).

## Seeding
`npm run db:seed` only inserts the verified starting data and never overwrites rows that already exist.

## Backups
Free database tiers may have little or no backup history. Before going live, check your provider's current backup and retention options. As a minimum, take a manual dump regularly (needs the PostgreSQL client tools installed):

```
pg_dump "<DIRECT_URL>" > backup-YYYY-MM-DD.sql
```

Keep copies somewhere other than the server. Test a restore at least once.

## Moving to another PostgreSQL provider
The app is standard PostgreSQL, so you are not locked in to Neon.
1. `pg_dump` from the old database.
2. Create the new database and restore the dump into it (`psql "<new URL>" < backup.sql`).
3. Update `DATABASE_URL` and `DIRECT_URL` in the backend's environment settings and redeploy.
