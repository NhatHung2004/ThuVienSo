from flask import Blueprint
from flask_restx import Api, fields, reqparse
from flask_jwt_extended.exceptions import NoAuthorizationError
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
stats_ns = api.namespace('stats', description='Các thao tác liên quan đến thống kê')
cart_ns = api.namespace('carts', description='Các thao tác liên quan đến giỏ hàng')
relative_ns = api.namespace('relatives', description='Các thao tác liên quan đến người thân')

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
    'average_rating': fields.Float(readOnly=True, description='Điểm đánh giá trung bình (1 đến 5)'),
    'created_at': fields.DateTime(readOnly=True, description='Ngày thêm sách'),
    'published_date': fields.DateTime(readOnly=True, description='Ngày xuất bản')
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
    'number_of_requests_day': fields.String(required=True, description='Số ngày mượn'),
    'borrowing_method': fields.String(required=True, description='Phương thức mượn'),
    'purpose': fields.String(required=True, description='Mục đích mượn'),
    'name': fields.String(required=True, description='Tên người mượn'),
    'phone': fields.String(required=True, description='Số điện thoại'),
    'cccd': fields.String(required=True, description='Căn cước công dân'),
    'job' : fields.String(required=True, description='Công việc'),
    'address': fields.String(required=True, description='Địa chỉ'),
    'ward': fields.String(required=True, description='Phường xã'),
    'province' : fields.String(required=True, description='Quận huyện'),
    'city' : fields.String(required=True, description='Thành phố'),
})

relative_model = api.model('Relative', {
    'id': fields.Integer(readOnly=True, description='ID duy nhất của người thân'),
    'name': fields.String(readOnly=True, description='Tên của người thân'),
    'phone': fields.String(readOnly=True, description='Số điện thoại của người thân'),
    'relationship': fields.String(readOnly=True, description='Mối quan hệ với người dùng'),
    'user_id': fields.Integer(required=True, description='ID người dùng'),
})

book_frequency_statistics_model = api.model('BookFrequencyStatistics', {
    'book_id': fields.Integer(readOnly=True),
    'book_title': fields.String(required=True),
    'total_borrow_quantity': fields.Integer(readOnly=True),
    'number_of_book_borrows': fields.Integer(readOnly=True),
})

general_stats_model = api.model('GeneralStats', {
    'total_of_books': fields.Integer(readOnly=True),
    'number_of_users': fields.Integer(readOnly=True),
    'average_rating': fields.Float(readOnly=True),
    'number_of_borrows': fields.Integer(readOnly=True),

})

category_stats_model = api.model('CategoryStats', {
    'cate_id': fields.Integer(readOnly=True),
    'cate_name': fields.String(readOnly=True),
    'total_of_books': fields.Integer(readOnly=True),
})

book_borrowing_stats_model = api.model('BookBorrowStats', {
    'month': fields.Integer(readOnly=True),
    'total_of_borrowing_books': fields.Integer(required=True),
    'total_of_returned_books': fields.Integer(readOnly=True),
    'total_of_accepted': fields.Integer(required=True),
    'total_of_rejected': fields.Integer(readOnly=True),
})

cart_model = api.model('Cart', {
    'id': fields.Integer(readOnly=True),
    'created_date': fields.DateTime(required=True),
    'user_id': fields.Integer(readOnly=True),
})

cart_detail_model = api.model('CartDetail', {
    'id': fields.Integer(readOnly=True),
    'book_id': fields.Integer(readOnly=True),
    'cart_id': fields.Integer(required=True),
    'quantity': fields.Integer(readOnly=True),
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
book_parser.add_argument('published_date', type=str, help='Ngày xuất bản', location='form')

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
request_creation_parser.add_argument('borrowing_method', type=str, help='Phương thức mượn')
request_creation_parser.add_argument('number_of_requests_day', type=int, help='Số ngày mượn mượn')
request_creation_parser.add_argument('purpose', type=str, help='Mục đích mượn')
request_creation_parser.add_argument('name', type=str, help='Tên người mượn')
request_creation_parser.add_argument('phone', type=str, help='Số điện thoại')
request_creation_parser.add_argument('cccd', type=str, help='Căn cước công dân')
request_creation_parser.add_argument('job', type=str, help='Công việc')
request_creation_parser.add_argument('address', type=str, help='Địa chỉ')
request_creation_parser.add_argument('ward', type=str, help='Phường, thị xã')
request_creation_parser.add_argument('province', type=str, help='Quận huyện')
request_creation_parser.add_argument('city', type=str, help='Thành phố')

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

''' Book frequency '''
book_frequency_statistics_parser = reqparse.RequestParser()
book_frequency_statistics_parser.add_argument('month', type=int, help='Tháng')

''' Create cart '''
create_cart_parser = reqparse.RequestParser()
create_cart_parser.add_argument('user_id', type=int, help='Id của người dùng hiện tại')
create_cart_parser.add_argument('book_id', type=int, help='Id của sách cần mượn')
create_cart_parser.add_argument('quantity', type=int, help='Số lượng sách mượn')

''' Update cart detail '''
update_cart_detail_parser = reqparse.RequestParser()
update_cart_detail_parser.add_argument('cart_id', type=int, help='Id của giỏ hàng')
update_cart_detail_parser.add_argument('book_id', type=int, help='Id của sách cần mượn')
update_cart_detail_parser.add_argument('quantity', type=int, help='Số lượng sách giảm')

''' Create relative '''
create_relative_parser = reqparse.RequestParser()
create_relative_parser.add_argument('name', type=str, help='Tên người thân')
create_relative_parser.add_argument('phone', type=str, help='Số điện thoại người thân')
create_relative_parser.add_argument('relationship', type=str, help='Mối quan hệ với người dùng')
