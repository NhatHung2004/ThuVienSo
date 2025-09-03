import os
from dotenv import load_dotenv
import cloudinary
from datetime import timedelta
# Tải các biến môi trường từ file .env
load_dotenv()

class Config:
    # Cấu hình cơ sở dữ liệu MySQL
    SQLALCHEMY_DATABASE_URI = (os.environ.get("DATABASE_URL") or
                               f"mysql+pymysql://root:{os.getenv('MYSQL_PASSWORD')}@localhost:3306/thuvien?charset=utf8mb4")
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    SECRET_KEY = os.getenv('SECRET_KEY')

    cloudinary.config(
        cloud_name=os.getenv("CLOUD_NAME"),
        api_key=os.getenv("API_KEY"),
        api_secret=os.getenv("API_SECRET"),
        secure=True
    )
