from app.api_conf import (book_ns, book_parser, book_model, message_model,
                          book_update_parser, comment_parser, comment_model)
from flask_restx import Resource
from flask_jwt_extended import jwt_required
from app.dao import dao_book
from flask import request
from cloudinary import uploader
from flask_cors import CORS


@book_ns.route('/')
class BooksList(Resource):
    @book_ns.doc('get_book_list')
    @book_ns.marshal_list_with(book_model)
    @jwt_required()
    def get(self):
        """Lấy danh sách tất cả sách"""
        kw = request.args.get('kw')
        category_id = request.args.get('category_id')
        books = dao_book.get_books_list(kw, category_id)

        if books is None:
            return '', 404

        return books, 200

    @book_ns.expect(book_parser)
    @book_ns.marshal_with(book_model)
    @jwt_required()
    def post(self):
        """ Thêm sách mới """
        args = book_parser.parse_args()

        image = args['image']

        if image:
            res = uploader.upload(image)
            args['image'] = res['secure_url']

        book = dao_book.add_book(**args)

        if book:
            return book, 201

        return 500

@book_ns.route('/<int:book_id>')
class Book(Resource):
    @book_ns.doc('get_book')
    @book_ns.marshal_with(book_model)
    @jwt_required()
    def get(self, book_id):
        """ Lấy sách theo ID """
        book = dao_book.get_book_by_id(book_id)

        if book:
            return book, 200

        return 404

    @book_ns.doc('delete_book')
    @book_ns.marshal_with(message_model)
    # @jwt_required()
    def delete(self, book_id):
        """ Xoá sách theo ID """
        deleted = dao_book.delete_book_by_id(book_id)

        if deleted:
            return '', 204

        return {"message": "Sách không hợp lệ"}, 404

    @book_ns.doc('update_book')
    @book_ns.expect(book_update_parser)
    @book_ns.marshal_with(book_model)
    @jwt_required()
    def patch(self, book_id):
        """ Cập nhật thông tin sách """
        args = book_update_parser.parse_args()

        book = dao_book.update_book(book_id, args)

        return book, 200 if book else 500

@book_ns.route('/<int:book_id>/comments')
class BookCommentsList(Resource):
    @book_ns.doc('post_book_comment')
    @book_ns.marshal_with(comment_model)
    @book_ns.expect(comment_parser)
    @jwt_required()
    def post(self, book_id):
        """ Thêm bình luận mới """
        args = comment_parser.parse_args()
        c = dao_book.add_comment(args['content'], book_id, args['user_id'], args['rating'])
        dao_book.update_book_rating(book_id)
        return c, 200 if c else 500

    @book_ns.doc('get_book_comments')
    @book_ns.marshal_with(comment_model)
    @jwt_required()
    def get(self, book_id):
        """ Lấy bình luận theo id sách """
        c = dao_book.get_comments_by_book_id(book_id)

        if c:
            return c, 200

        return {}, 404

book_ns.add_resource(BooksList, '/')
book_ns.add_resource(Book, '/<int:book_id>')
book_ns.add_resource(BookCommentsList, '/<int:book_id>/comments')