from flask import request
from flask_restx import Resource
from app.api_conf import category_parser, category_ns, category_model
from app.dao import dao_category

@category_ns.route('/')
class CategoryList(Resource):
    @category_ns.marshal_list_with(category_model)
    def get(self):
        ''' Lấy danh sách thể loại '''
        kw = request.args.get('kw')
        categories = dao_category.get_categories_list(kw)
        return categories, 200

    @category_ns.marshal_with(category_model)
    @category_ns.expect(category_parser)
    def post(self):
        ''' Thêm thể loại sách '''
        args = category_parser.parse_args()

        category = dao_category.add_category(args['name'])

        if category:
            return category, 201

        return 500

category_ns.add_resource(CategoryList, '/')
