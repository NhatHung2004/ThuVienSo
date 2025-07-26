from flask_restx import Resource
from flask_jwt_extended import jwt_required
from app.api_conf import comment_ns, comment_model, message_model
from app.dao import dao_comment

@comment_ns.route('/')
class CommentsList(Resource):
    @comment_ns.doc('get_comments')
    @comment_ns.marshal_list_with(comment_model)
    def get(self):
        """ Danh sách toàn bộ bình luận """
        comments = dao_comment.get_comments_list()

        if comments is None:
            return '', 404

        return comments, 200

@comment_ns.route('/<int:comment_id>')
class Comment(Resource):
    @comment_ns.doc('delete_comment')
    @comment_ns.marshal_with(message_model)
    @jwt_required()
    def delete(self, comment_id):
        """ Xoá bình luận theo ID """
        if dao_comment.delete_comments(comment_id):
            return '', 204

        return {"message": "Lỗi khi thực hiện xoá bình luận"}, 404

comment_ns.add_resource(CommentsList, '/')
comment_ns.add_resource(Comment, '/<int:comment_id>')
