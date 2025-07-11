from flask import Blueprint, jsonify
from flask_restx import Api, fields, reqparse
from flask_jwt_extended.exceptions import NoAuthorizationError

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
    'avatar': fields.String(required=True, description='Ảnh của người dùng')
})

message_model = api.model('Message', {
    "message": fields.String(readOnly=True, description='Thông báo trả về')
})

# --- Định nghĩa Parsers cho Swagger UI ---
# Parsers được sử dụng để định nghĩa các tham số đầu vào (query params, form data)
# và giúp Swagger UI hiển thị các trường nhập liệu tương ứng.

user_creation_parser = reqparse.RequestParser()
user_creation_parser.add_argument('username', type=str, required=True, help='Tên người dùng là bắt buộc')
user_creation_parser.add_argument('email', type=str, required=True, help='Email người dùng là bắt buộc')
user_creation_parser.add_argument('password', type=str, required=True, help='Password người dùng là bắt buộc')
user_creation_parser.add_argument('firstname', type=str, required=False, help='Tên (không bắt buộc)')
user_creation_parser.add_argument('lastname', type=str, required=False, help='Họ (không bắt buộc)')
user_creation_parser.add_argument('role', type=str, required=False, help='Quyền (không bắt buộc)')

auth_parser = reqparse.RequestParser()
auth_parser.add_argument('username', type=str, required=True, help='Tên người dùng')
auth_parser.add_argument('password', type=str, required=True, help='Mật khẩu')

