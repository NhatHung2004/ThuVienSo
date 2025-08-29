from app.models import User


def get_email_by_userid(user_id):
    user = User.query.get(user_id)
    if not user:
        return None
    return user.email
