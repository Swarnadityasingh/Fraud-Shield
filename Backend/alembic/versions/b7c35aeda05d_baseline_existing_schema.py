"""baseline existing schema

Revision ID: b7c35aeda05d
Revises: 
Create Date: 2026-11-09 17:56:08.501678

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7c35aeda05d'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    if not op.get_context().as_sql and sa.inspect(op.get_bind()).has_table("prediction_history"):
        return
    op.create_table(
        "prediction_history",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("model_type", sa.String(50), nullable=False),
        sa.Column("prediction", sa.Integer(), nullable=False),
        sa.Column("probability", sa.Float(), nullable=False),
        sa.Column("risk_level", sa.String(20), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    for field in ("id", "model_type"):
        op.create_index(f"ix_prediction_history_{field}", "prediction_history", [field])


def downgrade() -> None:
    # This revision adopts legacy installations. Retain their original history.
    pass
