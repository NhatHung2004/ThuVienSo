from app import db
from sqlalchemy import Column, String, Integer
import bcrypt

class User(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False)
    password = Column(String(150), nullable=False)

    def __str__(self):
        return self.name
