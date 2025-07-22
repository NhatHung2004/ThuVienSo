from flask import Blueprint
from flask_restx import Api, fields, reqparse
from flask_jwt_extended.exceptions import NoAuthorizationError
from werkzeug.exceptions import NotFound
from werkzeug.datastructures import FileStorage

# Tạo một Blueprint cho API. Blueprint này sẽ được đăng ký với ứng dụng Flask chính.
# url_prefix='/api' có nghĩa là tất cả các endpoint trong Blueprint này sẽ có tiền tố /api.
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Khởi tạo Api từ Flask-RESTX.
# Tham số 'doc' chỉ định đường dẫn để truy cập Swagger UI.
api = Api(
    api_bp,
    version='1.0',
    title='API Thư viện số',
    description='Quản lý API với tài liệu Swagger UI.',
    doc='/swagger-ui/' # Đường dẫn để truy cập Swagger UI (ví dụ: /api/swagger-ui/)
)

# Định nghĩa các Namespaces. Namespaces giúp nhóm các tài nguyên (endpoints) liên quan lại với nhau.
# Điều này làm cho tài liệu Swagger UI có cấu trúc rõ ràng hơn.
user_ns = api.namespace('users', description='Các thao tác liên quan đến người dùng')
auth_ns = api.namespace('auth', description='Các thao tác liên quan đến chứng thực người dùng')
category_ns = api.namespace('categories', description='Các thao tác liên quan đến thể loại sách')
book_ns = api.namespace('books', description='Các thao tác liên quan đến sách')
comment_ns = api.namespace('comments', description='Các thao tác liên quan đến bình luận sách')
author_ns = api.namespace('authors', description='Các thao tác liên quan đến tác giả')
request_ns = api.namespace('requests', description='Các thao tác liên quan đến mượn trả sách')

@api.errorhandler(NoAuthorizationError)
def handle_no_authorization_error(error):
    return {"message": str(error)}, 401

# --- Định nghĩa Models cho Swagger UI ---
# Các model này mô tả cấu trúc dữ liệu cho response.
# Chúng giúp Swagger UI hiển thị ví dụ dữ liệu và validate input.
user_model = api.model('User', {
    'id': fields.Integer(readOnly=True, description='ID duy nhất của người dùng'),
    'username': fields.String(required=True, description='Tên tài khoản của người dùng'),
    'email': fields.String(required=True, description='Địa chỉ email của người dùng'),
    'firstname': fields.String(required=True, description='Tên của người dùng'),
    'lastname': fields.String(required=True, description='Họ của người dùng'),
    'avatar': fields.String(required=True, description='Ảnh của người dùng'),
    'role': fields.String(required=True, description='Vai trò của người dùng')
})

message_model = api.model('Message', {
    "message": fields.String(readOnly=True, description='Thông báo trả về')
})

category_model = api.model('Category', {
    'id': fields.Integer(readOnly=True, description='ID duy nhất của thể loại'),
    'name': fields.String(required=True, description='Tên thể loại'),
})

book_model = api.model('Book', {
    'id': fields.Integer(readOnly=True, description='ID duy nhất của sách'),
    'title': fields.String(required=True, description='Tên sách'),
    'description': fields.String(required=True, description='Mô tả sách'),
    'image': fields.String(required=True, description='Ảnh sách'),
    'quantity': fields.Integer(required=True, description='Số lượng sách'),
    'author_id': fields.Integer(required=True, description='Tác giả'),
    'category_id': fields.Integer(required=True, description='Thể loại'),
    'average_rating': fields.Float(readOnly=True, description='Điểm đánh giá trung bình (1 đến 5)')
})

comment_model = api.model('Comment', {
    'id': fields.Integer(readOnly=True, description='ID duy nhất của bình luận'),
    'content': fields.String(required=True, description='Nội dung bình luận'),
    'rating': fields.Integer(required=True, description='Đánh giá'),
    'book_id': fields.Integer(required=True, description='Mã sách'),
    'user_id': fields.Integer(required=True, description='Người bình luận'),
    'created_date': fields.DateTime(required=True, description='Ngày bình luận')
})

author_model = api.model('Author', {
    'id': fields.Integer(readOnly=True, description='ID duy nhất của tác giả'),
    'name': fields.String(required=True, description='Tên tác giả'),
})

request_model = api.model('Request', {
    'id': fields.Integer(readOnly=True, description='ID duy nhất của yêu cầu'),
    'status': fields.String(required=True, description='Trạng thái yêu cầu'),
    'request_date': fields.DateTime(required=True, description='Ngày tạo yêu cầu'),
    'return_date': fields.DateTime(required=True, description='Ngày trả sách'),
    'user_id': fields.Integer(required=True, description='ID người mượn'),
    'librarian_id': fields.Integer(required=True, description='ID thủ thư duyệt'),
})

