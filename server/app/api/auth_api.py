from flask import jsonify, request
from flask_restx import Resource
from app.api_conf import auth_ns, auth_parser
from app.dao import dao_user
from flask_jwt_extended import create_access_token, create_refresh_token
from google.auth.transport import requests
from google.oauth2 import id_token
import jwt, datetime

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

        access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role.value})
        refresh_token = create_refresh_token(identity=str(user.id))

        return jsonify({"user_id": user.id, "access_token": access_token, "refresh_token": refresh_token})

@auth_ns.route("/google")
class Google(Resource):
    @auth_ns.doc('google_user')
    def post(self):
        data = request.json
        token = data.get("id_token")

        try:
            # Xác minh Google ID Token
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                "209089798443-09kgms3tt0o9cais2gd9trntcuevti8p.apps.googleusercontent.com"
            )

            # Lấy thông tin user từ Google
            email = idinfo["email"]
            firstname = idinfo.get("given_name", "")
            lastname = idinfo.get("family_name", "")
            password = idinfo["sub"]  # có thể random hash thay vì sub
            name = idinfo.get("name", email)

            # Kiểm tra user có trong DB chưa, nếu chưa thì tạo mới
            user = dao_user.get_by_email(email)
            if not user:
                user = dao_user.create_user(
                    username=name,
                    email=email,
                    password=password,
                    firstname=firstname,
                    lastname=lastname
                )

            # Tạo JWT nội bộ bằng flask_jwt_extended
            access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role.value})
            refresh_token = create_refresh_token(identity=str(user.id))

            return {
                "user_id": user.id,
                "access_token": access_token,
                "refresh_token": refresh_token
            }

        except ValueError as e:
            # Token Google không hợp lệ
            print("Google Token Error:", e)
            return {"error": "Invalid Google token"}, 400
        except Exception as e:
            print("Unexpected Error:", e)
            return {"error": "Server error"}, 500

auth_ns.add_resource(Login, "/login")
auth_ns.add_resource(Google, "/google")
