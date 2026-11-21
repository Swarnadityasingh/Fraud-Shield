"""add authentication tables and user prediction relation

Revision ID: 4dd039e39259
Revises: b7c35aeda05d
Create Date: 2026-11-09 18:02:57.993384

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4dd039e39259'
down_revision: Union[str, Sequence[str], None] = 'b7c35aeda05d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    inspector = None if op.get_context().as_sql else sa.inspect(op.get_bind())
    if inspector is None or not inspector.has_table("users"):
        op.create_table(
            "users",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("email", sa.String(255), nullable=False),
            sa.Column("full_name", sa.String(150), nullable=False),
            sa.Column("profile_picture", sa.String(500)),
            sa.Column("is_email_verified", sa.Boolean(), nullable=False),
            sa.Column("is_active", sa.Boolean(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )
        op.create_index("ix_users_id", "users", ["id"])
        op.create_index("ix_users_email", "users", ["email"], unique=True)
    if inspector is None or not inspector.has_table("auth_identities"):
        op.create_table(
            "auth_identities",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
            sa.Column("provider", sa.String(30), nullable=False),
            sa.Column("provider_user_id", sa.String(255), nullable=False),
            sa.Column("password_hash", sa.String(255)),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.UniqueConstraint("provider", "provider_user_id", name="uq_auth_provider_user"),
        )
        op.create_index("ix_auth_identities_user_id", "auth_identities", ["user_id"])
    if inspector is None or not inspector.has_table("refresh_sessions"):
        op.create_table(
            "refresh_sessions",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
            sa.Column("token_hash", sa.String(255), nullable=False, unique=True),
            sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("revoked_at", sa.DateTime(timezone=True)),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )
        op.create_index("ix_refresh_sessions_user_id", "refresh_sessions", ["user_id"])
    columns = [] if inspector is None else inspector.get_columns("prediction_history")
    if not any(c["name"] == "user_id" for c in columns):
        with op.batch_alter_table("prediction_history") as batch:
            batch.add_column(sa.Column("user_id", sa.Integer(), nullable=True))
            batch.create_foreign_key("fk_prediction_history_user_id_users", "users", ["user_id"], ["id"], ondelete="SET NULL")
            batch.create_index("ix_prediction_history_user_id", ["user_id"])


def downgrade() -> None:
    with op.batch_alter_table("prediction_history") as batch:
        batch.drop_index("ix_prediction_history_user_id")
        batch.drop_constraint("fk_prediction_history_user_id_users", type_="foreignkey")
        batch.drop_column("user_id")
    # Retain account tables previously adopted from legacy installations.
