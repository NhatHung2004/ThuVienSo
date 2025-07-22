from datetime import datetime
from zoneinfo import ZoneInfo
from app.models import Request, RequestDetail, StatusCheck, Book
from app import db

def get_request_list(status=None):
    reqs = Request.query

    if status:
        reqs = reqs.filter_by(status=status)

    return reqs.all() or None

def get_request_by_id(request_id):
    return Request.query.get(request_id)

def request_to_borrow_books(user_id, books):
    request = Request(user_id=user_id)

    db.session.add(request)
    db.session.flush()  # Lấy borrow_request.id mà không cần commit

    for book in books:
        book_id = int(book.get('book_id'))
        quantity = int(book.get('quantity', 1))

        request_detail = RequestDetail(book_id=book_id, quantity=quantity, request_id=request.id)
        db.session.add(request_detail)

    db.session.commit()
    return request

def accept_request(request_id, librarian_id, returned_date):
    request = Request.query.get(request_id)
    now = datetime.now(ZoneInfo("Asia/Ho_Chi_Minh"))

    if returned_date:
        returned_date = returned_date.replace(tzinfo=ZoneInfo("Asia/Ho_Chi_Minh"))

    if returned_date is None or returned_date <= now:
        return None

    for detail in request.request_details:
        book = Book.query.get(detail.book_id)

        if book.quantity < detail.quantity:
            return None

    for detail in request.request_details:
        book = Book.query.get(detail.book_id)
        book.quantity -= detail.quantity

    request.status = StatusCheck.APPROVED
    request.librarian_id = librarian_id
    request.return_date = returned_date
    db.session.commit()

    return request

def decline_request(request_id, librarian_id):
    request = Request.query.get(request_id)

    if request is None:
        return None

    request.status = StatusCheck.REJECTED
    request.librarian_id = librarian_id

    db.session.commit()

    return request

def return_books(request_id):
    request = Request.query.get(request_id)

    for detail in request.request_details:
        book = Book.query.get(detail.book_id)
        book.quantity += detail.quantity

    request.status = StatusCheck.RETURNED

    db.session.commit()
    return request
