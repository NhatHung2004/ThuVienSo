from sqlalchemy import func, extract, literal, case
from app import db
from app.models import Book, Request, RequestDetail, User, UserRole, Category, StatusCheck


def book_frequency_stats(year_param=2025, month_param=None):
    query = (
        db.session.query(
            Book.id.label('book_id'),
            Book.title.label('book_title'),
            func.coalesce(func.sum(RequestDetail.quantity), 0).label('total_borrow_quantity'),
            func.count(RequestDetail.book_id).label('number_of_book_borrows')
        )
        .join(RequestDetail, Book.id == RequestDetail.book_id)
        .join(Request, RequestDetail.request_id == Request.id)
        .filter(
            extract('year', Request.request_date) == year_param,
            Request.status == StatusCheck.APPROVED.value
        )
    )

    if month_param:
        query = query.filter(extract('month', Request.request_date) == month_param)

    return query.group_by(Book.id, Book.title).order_by(func.sum(RequestDetail.quantity).desc()).all()

def general_stats():
    total_books = db.session.query(func.sum(Book.quantity)).scalar()
    number_of_users = db.session.query(func.count(User.id)).filter(User.role == UserRole.READER.value).scalar()
    average_rating = db.session.query(func.avg(Book.average_rating)).scalar()
    number_of_borrows = db.session.query(func.sum(RequestDetail.quantity)).scalar()

    return {
        "total_of_books": total_books,
        "number_of_users": number_of_users,
        "average_rating": average_rating,
        "number_of_borrows": number_of_borrows,
    }

def category_stats():
    query = (db.session.query(
        Category.id.label('cate_id'),
        Category.name.label('cate_name'),
        func.coalesce(func.sum(Book.quantity), 0).label('total_of_books'),
    )).outerjoin(Book, Category.id == Book.category_id)

    return query.group_by(Category.id, Category.name).all()

def book_borrowing_stats(month_param, year_param=2025):
    if month_param is None:
        return None

    query = (
        db.session.query(
            literal(month_param).label("month"),

            # tổng sách đang mượn
            func.coalesce(
                func.sum(
                    case((Request.status == StatusCheck.APPROVED.value, RequestDetail.quantity), else_=0)
                ),
                0
            ).label('total_of_borrowing_books'),

            # tổng sách đã trả
            func.coalesce(
                func.sum(
                    case((Request.status == StatusCheck.RETURNED.value, RequestDetail.quantity), else_=0)
                ),
                0
            ).label('total_of_returned_books'),

            # tổng accepted = APPROVED + RETURNED
            func.coalesce(
                func.sum(
                    case(
                        (Request.status.in_([StatusCheck.APPROVED, StatusCheck.RETURNED]), 1),
                        else_=0
                    )
                )
            ).label('total_of_accepted'),

            # tổng rejected
            func.coalesce(
                func.sum(
                    case(
                        (Request.status == StatusCheck.REJECTED.value, 1),
                        else_=0
                    )
                )
            ).label('total_of_rejected'),
        )
        .join(Request, RequestDetail.request_id == Request.id)
        .filter(extract('year', Request.request_date) == year_param)
    )

    if month_param:
        query = query.filter(extract('month', Request.request_date) == month_param)

    return query.all()
