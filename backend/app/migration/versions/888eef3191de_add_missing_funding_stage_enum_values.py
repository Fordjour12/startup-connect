"""add missing funding stage enum values

Revision ID: 888eef3191de
Revises: 6d5b798dd226
Create Date: 2025-06-30 17:33:15.123456

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '888eef3191de'
down_revision: Union[str, None] = '6d5b798dd226'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add missing funding stage enum values
    op.execute("ALTER TYPE fundingstage ADD VALUE IF NOT EXISTS 'Pre-Seed'")
    op.execute("ALTER TYPE fundingstage ADD VALUE IF NOT EXISTS 'Seed'")
    op.execute("ALTER TYPE fundingstage ADD VALUE IF NOT EXISTS 'Series A'")
    op.execute("ALTER TYPE fundingstage ADD VALUE IF NOT EXISTS 'Series B'")
    op.execute("ALTER TYPE fundingstage ADD VALUE IF NOT EXISTS 'Series C'")
    op.execute("ALTER TYPE fundingstage ADD VALUE IF NOT EXISTS 'IPO'")
    op.execute("ALTER TYPE fundingstage ADD VALUE IF NOT EXISTS 'Merger & Acquisition'")
    op.execute("ALTER TYPE fundingstage ADD VALUE IF NOT EXISTS 'Other'")


def downgrade() -> None:
    """Downgrade schema."""
    # Note: PostgreSQL doesn't support removing enum values easily
    # This would require recreating the enum type and updating all references
    pass
