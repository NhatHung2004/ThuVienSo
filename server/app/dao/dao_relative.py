from app.models import Relative
from app import db

def get_relative_by_user_id(user_id):
    return Relative.query.filter_by(user_id=user_id).all()

def create_relative(name, phone, relationship, user_id):
    relative = Relative(
        name=name,
        phone=phone,
        relationship=relationship,
        user_id=user_id
    )

    db.session.add(relative)
    db.session.commit()

    return relative

def delete_relative_by_user_id(user_id):
    relative = Relative.query.filter_by(user_id=user_id).first()

    if relative:
        db.session.delete(relative)
        db.session.commit()

        return True

    return False

def delete_all_relatives():
    Relative.query.delete()
    db.session.commit()
    return True
