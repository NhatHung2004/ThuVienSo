from flask_jwt_extended import jwt_required
from flask_restx import Resource
from app.api_conf import (request_ns, request_model, request_creation_parser,
                          accepted_request_parser, decline_request_parser, get_request_parser)
from flask import request
from app.dao import dao_request
from datetime import datetime
from app.models import UserRole
from app.utils.check_role import role_required


@request_ns.route('/')
class Requests(Resource):
    @request_ns.expect(get_request_parser)
    @jwt_required()
    @role_required([UserRole.LIBRARIAN.value])
    def get(self):
        """ Lấy toàn bộ request, lấy theo status """
        status = request.args.get('status')

        reqs = dao_request.get_request_list(status)

        return (reqs, 200) if reqs is not None else ('', 404)

    @request_ns.marshal_with(request_model)
    @request_ns.expect(request_creation_parser)
    @jwt_required()
    def post(self):
        """ Tạo yêu cầu mượn sách """
        data = request.get_json()

        user_id = int(data.get('user_id'))
        books = data.get('books')
        borrowing_method = data.get('borrowing_method')
        purpose = data.get('purpose')
        name = data.get('name')
        phone = data.get('phone')
        cccd = data.get('cccd')
        job = data.get('job')
        address = data.get('address')
        ward = data.get('ward')
        province = data.get('province')
        city = data.get('city')
        number_of_requests_day = data.get('number_of_requests_day')

        req = dao_request.request_to_borrow_books(user_id, books, borrowing_method, number_of_requests_day,
                                                  purpose, name, phone, cccd, job, address, ward, province, city)

        return (req, 201) if req else ('', 500)

    def delete(self):
        """ Xoá toàn bộ requests """
        dao_request.delete_all_requests()
        return {}, 204

@request_ns.route('/<int:request_id>')
class RequestList(Resource):
    @request_ns.marshal_with(request_model)
    @jwt_required()
    @role_required([UserRole.LIBRARIAN.value])
    def get(self, request_id):
        """ Lấy request theo id """
        req = dao_request.get_request_by_id(request_id)

        if req:
            return req, 200

        return '', 404

@request_ns.route('/<int:request_id>/accepted')
class RequestAccepted(Resource):
    @request_ns.marshal_with(request_model)
    @request_ns.expect(accepted_request_parser)
    @jwt_required()
    @role_required([UserRole.LIBRARIAN.value])
    def patch(self, request_id):
        """ Chấp nhận yêu cầu """
        args = accepted_request_parser.parse_args()

        librarian_id = int(args['librarian_id'])
        returned_date_string = args['returned_date']
        returned_date = datetime.fromisoformat(returned_date_string) if returned_date_string else None

        req = dao_request.accept_request(request_id, librarian_id, returned_date)

        if req:
            return req, 200

        return {"message": "Ngày trả sách không hợp lệ"}, 500

@request_ns.route('/<int:request_id>/declined')
class RequestDeclined(Resource):
    @request_ns.marshal_with(request_model)
    @request_ns.expect(decline_request_parser)
    @jwt_required()
    @role_required([UserRole.LIBRARIAN.value])
    def patch(self, request_id):
        """ Từ chối yêu cầu """

        args = decline_request_parser.parse_args()
        librarian_id = int(args['librarian_id'])

        req = dao_request.decline_request(request_id, librarian_id)

        return (req, 200) if req else ('', 500)

@request_ns.route('/<int:request_id>/returned')
class RequestReturned(Resource):
    @request_ns.marshal_with(request_model)
    @jwt_required()
    @role_required([UserRole.LIBRARIAN.value])
    def patch(self, request_id):
        """ Trả sách """
        req = dao_request.return_books(request_id)

        return (req, 200) if req else ('', 500)

request_ns.add_resource(Requests, '/')
request_ns.add_resource(RequestList, '/<int:request_id>')
request_ns.add_resource(RequestAccepted, '/<int:request_id>/accepted')
request_ns.add_resource(RequestDeclined, '/<int:request_id>/declined')
request_ns.add_resource(RequestReturned, '/<int:request_id>/returned')
