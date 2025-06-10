"""add_is_published_to_startup

Revision ID: 220e24ddac5e
Revises: a48f33b900c7
Create Date: 2025-06-08 17:13:45.672788

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "220e24ddac5e"
down_revision: Union[str, None] = "a48f33b900c7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add is_published column to startup table
    op.add_column(
        "startup",
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default="false"),
    )

    # Create index on is_published for better query performance
    op.create_index("ix_startup_is_published", "startup", ["is_published"])


def downgrade() -> None:
    """Downgrade schema."""
    # Drop index first
    op.drop_index("ix_startup_is_published", "startup")

    # Drop the is_published column
    op.drop_column("startup", "is_published")
