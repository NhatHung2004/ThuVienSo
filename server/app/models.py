from app import db
from sqlalchemy import Column, String, Integer

class Author(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    age = Column(Integer, nullable=False)

    def __str__(self):
        return self.name