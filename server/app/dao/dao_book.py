from app.models import Book, Category, Author, Comment
from app import db
from sqlalchemy import func

def get_book_by_id(book_id):
    return Book.query.get(book_id)

def delete_book_by_id(book_id):
    book = get_book_by_id(book_id)

    if book is None:
        return False

    db.session.delete(book)
    db.session.commit()
    return True

def get_books_list(kw=None, category_id=None):
    books = Book.query

    if kw:
        books = books.filter(Book.title.icontains(kw))
    if category_id:
        books = books.filter(Book.category_id.__eq__(category_id))

    query = books.all()

    return query if query else None

def add_book(title, description, image, quantity, author, category, published_date):
    au = Author.query.filter(Author.name.__eq__(author)).first()
    cate = Category.query.filter(Category.name.__eq__(category)).first()

    if not au:
        au = Author(name=author)
        db.session.add(au)

    book = Book(title=title, description=description, image=image, quantity=quantity, author=au, category=cate, published_date=published_date)
    db.session.add(book)
    db.session.commit()
    return book

def update_book(book_id, data_to_update):
    book = get_book_by_id(book_id)

    if book is None:
        return None

    for key, value in data_to_update.items():
        if hasattr(book, key) and value is not None:
            setattr(book, key, value)

    db.session.commit()
    return book

def update_book_rating(book_id):
    avg_rating = db.session.query(func.avg(Comment.rating))\
        .filter(Comment.book_id == book_id).scalar() or 0.0

    book = Book.query.get(book_id)
    book.average_rating = round(avg_rating, 2)
    db.session.commit()

    return book

def add_comment(content, book_id, current_user_id, rating):
    c = Comment(content=content, book_id=book_id, user_id=current_user_id, rating=rating)
    db.session.add(c)
    db.session.commit()
    return c

def get_comments_by_book_id(book_id):
    c = Comment.query.filter(Comment.book_id == book_id).all()

    if c is None:
        return None

    return c
