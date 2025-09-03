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
            # Xác minh với Google
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), "209089798443-09kgms3tt0o9cais2gd9trntcuevti8p.apps.googleusercontent.com")

            # Lấy thông tin user
            email = idinfo["email"]
            firstname = idinfo['given_name']
            lastname = idinfo['family_name']
            password = idinfo['sub']
            name = idinfo['name']

            # Tạo JWT cho hệ thống
            payload = {
                "sub": email,
                "name": name,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            }
            access_token = jwt.encode(payload, 'ad67c41c42cf3b6b45f4d9ebc8c2f69a3e1df23000bb0f93d84c0b33a94f0ee0', algorithm="HS256")
            if isinstance(access_token, bytes):
                access_token = access_token.decode("utf-8")
            user = dao_user.create_user(username=name, email=email, password=password, firstname=firstname, lastname=lastname)

            return {"access_token": access_token, "user_id": user.id}

        except Exception as e:
            print(e)
            return {"error": "Invalid token"}, 400

auth_ns.add_resource(Login, "/login")
auth_ns.add_resource(Google, "/google")
