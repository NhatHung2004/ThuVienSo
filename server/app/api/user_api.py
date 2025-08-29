from flask import request
from app.dao import dao_user, dao_cart, dao_request, dao_relative
from flask_restx import Resource
from app.api_conf import user_ns, user_model, user_creation_parser, message_model, user_parser, relative_model, create_relative_parser
from flask_jwt_extended import jwt_required
from cloudinary import uploader
from app.models import UserRole
from app.utils.check_role import role_required

@user_ns.route('/')
class UserList(Resource):
    @user_ns.doc('list_users')  # Mô tả operation cho Swagger UI
    @user_ns.marshal_list_with(user_model)  # Định nghĩa định dạng response khi trả về danh sách user
    @user_ns.expect(user_parser)
    @jwt_required()
    @role_required([UserRole.LIBRARIAN.value])
    def get(self):
        """Lấy danh sách tất cả người dùng, lấy theo username (query param)"""
        un = request.args.get('un')
        return dao_user.get_users_list(un=un)

    @user_ns.doc('create_user')
    @user_ns.expect(user_creation_parser)  # Định nghĩa định dạng request body cho Swagger UI
    @user_ns.marshal_with(user_model, code=201)  # Định nghĩa định dạng response và mã trạng thái khi tạo thành công
    def post(self):
        """Tạo một người dùng mới, dùng khi đăng ký tài khoản"""
        # Lấy dữ liệu từ request body thông qua parser đã định nghĩa
        args = user_creation_parser.parse_args()
        avatar = args['avatar']

        if avatar:
            res = uploader.upload(avatar)
            avatar = res["secure_url"]

        new_user = dao_user.create_user(
            args['username'],
            args['email'],
            args['password'],
            args['role'],
            avatar,
            args['firstname'], args['lastname']
        )

        if new_user:
            return new_user, 201

        return 500

@user_ns.route('/<int:user_id>')
@user_ns.param('user_id', 'ID của người dùng')
class User(Resource):
    @user_ns.doc('get_user')
    @user_ns.marshal_with(user_model)
    def get(self, user_id):
        '''Lấy thông tin một người dùng theo ID'''
        user = dao_user.get_user_by_id(user_id)
        if user:
            return user, 200
        return 404

    @user_ns.doc('delete_user')
    @user_ns.marshal_with(message_model)
    @jwt_required()
    @role_required([UserRole.LIBRARIAN.value])
    def delete(self, user_id):
        """ Xoá người dùng theo ID """
        user_to_delete = dao_user.get_user_by_id(user_id)

        if user_to_delete is None:
            return {"message": "Không tìn thấy người dùng"}, 404

        deleted = dao_user.delete_user(user_to_delete)

        if deleted:
            return '', 204

        return {"message": "Lỗi khi thực hiện xoá người dùng"}, 500

@user_ns.route('/<int:user_id>/requests')
class UserRequests(Resource):
    # @jwt_required()
    def get(self, user_id):
        """ Lấy request theo userId """
        res = dao_request.get_request_by_user_id(user_id)

        if res[0]["request_id"] is not None:
            return res, 200

        return res, 404

@user_ns.route('/<int:user_id>/cart')
class UserCartDetail(Resource):
    @jwt_required()
    def get(self, user_id):
        """ Lấy giỏ hàng của người dùng hiện tại """
        res = dao_cart.get_cart_by_user_id(user_id)

        if res['cart_id'] is None:
            return res, 404
        else:
            return res, 200

@user_ns.route('/<int:user_id>/relatives')
class UserRelatives(Resource):
    @user_ns.marshal_list_with(relative_model)
    @jwt_required()
    def get(self, user_id):
        """ Lấy danh sách người thân theo user_id """
        relative = dao_relative.get_relative_by_user_id(user_id)

        return (relative, 200) if relative else (None, 404)

    @user_ns.expect(create_relative_parser)
    @user_ns.marshal_with(relative_model)
    @jwt_required()
    def post(self, user_id):
        """ Tạo người thân theo user_id """
        args = create_relative_parser.parse_args()

        relative = dao_relative.create_relative(args['name'], args['phone'], args['relationship'], user_id)

        if relative:
            return relative, 201

        return None, 404

    @jwt_required()
    def delete(self, user_id):
        """ Xoá người thân """
        deleted = dao_relative.delete_relative_by_user_id(user_id)

        if deleted:
            return '', 204

        return None, 404


user_ns.add_resource(UserList, '/')
user_ns.add_resource(User, '/<int:user_id>')
user_ns.add_resource(UserRequests, '/<int:user_id>/requests')
user_ns.add_resource(UserCartDetail, '/<int:user_id>/cart')
user_ns.add_resource(UserRelatives, '/<int:user_id>/relatives')
