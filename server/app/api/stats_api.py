from flask_restx import Resource
from app.dao import dao_stats
from app.api_conf import (stats_ns, book_frequency_statistics_model,
                          book_frequency_statistics_parser,
                          general_stats_model, category_stats_model, book_borrowing_stats_model)

@stats_ns.route('/book_frequency')
class BookFrequency(Resource):
    @stats_ns.marshal_list_with(book_frequency_statistics_model)
    @stats_ns.expect(book_frequency_statistics_parser)
    def get(self):
        """ Tần suất mượn sách đã được duyệt (sắp xếp theo mượn nhiều nhất) """
        args = book_frequency_statistics_parser.parse_args()
        month = args['month'] or None

        results = dao_stats.book_frequency_stats(month_param=month)

        return results, 200

@stats_ns.route('/general_stats')
class GeneralStats(Resource):
    @stats_ns.marshal_with(general_stats_model)
    def get(self):
        """ Thống kê tổng quát """
        results = dao_stats.general_stats()
        return (results, 200) if results else ({}, 404)

@stats_ns.route('/category_stats')
class CategoryStats(Resource):
    @stats_ns.marshal_list_with(category_stats_model)
    @stats_ns.expect(book_frequency_statistics_parser)
    def get(self):
        """ Thống số lượng sách theo cate """
        results = dao_stats.category_stats()
        return (results, 200) if results else ({}, 404)

@stats_ns.route('/book_borrowing_stats')
class BookBorrowingStats(Resource):
    @stats_ns.marshal_list_with(book_borrowing_stats_model)
    @stats_ns.expect(book_frequency_statistics_parser)
    def get(self):
        """ Số lượng từng sách đã mượn, trả theo tháng """
        args = book_frequency_statistics_parser.parse_args()
        month = args['month'] or None

        results = dao_stats.book_borrowing_stats(month_param=month)
        return (results, 200) if results is not None else ({}, 404)

stats_ns.add_resource(BookFrequency, '/book_frequency')
stats_ns.add_resource(GeneralStats, '/general_stats')
stats_ns.add_resource(CategoryStats, '/category_stats')
stats_ns.add_resource(BookBorrowingStats, '/book_borrowing_stats')
