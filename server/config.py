import os
from dotenv import load_dotenv

# Tải các biến môi trường từ file .env
load_dotenv()

class Config:
    # Cấu hình cơ sở dữ liệu MySQL
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://root:{os.getenv('mysql_password')}@localhost:3306/thuvien?charset=utf8mb4"
    SQLALCHEMY_TRACK_MODIFICATIONS = False # Tắt tính năng theo dõi thay đổi của SQLAlchemy (tiết kiệm tài nguyên)