"""Create missing token tables for fresh installs and databases at the former head."""
import sqlalchemy as sa
from alembic import op

revision = "9ab32e041a67"
down_revision = "7d7f41e47961"
branch_labels = None
depends_on = None


def upgrade():
    for name in ("password_reset_tokens", "email_verification_tokens"):
        if not op.get_context().as_sql and sa.inspect(op.get_bind()).has_table(name):
            continue
        op.create_table(
            name,
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
            sa.Column("token_hash", sa.String(64), nullable=False),
            sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("used_at", sa.DateTime(timezone=True)),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )
        op.create_index(f"ix_{name}_user_id", name, ["user_id"])
        op.create_index(f"ix_{name}_token_hash", name, ["token_hash"], unique=True)


def downgrade():
    # Earlier deployments created these tables outside Alembic. Preserve token data.
    pass
