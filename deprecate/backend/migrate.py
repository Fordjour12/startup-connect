#!/usr/bin/env python3
"""
Database migration management script for local development.
This script provides convenient commands for managing Alembic migrations.

Usage:
    python migrate.py [command] [options]

Commands:
    status      - Show current migration status
    upgrade     - Apply pending migrations (default: upgrade to head)
    downgrade   - Downgrade migrations (specify revision)
    history     - Show migration history
    current     - Show current migration revision
    check       - Verify migrations without applying
    generate    - Generate new migration from model changes
    sql         - Generate SQL for migrations without applying
    reset       - Reset database and apply all migrations (DANGEROUS)

Examples:
    python migrate.py status
    python migrate.py upgrade
    python migrate.py downgrade -1
    python migrate.py generate "add user table"
    python migrate.py sql
    python migrate.py reset --confirm
"""

import os
import sys
import argparse
import subprocess
from pathlib import Path

# Add the current directory to Python path so we can import app modules
sys.path.insert(0, str(Path(__file__).parent))

def run_alembic_command(args):
    """Execute alembic command with proper error handling."""
    try:
        result = subprocess.run(
            ["alembic"] + args,
            capture_output=True,
            text=True,
            cwd=Path(__file__).parent
        )

        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print(result.stderr, file=sys.stderr)

        return result.returncode == 0
    except FileNotFoundError:
        print("❌ Alembic not found. Please install it: pip install alembic")
        return False
    except Exception as e:
        print(f"❌ Error running alembic: {e}")
        return False

def check_database_connection():
    """Verify database connection before running migrations."""
    try:
        from app.core.config import settings
        from sqlalchemy import create_engine, text

        engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URL))
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Connected to PostgreSQL: {version}")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def status():
    """Show current migration status."""
    print("📊 Migration Status")
    print("=" * 50)

    if not check_database_connection():
        return False

    print("\n🔍 Current revision:")
    current_success = run_alembic_command(["current"])

    print("\n📋 Migration history (last 5):")
    history_success = run_alembic_command(["history", "-r", "-5:"])

    print("\n🎯 Head revision:")
    head_success = run_alembic_command(["show", "head"])

    return current_success and history_success and head_success

def upgrade(revision="head"):
    """Apply migrations up to specified revision."""
    print(f"🚀 Upgrading database to: {revision}")

    if not check_database_connection():
        return False

    return run_alembic_command(["upgrade", revision])

def downgrade(revision):
    """Downgrade database to specified revision."""
    print(f"⬇️  Downgrading database to: {revision}")

    if not check_database_connection():
        return False

    # Confirm downgrade operation
    confirm = input(f"Are you sure you want to downgrade to {revision}? (y/N): ")
    if confirm.lower() != 'y':
        print("❌ Downgrade cancelled")
        return False

    return run_alembic_command(["downgrade", revision])

def history():
    """Show complete migration history."""
    print("📚 Migration History")
    print("=" * 50)
    return run_alembic_command(["history", "-v"])

def current():
    """Show current migration revision."""
    print("📍 Current Migration")
    print("=" * 50)
    return run_alembic_command(["current", "-v"])

def check():
    """Verify migrations without applying them."""
    print("🔍 Checking migrations...")

    if not check_database_connection():
        return False

    return run_alembic_command(["check"])

def generate(message):
    """Generate new migration from model changes."""
    if not message:
        message = input("Enter migration message: ").strip()
        if not message:
            print("❌ Migration message is required")
            return False

    print(f"📝 Generating migration: {message}")
    return run_alembic_command(["revision", "--autogenerate", "-m", message])

def sql(revision="head"):
    """Generate SQL for migrations without applying."""
    print(f"📄 Generating SQL for migration to: {revision}")
    return run_alembic_command(["upgrade", revision, "--sql"])

def reset(confirm=False):
    """Reset database and apply all migrations (DANGEROUS)."""
    if not confirm:
        print("⚠️  WARNING: This will DROP all tables and recreate them!")
        print("⚠️  This operation is IRREVERSIBLE and will DESTROY ALL DATA!")
        confirm_input = input("Type 'RESET' to confirm: ")
        if confirm_input != "RESET":
            print("❌ Reset cancelled")
            return False

    print("🔄 Resetting database...")

    # Downgrade to base (removes all tables)
    print("⬇️  Dropping all tables...")
    if not run_alembic_command(["downgrade", "base"]):
        return False

    # Upgrade to head (recreates all tables)
    print("⬆️  Recreating all tables...")
    return run_alembic_command(["upgrade", "head"])

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Database migration management script",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )

    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Status command
    subparsers.add_parser("status", help="Show current migration status")

    # Upgrade command
    upgrade_parser = subparsers.add_parser("upgrade", help="Apply pending migrations")
    upgrade_parser.add_argument("revision", nargs="?", default="head", help="Target revision (default: head)")

    # Downgrade command
    downgrade_parser = subparsers.add_parser("downgrade", help="Downgrade migrations")
    downgrade_parser.add_argument("revision", help="Target revision (e.g., -1, base, or specific revision)")

    # History command
    subparsers.add_parser("history", help="Show migration history")

    # Current command
    subparsers.add_parser("current", help="Show current migration revision")

    # Check command
    subparsers.add_parser("check", help="Verify migrations without applying")

    # Generate command
    generate_parser = subparsers.add_parser("generate", help="Generate new migration")
    generate_parser.add_argument("message", nargs="?", help="Migration message")

    # SQL command
    sql_parser = subparsers.add_parser("sql", help="Generate SQL for migrations")
    sql_parser.add_argument("revision", nargs="?", default="head", help="Target revision (default: head)")

    # Reset command
    reset_parser = subparsers.add_parser("reset", help="Reset database (DANGEROUS)")
    reset_parser.add_argument("--confirm", action="store_true", help="Skip confirmation prompt")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    # Execute the requested command
    success = True

    if args.command == "status":
        success = status()
    elif args.command == "upgrade":
        success = upgrade(args.revision)
    elif args.command == "downgrade":
        success = downgrade(args.revision)
    elif args.command == "history":
        success = history()
    elif args.command == "current":
        success = current()
    elif args.command == "check":
        success = check()
    elif args.command == "generate":
        success = generate(getattr(args, 'message', None))
    elif args.command == "sql":
        success = sql(args.revision)
    elif args.command == "reset":
        success = reset(args.confirm)

    if success:
        print("✅ Operation completed successfully")
    else:
        print("❌ Operation failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
