from sqlalchemy import func, extract
from app import db
from app.models import Book, Request, RequestDetail

def book_frequency_stats(year_param=2025, month_param=None):
    query = (db.session.query(
        Book.id.label('book_id'),
        Book.title.label('book_title'),
        func.sum(RequestDetail.quantity).label('total_borrow_quantity'),
        func.count(RequestDetail.book_id).label('number_of_borrows')
    ).join(RequestDetail, Book.id == RequestDetail.book_id).join(Request, RequestDetail.request_id == Request.id)
             .filter(extract('year', Request.request_date) == year_param))

    if month_param:
        query = query.filter(extract('month', Request.request_date) == month_param)

    return query.group_by(Book.id, Book.title).order_by(func.sum(RequestDetail.quantity).desc()).all()
