import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

load_dotenv()

def send_request_email(to_email, user_name, books, purpose, status="PENDING"):
    """
    Gửi email thông báo yêu cầu mượn sách qua SendGrid API.
    Hoạt động tốt trên Railway/Render (không bị chặn SMTP).
    """
    sender_email = "goihot85@gmail.com"  # email đã verify trong SendGrid
    api_key = os.getenv("SENDGRID_API_KEY")

    subject = "Thông báo yêu cầu mượn sách"
    book_list = "<br>".join(
        [f"+ Mã sách: {book['book_id']} - Số lượng: {book['quantity']}" for book in books]
    )

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

    message = Mail(
        from_email=sender_email,
        to_emails=to_email,
        subject=subject,
        html_content=html_content
    )

    try:
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        print(f"✅ Email sent: {response.status_code}")
    except Exception as e:
        print(f"❌ Error sending email: {e}")

