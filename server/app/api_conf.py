from flask import Blueprint
from flask_restx import Api, fields, reqparse


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


# --- Định nghĩa Models cho Swagger UI ---
# Các model này mô tả cấu trúc dữ liệu cho request body và response.
# Chúng giúp Swagger UI hiển thị ví dụ dữ liệu và validate input.
user_model = api.model('User', {
    'id': fields.Integer(readOnly=True, description='ID duy nhất của người dùng'),
    'name': fields.String(required=True, description='Tên của người dùng'),
    'email': fields.String(required=True, description='Địa chỉ email của người dùng'),
})


# --- Định nghĩa Parsers cho Swagger UI ---
# Parsers được sử dụng để định nghĩa các tham số đầu vào (query params, form data)
# và giúp Swagger UI hiển thị các trường nhập liệu tương ứng.
user_creation_parser = reqparse.RequestParser()
user_creation_parser.add_argument('name', type=str, required=True, help='Tên người dùng là bắt buộc')
user_creation_parser.add_argument('email', type=str, required=True, help='Email người dùng là bắt buộc')
user_creation_parser.add_argument('password', type=str, required=True, help='Password người dùng là bắt buộc')

