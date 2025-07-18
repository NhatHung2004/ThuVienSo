from datetime import datetime
from zoneinfo import ZoneInfo
from app import db
from sqlalchemy import Column, String, Integer, Enum, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship, backref
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

    requests = relationship("Request", backref="user", lazy=True)
    comments = relationship("Comment", backref="user", cascade="all, delete-orphan", lazy=True)

    def __str__(self):
        return self.name

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

class Book(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(50), nullable=False)
    description = Column(String(200), nullable=False)
    image = Column(String(250), nullable=True)
    quantity = Column(Integer, nullable=False)
    average_rating = Column(Float, default=0)

    author_id = Column(Integer, ForeignKey('author.id'), nullable=False)
    category_id = Column(Integer, ForeignKey('category.id'), nullable=False)

    request_details = relationship("RequestDetail", backref="book", cascade="all, delete-orphan", lazy=True)
    comments = relationship("Comment", backref="book", cascade="all, delete-orphan", lazy=True)

    def __str__(self):
        return self.title

class Author(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)

    books = relationship("Book", backref='author', lazy=True)

    def __str__(self):
        return self.name

class Category(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)

    books = relationship("Book", backref='category', lazy=True)

    def __str__(self):
        return self.name

class Request(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    request_date = Column(DateTime, nullable=False, default=datetime.now(ZoneInfo("Asia/Ho_Chi_Minh")))
    return_date = Column(DateTime, nullable=False)

    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)

    request_details = relationship("RequestDetail", backref='request', cascade="all, delete-orphan", lazy=True)

    def __str__(self):
        return self.request_details.title

class RequestDetail(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    request_id = Column(Integer, ForeignKey('request.id'), nullable=False)
    book_id = Column(Integer, ForeignKey('book.id'), nullable=False)
    quantity = Column(Integer, nullable=False)

class Comment(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(String(255), nullable=False)
    rating = Column(Integer, nullable=False, default=0)
    created_date = Column(DateTime, default=datetime.now(ZoneInfo("Asia/Ho_Chi_Minh")), nullable=False)

    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    book_id = Column(Integer, ForeignKey('book.id'), nullable=False)

    class Meta:
        ordering = ['-id']
