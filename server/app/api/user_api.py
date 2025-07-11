from app.dao import dao_user
from flask_restx import Resource
from app.api_conf import user_ns, user_model, user_creation_parser, message_model
from flask_jwt_extended import jwt_required

'''Định nghĩa Resource cho danh sách người dùng (GET, POST)'''
@user_ns.route('/')
class UserList(Resource):
    @user_ns.doc('list_users')  # Mô tả operation cho Swagger UI
    @user_ns.marshal_list_with(user_model)  # Định nghĩa định dạng response khi trả về danh sách user
    @jwt_required()
    def get(self):
        '''Lấy danh sách tất cả người dùng'''
        return dao_user.get_users_list()

    @user_ns.doc('create_user')
    @user_ns.expect(user_creation_parser)  # Định nghĩa định dạng request body cho Swagger UI
    @user_ns.marshal_with(user_model, code=201)  # Định nghĩa định dạng response và mã trạng thái khi tạo thành công
    def post(self):
        '''Tạo một người dùng mới'''
        # Lấy dữ liệu từ request body thông qua parser đã định nghĩa
        args = user_creation_parser.parse_args()

        new_user = dao_user.create_user(
            args['username'],
            args['email'],
            args['password'],
            args['role'],
            None,
            args['firstname'], args['lastname']
        )

        if new_user:
            return new_user, 201

        return 500

'''Định nghĩa Resource cho một người dùng cụ thể (GET, DELETE)'''
@user_ns.route('/<int:user_id>') # Liên kết với namespace 'users' và route '/<id>'
@user_ns.param('user_id', 'ID của người dùng') # Mô tả tham số URL cho Swagger UI
class User(Resource):
    '''Hiển thị một người dùng cụ thể, và cho phép xóa người dùng đó'''

    @user_ns.doc('get_user')
    @user_ns.marshal_with(user_model)
    @jwt_required()
    def get(self, user_id):
        '''Lấy thông tin một người dùng theo ID'''
        user = dao_user.get_user_by_id(user_id)
        if user:
            return user, 200
        return 404

    @user_ns.doc('delete_user')
    @user_ns.marshal_with(message_model)
    @jwt_required()
    def delete(self, user_id):
        ''' Xoá người dùng theo ID '''
        user_to_delete = dao_user.get_user_by_id(user_id)

        if user_to_delete is None:
            return {"message": "Không tìn thấy người dùng"}, 404

        deleted = dao_user.delete_user(user_to_delete)

        if deleted:
            return '', 204

        return {"message": "Lỗi khi thực hiện xáo người dùng"}, 500


user_ns.add_resource(UserList, '/')
user_ns.add_resource(User, '/<int:user_id>')
