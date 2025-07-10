# from flask_restx import Resource
# from app.api import user_ns, user_model, user_creation_parser
# import app.dao as dao
#
#
# # Định nghĩa Resource cho danh sách người dùng (GET, POST)
# @user_ns.route('/')
# class UserList(Resource):
#     '''Hiển thị danh sách tất cả người dùng, và cho phép POST để thêm người dùng mới'''
#     @user_ns.doc('list_users') # Mô tả operation cho Swagger UI
#     @user_ns.marshal_list_with(user_model) # Định nghĩa định dạng response khi trả về danh sách user
#     def get(self):
#         '''Lấy danh sách tất cả người dùng'''
#         return dao.get_users_list()
#
#     @user_ns.doc('create_user')
#     @user_ns.expect(user_creation_parser)  # Định nghĩa định dạng request body cho Swagger UI
#     @user_ns.marshal_with(user_model, code=201)  # Định nghĩa định dạng response và mã trạng thái khi tạo thành công
#     def post(self):
#         '''Tạo một người dùng mới'''
#         # Lấy dữ liệu từ request body thông qua parser đã định nghĩa
#         args = user_creation_parser.parse_args()
#         new_user = dao.create_user(args['name'], args['email'], args['password'])
#
#         if new_user:
#             return new_user, 201
#
#         return 500
#
#
# '''Định nghĩa Resource cho một người dùng cụ thể (GET, DELETE)'''
# @user_ns.route('/<int:user_id>') # Liên kết với namespace 'users' và route '/<id>'
# @user_ns.param('id', 'ID của người dùng') # Mô tả tham số URL cho Swagger UI
# @user_ns.response(404, 'Người dùng không tìm thấy') # Mô tả phản hồi lỗi 404
# class User(Resource):
#     '''Hiển thị một người dùng cụ thể, và cho phép xóa người dùng đó'''
#
#     @user_ns.doc('get_user')
#     @user_ns.marshal_with(user_model)
#     def get(self, user_id):
#         '''Lấy thông tin một người dùng theo ID'''
#         user = dao.get_user_by_id(user_id)
#         if user:
#             return user, 200
#         return 404
#
#     # @user_ns.doc('delete_user')
#     # @user_ns.response(204, 'Người dùng đã được xóa thành công')
#     # def delete(self, id):
#     #     '''Xóa một người dùng theo ID'''
#     #     if id not in users:
#     #         api.abort(404, f"Người dùng với ID {id} không tồn tại")
#     #     del users[id]
#     #     return '', 204
#
#
# user_ns.add_resource(UserList, '/')
# user_ns.add_resource(User, '/<int:id>')
#
