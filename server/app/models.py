from app import db
from sqlalchemy import Column, String, Integer, Enum
from enum import Enum as UserEnum
import bcrypt

class UserRole(UserEnum):
    ADMIN = 1
    LIBRARIAN = 2
    READER = 3

class User(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False)
    password = Column(String(150), nullable=False)
    firstname = Column(String(50), nullable=True)
    lastname = Column(String(50), nullable=True)
    email = Column(String(50), nullable=False)
    avatar = Column(String(250), default="https://res.cloudinary.com/dxeinnlqb/image/upload/v1752111470/user_etmacv.png")
    role = Column(Enum(UserRole), default=UserRole.READER)

    def __str__(self):
        return self.name

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))