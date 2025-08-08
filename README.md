# Thư viện số

Đây là ứng dụng web với kiến trúc client-server:
- Client (Frontend): Được xây dựng bằng React, sử dụng Vite để phát triển và đóng gói ứng dụng. Giao diện người dùng được thiết kế hiện đại với Tailwind CSS và các thư viện UI như Material Tailwind và Headless UI.
- Server (Backend): API được phát triển bằng Flask với các tính năng RESTful nhờ Flask-RestX và Flask-CORS. Server sử dụng SQLAlchemy làm ORM để quản lý cơ sở dữ liệu MySQL, tích hợp xác thực với Flask-JWT-Extended và cung cấp giao diện quản trị với Flask-Admin.
## Các tính năng nổi bật

Client (Frontend):
- Công nghệ: React, Vite, Tailwind CSS
- Giao diện: Sử dụng các thư viện UI như Material Tailwind, Headless UI, và Heroicons để xây dựng giao diện người dùng
- Quản lý state: Tương tác với API backend thông qua Axios
- Cookies: Quản lý cookies với react-cookies và react-use-cookie
- Điều hướng: Sử dụng React Router DOM để quản lý các route trong ứng dụng
Server (Backend)
- Framework: Flask
- RESTful API: Xây dựng API mạnh mẽ với Flask-RestX
- Cơ sở dữ liệu: Sử dụng SQLAlchemy làm ORM để kết nối với cơ sở dữ liệu MySQL
- Xác thực: Bảo mật API với Flask-JWT-Extended để tạo và xác thực các JSON Web Tokens (JWT).
- Migrations: Quản lý phiên bản cơ sở dữ liệu với Flask-Migrate.
- Triển khai: Triển khai production với Gunicorn.
- Lưu trữ cloud: Tích hợp Cloudinary để quản lý lưu trữ media


## Cài đặt và chạy local
1.Backend
- Môi trường ảo

```bash
  cd server
  # Tạo môi trường ảo
  cd app
  python -m venv venv

  # Kích hoạt môi trường ảo
  # Trên Windows
  venv\Scripts\activate
  # Trên macOS/Linux
  source venv/bin/activate
```

- Cài đặt các thư viện
```bash
  pip install -r requirements.txt
```

- Tạo một file .env trong thư mục server và thêm các biến môi trường cần thiết:

```bash
  MYSQL_PASSWORD=your-password
  CLOUDINARY_NAME=your-cloud-name
  CLOUD_API_KEY=your-api-key
  CLOUD_API_SECRET=your-secret-key
  JWT_SECRET_KEY=your-jwt-secret-key
  SECRET_KEY=your-secret-key
```

4.Chạy dự án
```bash
  # Tạo db thuvien trong workbench
  # Tạo dữ liệu mẫu
  flask db migrate
  flask db upgrade
  # Chạy dự án
  python run.py
```

2.Frontend
- Cài đặt dependencies
```bash
  cd client
  npm install
```

- Tạo một file .env trong thư mục client để cấu hình URL của backend API:

```bash
  BASE_URL=your_backend_url
```

- Chạy client:

```bash
  npm run dev
```
    