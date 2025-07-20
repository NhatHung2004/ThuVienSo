from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import Config

from flask_cors import CORS


db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cors = CORS()

def create_app():
    """
    Tạo và cấu hình ứng dụng Flask.
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    

    # Khởi tạo SQLAlchemy và Migrate với app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    # Import và đăng ký Blueprint API
    # Chúng ta import api_bp từ app.api để đăng ký nó với ứng dụng Flask
    from .api_conf import api_bp
    app.register_blueprint(api_bp)

    # Quan trọng: Import routes ở đây để đảm bảo các lớp Resource
    # được định nghĩa và đăng ký với Flask-RESTX Api instance.
    # Nếu không import, Flask-RESTX sẽ không "thấy" các Resource này.
    from app.api import user_api, auth_api, book_api, category_api, comment_api, author_api

    # Import models để SQLAlchemy biết các model của bạn
    from app import models

    return app
