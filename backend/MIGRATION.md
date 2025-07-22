# Database Migration Guide

This document provides a comprehensive guide for managing database migrations in the Startup Connect application using Alembic and GitHub Actions.

## Overview

Our application uses:
- **Alembic** for database schema migrations
- **SQLModel** for ORM models
- **Neon (PostgreSQL)** as the production database
- **GitHub Actions** for automated deployment and migration workflows

## Migration Workflows

### 1. Local Development Migrations

#### Using the Migration Script

We provide a convenient `migrate.py` script for local development:

```bash
# Show current migration status
python migrate.py status

# Apply all pending migrations
python migrate.py upgrade

# Generate new migration from model changes
python migrate.py generate "add user profile table"

# Show migration history
python migrate.py history

# Check migrations without applying
python migrate.py check

# Generate SQL preview
python migrate.py sql

# Downgrade to previous migration
python migrate.py downgrade -1
```

#### Using Alembic Directly

```bash
# Navigate to backend directory
cd backend

# Check current migration status
alembic current

# Show migration history
alembic history

# Apply migrations
alembic upgrade head

# Generate new migration
alembic revision --autogenerate -m "your migration message"

# Downgrade migrations
alembic downgrade -1
```

### 2. Production Migrations via GitHub Actions

#### Standalone Migration Workflow

Use the `migrate-production.yml` workflow for running migrations independently:

**Manual Trigger:**
1. Go to GitHub Actions → "Run Database Migrations"
2. Select environment (default: Production)
3. Choose dry-run mode if you want to preview changes
4. Click "Run workflow"

**Features:**
- ✅ Database connection verification
- ✅ Migration status checking
- ✅ Dry-run mode for safe previewing
- ✅ SQL generation for review
- ✅ Rollback capabilities
- ✅ Detailed logging and summaries

#### Integrated Deployment Workflow

The `deploy-cloudrun-merged.yml` workflow automatically:
1. **Runs migrations first** before any deployment
2. **Deploys backend** only after successful migrations
3. **Deploys frontend** after backend is ready
4. **Provides deployment summary** with service URLs

## Environment Setup

### Required Environment Variables

**GitHub Repository Secrets:**
```env
DATABASE_URL=postgresql://username:password@hostname:port/database
SA_EMAIL=your-service-account@project.iam.gserviceaccount.com
WIF_PROVIDER_FULL_PATH=projects/123/locations/global/workloadIdentityPools/pool/providers/provider
```

**GitHub Repository Variables:**
```env
GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1
AR_REPO_NAME=your-artifact-registry-repo
IMAGE_NAME=backend-app
IMAGE_NAME_SV=frontend-app
CLOUD_RUN_SERVICE_NAME=backend-service
CLOUD_RUN_SERVICE_NAME_SV=frontend-service
```

### Local Environment (.env)

```env
# Database
SQLALCHEMY_DATABASE_URL=postgresql://username:password@localhost:5432/startup_connect_dev

# Other app settings...
SECRET_KEY=your-secret-key
ENVIRONMENT=development
```

## Migration Best Practices

### 1. Creating Migrations

**DO:**
- Always review auto-generated migrations before committing
- Use descriptive migration messages
- Test migrations on a copy of production data
- Keep migrations atomic (one logical change per migration)
- Add comments for complex migrations

**DON'T:**
- Modify existing migration files after they've been applied
- Create migrations with destructive operations without backups
- Ignore migration conflicts

### 2. Migration Safety

**Before Production Deployment:**
1. **Test locally** with production-like data
2. **Run dry-run** using GitHub Actions
3. **Review generated SQL** carefully
4. **Ensure proper backups** are in place
5. **Plan rollback strategy** if needed

**Example Safe Migration Process:**
```bash
# 1. Create and test migration locally
python migrate.py generate "add user preferences table"
python migrate.py upgrade
python migrate.py status

# 2. Test with production data copy (optional)
# 3. Commit and push changes
git add app/migration/versions/
git commit -m "Add user preferences table migration"
git push

# 4. Run dry-run in production
# Use GitHub Actions with dry_run: true

# 5. Apply in production
# Use GitHub Actions or merge to trigger deployment
```

### 3. Handling Migration Conflicts

If you encounter migration conflicts:

```bash
# 1. Check current state
alembic current
alembic history

# 2. Resolve conflicts by creating a merge migration
alembic merge -m "merge migration heads" head1 head2

# 3. Review and test the merge migration
python migrate.py check
```

## Troubleshooting

### Common Issues

**Migration fails with "Target database is not up to date":**
```bash
# Check current status
alembic current
alembic stamp head  # Only if you're sure the schema is correct
```

**Connection issues:**
```bash
# Verify database connection
python -c "
from app.core.config import settings
from sqlalchemy import create_engine
engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URL))
with engine.connect(): print('Connection successful')
"
```

**Migration history issues:**
```bash
# View detailed history
alembic history -v
# Show current revision
alembic current -v
```

### Recovery Procedures

**If migration fails in production:**

1. **Check the error logs** in GitHub Actions
2. **Assess the failure point:**
   - Syntax error in migration → Fix and redeploy
   - Data constraint violation → May need data cleanup
   - Connection issue → Check database availability

3. **Rollback if necessary:**
   ```bash
   # Rollback to previous migration
   python migrate.py downgrade -1
   ```

4. **Fix and retry:**
   - Fix the migration issue
   - Test locally
   - Redeploy with corrected migration

## Advanced Usage

### Custom Migration Templates

You can customize the migration template by modifying `app/migration/script.py.mako`:

```mako
"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}

"""
# Your custom template modifications...
```

### Offline Migrations

For generating SQL scripts for manual application:

```bash
# Generate SQL for all pending migrations
alembic upgrade head --sql > migration.sql

# Generate SQL for specific revision range
alembic upgrade abc123:def456 --sql > partial_migration.sql
```

### Data Migrations

For migrations involving data transformations, create empty migrations and add custom logic:

```bash
# Create empty migration
alembic revision -m "migrate user data format"
```

Then edit the generated file to include data transformation logic using SQLAlchemy operations.

## Monitoring and Maintenance

### Regular Maintenance Tasks

1. **Weekly:** Review migration status across environments
2. **Monthly:** Clean up old migration files if needed
3. **Quarterly:** Review and optimize database schema

### Monitoring Migration Health

- Monitor GitHub Actions workflow success rates
- Set up alerts for migration failures
- Regularly test migration rollback procedures
- Keep database backups before major schema changes

## Support

If you encounter issues with migrations:

1. Check this documentation first
2. Review GitHub Actions logs
3. Test the migration locally
4. Consult with the team before making changes to production

For emergency migration issues, ensure you have:
- Database backup access
- Admin access to the production database
- Knowledge of the rollback procedure
