"""add missing industry enum values

Revision ID: 6d5b798dd226
Revises: d6bfa3df105a
Create Date: 2025-06-30 17:30:45.370138

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6d5b798dd226'
down_revision: Union[str, None] = 'd6bfa3df105a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add missing industry enum values
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Real Estate'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Energy'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Transportation'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Media'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Entertainment'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Food & Beverage'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Agriculture'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Hospitality'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Construction'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Telecommunications'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Biotechnology'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Aerospace'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Automotive'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Ecommerce'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Gaming'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Cybersecurity'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Fintech'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Ed Tech'")


def downgrade() -> None:
    """Downgrade schema."""
    # Note: PostgreSQL doesn't support removing enum values easily
    # This would require recreating the enum type and updating all references
    pass
