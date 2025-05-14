# Database Management Guide

This guide covers database operations for the AiroDental monorepo, including schema changes, migrations, and deployment workflows.

## Environment Setup

### Required Environment Variables

Make sure these environment variables are set in all environments:

```
DATABASE_URL="postgresql://user:password@localhost:5432/airodental"
```

In Vercel, add this environment variable in your project settings.

## Schema Changes Workflow

### 1. Making Schema Changes

1. Edit the Prisma schema at `packages/db/prisma/schema.prisma`
2. Add your new models, fields, or relationships

### 2. Local Development

After making schema changes:

```bash
# Generate Prisma client
pnpm --filter @repo/db db:generate

# Push changes to your local development database
pnpm --filter @repo/db db:push

# Optional: Open Prisma Studio to inspect your database
pnpm --filter @repo/db db:studio
```

### 3. Creating Migrations

When your schema changes are ready for production:

```bash
# Create a named migration file
cd packages/db
npx prisma migrate dev --name your_migration_name
```

This creates a new migration in `packages/db/prisma/migrations/`.

## Deployment Workflow

Our monorepo is configured to handle database changes safely across environments.

### Preview/Development Deployments

For branch deployments and preview environments:

1. Migrations run automatically during build
2. No manual action needed

### Production Deployments

For production deployments:

1. Push changes to your main branch
2. Verify the application deployed successfully
3. Run migrations manually using:

```bash
# Run from project root
pnpm prod-migrate
```

Or use Vercel CLI directly:

```bash
vercel --prod --cwd packages/db run db:deploy
```

> **⚠️ Important:** Always run production migrations after verifying your deployment works, and preferably during a maintenance window.

## Managing Databases

### Viewing Database Schema

```bash
# Open Prisma Studio to browse your database
pnpm --filter @repo/db db:studio
```

### Seeding Data

For database seeding or maintenance scripts, add them to `packages/db/prisma/seed.ts`.

### Troubleshooting

If you encounter migration issues:

1. Check the Prisma migration history:
   ```bash
   cd packages/db
   npx prisma migrate status
   ```

2. For migration failures, you may need to reset your preview databases:
   ```bash
   # Warning: Resets development database
   npx prisma migrate reset
   ```

## Configuration Reference

Key configuration files:

- `turbo.json` - Controls build pipeline including db:generate
- `packages/db/package.json` - Contains database command scripts
- `vercel.json` - Configures Vercel deployment
- `package.json` (root) - Contains migration scripts

## Advanced Operations

For complex database operations like data backups, schema rollbacks, or large migrations, contact the database administrator.

---

**Remember**: Always back up your database before running migrations in production. 