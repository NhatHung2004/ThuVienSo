from flask_jwt_extended import jwt_required
from flask_restx import Resource
from app.dao import dao_stats
from app.api_conf import stats_ns, book_frequency_statistics_model, book_frequency_statistics_parser
from app.models import UserRole
from app.utils.check_role import role_required

@stats_ns.route('/book_frequency')
class BookFrequency(Resource):
    @jwt_required()
    @role_required([UserRole.LIBRARIAN.value])
    @stats_ns.marshal_list_with(book_frequency_statistics_model)
    @stats_ns.expect(book_frequency_statistics_parser)
    def get(self):
        """ Tần suất mượn sách nhiều nhất """
        args = book_frequency_statistics_parser.parse_args()
        month = args['month'] or None

        results = dao_stats.book_frequency_stats(month_param=month)

        return results, 200

stats_ns.add_resource(BookFrequency, '/book_frequency')