# --- Định nghĩa Parsers cho Swagger UI ---
# Parsers được sử dụng để định nghĩa các tham số đầu vào (query params, form data)
# và giúp Swagger UI hiển thị các trường nhập liệu tương ứng.

''' USER '''
user_creation_parser = reqparse.RequestParser()
user_creation_parser.add_argument('username', type=str, required=True, help='Tên người dùng là bắt buộc', location='form')
user_creation_parser.add_argument('email', type=str, required=True, help='Email người dùng là bắt buộc', location='form')
user_creation_parser.add_argument('password', type=str, required=True, help='Password người dùng là bắt buộc', location='form')
user_creation_parser.add_argument('firstname', type=str, required=False, help='Tên (không bắt buộc)', location='form')
user_creation_parser.add_argument('lastname', type=str, required=False, help='Họ (không bắt buộc)', location='form')
user_creation_parser.add_argument('role', type=str, required=False, help='Quyền (không bắt buộc)', location='form')
user_creation_parser.add_argument('avatar', type=FileStorage, required=False, help='Ảnh (không bắt buộc)', location='files')

''' GET USER '''
user_parser = reqparse.RequestParser()
user_parser.add_argument('un', type=str, location='args', help='Tìm kiếm theo username')

''' GET CATEGORY '''
get_category_parser = reqparse.RequestParser()
get_category_parser.add_argument('kw', type=str, location='args', help='Tìm kiếm theo name')

''' AUTH '''
auth_parser = reqparse.RequestParser()
auth_parser.add_argument('username', type=str, required=True, help='Tên người dùng')
auth_parser.add_argument('password', type=str, required=True, help='Mật khẩu')

''' CATEGORY '''
category_parser = reqparse.RequestParser()
category_parser.add_argument('name', type=str, required=True, help="Tên thể loại")

''' BOOK '''
book_parser = reqparse.RequestParser()
book_parser.add_argument('title', type=str, required=True, help='Tên sách', location='form')
book_parser.add_argument('description', type=str, required=True, help='Mô tả sách', location='form')
book_parser.add_argument('image', type=FileStorage, required=False, help='Ảnh sách', location='files')
book_parser.add_argument('quantity', type=int, required=True, help='Số lượng', location='form')
book_parser.add_argument('author', type=str, required=True, help='Tác giả', location='form')
book_parser.add_argument('category', type=str, required=True, help='Loại sách', location='form')

''' UPDATED BOOK '''
book_update_parser = reqparse.RequestParser()
book_update_parser.add_argument('title', type=str, help='Tên sách', location='form')
book_update_parser.add_argument('description', type=str, help='Mô tả sách', location='form')
book_update_parser.add_argument('image', type=FileStorage, help='Ảnh sách', location='files')
book_update_parser.add_argument('quantity', type=int, help='Số lượng', location='form')
book_update_parser.add_argument('author', type=str, help='Tác giả', location='form')
book_update_parser.add_argument('category', type=str, help='Loại sách', location='form')

''' Comment '''
comment_parser = reqparse.RequestParser()
comment_parser.add_argument('content', required=True, type=str, help='Bình luận')
comment_parser.add_argument('user_id', required=True, type=int, help='Người bình luận')
comment_parser.add_argument('rating', type=int, help='Đánh giá sao')

''' Author '''
author_parser = reqparse.RequestParser()
author_parser.add_argument('name', type=str, required=True, help='Tên tác giả')

''' Get author '''
get_author_parser = reqparse.RequestParser()
get_author_parser.add_argument('name', location='args', type=str, help='Tên tác giả')

''' Create request '''
request_creation_parser = reqparse.RequestParser()
request_creation_parser.add_argument('user_id', type=str, help='Người mượn sách')
request_creation_parser.add_argument('books', type=list, help='Danh sách sách cần mượn')

''' Accept request '''
accepted_request_parser = reqparse.RequestParser()
accepted_request_parser.add_argument('librarian_id', type=int, required=True, help='ID thủ thư duyệt yêu cầu')
accepted_request_parser.add_argument('returned_date', type=str, required=True, help='Ngày trả sách')

''' Decline request '''
decline_request_parser = reqparse.RequestParser()
decline_request_parser.add_argument('librarian_id', type=int, required=True, help='ID thủ thư duyệt yêu cầu')

''' Get request '''
get_request_parser = reqparse.RequestParser()
get_request_parser.add_argument('status', type=str, location='args', help='Trạng thái yêu cầu')
