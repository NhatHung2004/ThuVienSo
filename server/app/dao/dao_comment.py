from app.models import Comment
from app import db

def get_comments_list():
    comments = Comment.query.all()

    if comments is None:
        return None

    return comments

def delete_comments(comment_id):
    comment = Comment.query.filter(Comment.id == comment_id).first()

    if comment is None:
        return False

    db.session.delete(comment)
    db.session.commit()
    return True