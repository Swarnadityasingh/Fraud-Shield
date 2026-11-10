"""add password reset tokens

Revision ID: 7d7f41e47961
Revises: 4dd039e39259
Create Date: 2026-11-10 17:37:22.018821

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '7d7f41e47961'
down_revision: Union[str, Sequence[str], None] = '4dd039e39259'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade() -> None:
    pass


def downgrade() -> None:
    pass