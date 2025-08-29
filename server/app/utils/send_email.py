import os
import smtplib
import ssl
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

def send_request_email(to_email, user_name, books, purpose, status="PENDING"):
    """
    Gửi email thông báo yêu cầu mượn sách qua SMTP SendGrid.
    Chạy được trên môi trường có SSL self-signed.
    """
    sender_email = "goihot85@gmail.com"  # Sender phải verified trên SendGrid
    password = os.getenv("SENDGRID_API_KEY")  # API key SendGrid

    subject = "Thông báo yêu cầu mượn sách"
    book_list = "<br>".join([f"+ Mã sách: {book['book_id']} - Số lượng: {book['quantity']}" for book in books])

    html_content = f"""
    <p>Xin chào {user_name},</p>
    <p>Yêu cầu mượn sách của bạn đã được ghi nhận:</p>
    <p><b>Sách mượn:</b></p>
    <p>{book_list}</p>
    <p><b>Mục đích:</b> {purpose}</p>
    <p><b>Trạng thái:</b> {status}</p>
    <p>Chúng tôi sẽ xử lý và phản hồi sớm nhất.</p>
    <p>-- Thư viện Online --</p>
    """

    # Tạo message MIME
    message = MIMEText(html_content, "html")
    message["Subject"] = subject
    message["From"] = sender_email
    message["To"] = to_email

    # Tạo context SSL, bỏ verify certificate (chỉ tạm thời để bypass self-signed)
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE

    try:
        # Kết nối SMTP SendGrid
        with smtplib.SMTP("smtp.sendgrid.net", 587) as server:
            server.starttls(context=context)
            server.login("apikey", password)
            server.sendmail(sender_email, to_email, message.as_string())
        print("Email sent successfully!")
    except Exception as e:
        print(f"Error sending email: {e}")
