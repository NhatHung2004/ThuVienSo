from datetime import datetime
from zoneinfo import ZoneInfo
from app.extensions import db
from sqlalchemy import Column, String, Integer, Enum, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from enum import Enum as DataEnum
import bcrypt
from flask_login import UserMixin

class UserRole(DataEnum):
    ADMIN = "ADMIN"
    LIBRARIAN = "LIBRARIAN"
    READER = "READER"

class StatusCheck(DataEnum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    RETURNED = "RETURNED"

    def __str__(self):
        return str(self.value)

class User(db.Model, UserMixin):
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False, unique=True)
    password = Column(String(150), nullable=False)
    firstname = Column(String(50), nullable=True)
    lastname = Column(String(50), nullable=True)
    email = Column(String(50), nullable=False)
    avatar = Column(String(250), default="https://res.cloudinary.com/dxeinnlqb/image/upload/v1752111470/user_etmacv.png")
    role = Column(Enum(UserRole), default=UserRole.READER)

    requests = relationship("Request", backref="user", foreign_keys="Request.user_id", lazy=True)
    approved_requests = relationship("Request", backref="librarian", foreign_keys="Request.librarian_id", lazy=True)
    comments = relationship("Comment", backref="user", cascade="all, delete-orphan", lazy=True)

    def __str__(self):
        return self.username

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

class Book(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(50), nullable=False)
    description = Column(String(500), nullable=False)
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
    status = Column(Enum(StatusCheck), default=StatusCheck.PENDING)
    request_date = Column(DateTime, nullable=False, default=datetime.now(ZoneInfo("Asia/Ho_Chi_Minh")))
    return_date = Column(DateTime, nullable=True)

    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    librarian_id = Column(Integer, ForeignKey('user.id'), nullable=True)

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
