"""empty message

Revision ID: eb2ba8b27b2e
Revises: 50399aa674cd
Create Date: 2025-07-11 22:46:30.245653

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'eb2ba8b27b2e'
down_revision = '50399aa674cd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('request', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('request_ibfk_2'), type_='foreignkey')
        batch_op.drop_column('staff_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('request', schema=None) as batch_op:
        batch_op.add_column(sa.Column('staff_id', mysql.INTEGER(), autoincrement=False, nullable=False))
        batch_op.create_foreign_key(batch_op.f('request_ibfk_2'), 'user', ['staff_id'], ['id'])

    # ### end Alembic commands ###
