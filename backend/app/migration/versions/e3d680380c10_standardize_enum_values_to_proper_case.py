"""standardize enum values to proper case

Revision ID: e3d680380c10
Revises: 888eef3191de
Create Date: 2025-06-30 17:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e3d680380c10'
down_revision: Union[str, None] = '888eef3191de'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add properly-cased industry enum values to match model definitions
    # (corresponding ALL CAPS versions exist but we need proper case)
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Technology'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Healthcare'") 
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Finance'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Education'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Manufacturing'")
    op.execute("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'Retail'")
    
    # Add properly-cased funding stage enum values to match model definitions
    # (corresponding ALL CAPS versions exist but we need proper case)
    op.execute("ALTER TYPE fundingstage ADD VALUE IF NOT EXISTS 'Idea'")
    op.execute("ALTER TYPE fundingstage ADD VALUE IF NOT EXISTS 'Early Stage'")
    
    # Note: MVP and IPO are defined as "MVP" and "IPO" in the model (already correct)
    # Note: "Health Tech" and "Other" already exist in proper case for industry
    # Note: "Other" already exists in proper case for funding stage
    # Note: The ALL CAPS versions will remain but won't be used by the application


def downgrade() -> None:
    """Downgrade schema."""
    # Note: PostgreSQL doesn't support removing enum values easily
    # This would require recreating the enum type and updating all references
    pass
