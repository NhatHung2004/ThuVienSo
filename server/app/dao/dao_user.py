
from app import db
from app.models import User, UserRole
import bcrypt

def create_user(username, email, password, role=None, avatar=None, firstname=None, lastname=None):
    password = str(bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'))

    if role is None:
        user = User(username=username, email=email, password=password, firstname=firstname, lastname=lastname)
    else:
        user = User(username=username, email=email, password=password, firstname=firstname, lastname=lastname, role=role)

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

def delete_user(user):
    if user:
        db.session.delete(user)
        db.session.commit()
        return True
    return False

def login(username, passsword):
    user = db.session.query(User).filter_by(username=username).first()

    if user is None or not user.check_password(passsword):
        return None

    return user

