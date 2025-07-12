from app import db
from app.models import Category

def add_category(name):
    cat = Category(name=name)
    db.session.add(cat)
    db.session.commit()
    return cat

def get_categories_list(kw=None):
    categories = Category.query

    if kw:
        categories = categories.filter(Category.name.__eq__(kw))

    return categories.all()
