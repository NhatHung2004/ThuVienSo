import hashlib
from app import db
from app.models import User
import bcrypt


def create_user(name, email, password):
    password = str(bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'))
    user = User(name=name, email=email, password=password)

    db.session.add(user)
    db.session.commit()

    return user

def get_users_list():
    return db.session.query(User).all()

def get_user_by_id(user_id):
    user = db.session.query(User).get(user_id)
    if user:
        return user
    return None

