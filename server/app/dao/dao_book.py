from app.models import Book, Category, Author
from app import db

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

    return books.all()

def add_book(title, description, image, quantity, author, category):
    au = Author.query.filter(Author.name.__eq__(author)).first()
    cate = Category.query.filter(Category.name.__eq__(category)).first()

    if not au:
        au = Author(name=author)
        db.session.add(au)

    book = Book(title=title, description=description, image=image, quantity=quantity, author=au, category=cate)
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

# def update_book(book_id, title=None, description=None, image=None, quantity=None, author=None, category=None):
#     book = Book.query.get(book_id)
#
#     if book is None:
#         return False
#
#     if title:
#         book.title = title
#
#     if description:
#         book.description = description
#
#     if image:
#         book.image = image
#
#     if quantity:
#         book.quantity = quantity
#
#     if author:
#         au = Author.query.filter(Author.name.__eq__(author)).first()
#         book.author = au
#
#     if category:
#         cate = Category.query.filter(Category.name.__eq__(category)).first()
#         book.category = cate
#
#     db.session.commit()
#     return True
