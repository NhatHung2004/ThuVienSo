from datetime import datetime
from zoneinfo import ZoneInfo
from app.models import Request, RequestDetail, StatusCheck, Book
from app import db

def get_request_list(status=None):
    query = Request.query.options(
        db.joinedload(Request.request_details).joinedload(RequestDetail.book),
    )

    if status:
        query = query.filter(Request.status == status)

    requests = query.all()

    requests_data = []
    for req in requests:
        book_list = []
        for detail in req.request_details:
            book_list.append({
                'book_id': detail.book.id,
                'quantity': detail.quantity,
            })

        requests_data.append({
            'id': req.id,
            'status': req.status.value,
            'request_date': req.request_date.isoformat(),
            'return_date': req.return_date.isoformat() if req.return_date else None,
            'user_id': req.user_id,
            'librarian_id': req.librarian_id,
            'books': book_list,
        })
    return requests_data

def get_request_by_id(request_id):
    return Request.query.get(request_id)



def get_request_by_user_id(user_id):
    request = Request.query.filter_by(user_id=user_id).first()

    if request:
        request_detail = RequestDetail.query.filter_by(request_id=request.id).all()

        if request_detail:
            books_data = []
            for req in request_detail:
                books_data.append({
                    "book_id": req.book_id,
                    "quantity": req.quantity,
                })

            return {
                "user_id": user_id,
                "request_id": request.id,
                "books": books_data,
                "request_date": request.request_date.isoformat(),
                "return_date": request.return_date.isoformat(),
                "status": request.status.value,
                "librarian_id": request.librarian_id,
            }

    return {
        "request_id": None,
        "message": "Request not found",
    }

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
