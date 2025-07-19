from app import db
from app.models import Author

def add_author(name):
    author = Author(name=name)
    db.session.add(author)
    db.session.commit()
    return author

def get_author_by_id(author_id):
    return Author.query.get(author_id)

def get_authors_list(kw=None):
    authors = Author.query

    if kw:
        authors = authors.filter(Author.name.icontains(kw))

    return authors.all()

def update_author(author_id, name):
    author = get_author_by_id(author_id)

    if author:
        author.name = name
        db.session.commit()
        return author

    return None

def delete_author(author_id):
    author = get_author_by_id(author_id)

    if author:
        db.session.delete(author)
        db.session.commit()
        return True

    return False