from flask import request
from flask_restx import Resource
from app.api_conf import author_ns, author_parser, author_model, get_author_parser, message_model
from flask_jwt_extended import jwt_required
from app.dao import dao_author

@author_ns.route('/')
class AuthorList(Resource):
    @author_ns.doc('get_author_list')
    @author_ns.expect(get_author_parser)
    @author_ns.marshal_list_with(author_model)
    @jwt_required()
    def get(self):
        """ Lấy danh sách tác giả, theo name (query param) """
        kw = request.args.get('kw')
        authors = dao_author.get_authors_list(kw)

        if authors is None:
            return '', 404

        return authors, 200

    @author_ns.doc('create_author')
    @author_ns.expect(author_parser)
    @author_ns.marshal_with(author_model)
    @jwt_required()
    def post(self):
        """ Tạo tác giả """
        args = author_parser.parse_args()

        author = dao_author.add_author(args['name'])

        if author is None:
            return '', 500

        return author, 201

@author_ns.route('/<int:author_id>')
class AuthorDetail(Resource):
    @author_ns.doc('get_author_detail')
    @author_ns.marshal_with(author_model)
    @jwt_required()
    def get(self, author_id):
        """ Lấy tác giả theo ID """
        author = dao_author.get_author_by_id(author_id)

        if author is None:
            return '', 404

        return author, 200

    @author_ns.doc('update_author')
    @author_ns.expect(author_parser)
    @author_ns.marshal_with(author_model)
    @jwt_required()
    def patch(self, author_id):
        """ Cập nhật tác giả """
        args = author_parser.parse_args()
        author = dao_author.update_author(author_id, args['name'])

        if author is None:
            return '', 500

        return author, 200

    @author_ns.doc('delete_author')
    @author_ns.marshal_with(message_model)
    @jwt_required()
    def delete(self, author_id):
        """ Xoá tác giả theo ID """
        if dao_author.delete_author(author_id):
            return '', 204

        return {"message": "Lỗi khi thực hiện xoá tác giả"}, 404

author_ns.add_resource(AuthorList, '/')
author_ns.add_resource(AuthorDetail, '/<int:author_id>')
