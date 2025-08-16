from app.api_conf import relative_ns
from flask_restx import Resource
from app.dao import dao_relative

@relative_ns.route('/')
class Relative(Resource):
    def delete(self):
        """ Xoá toàn bộ  """
        dao_relative.delete_all_relatives()
        return {}, 204

relative_ns.add_resource(Relative, '/')
