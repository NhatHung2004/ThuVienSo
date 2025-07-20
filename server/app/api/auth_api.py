from flask import jsonify
from flask_restx import Resource
from app.api_conf import auth_ns, auth_parser
from app.dao import dao_user
from flask_jwt_extended import create_access_token, create_refresh_token

@auth_ns.route("/login")
class Login(Resource):
    @auth_ns.doc('login_user')
    @auth_ns.expect(auth_parser)
    def post(self):
        """ Đăng nhập """
        args = auth_parser.parse_args()
        username = args['username']
        password = args['password']
        user = dao_user.login(username, password)

        if user is None:
            return jsonify({"msg": "Bad username or password"}), 401

        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return jsonify({"user_id": user.id, "access_token": access_token, "refresh_token": refresh_token})

auth_ns.add_resource(Login, "/login")
