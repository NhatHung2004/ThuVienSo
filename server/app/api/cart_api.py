from flask_restx import Resource
from flask_jwt_extended import jwt_required
from app.api_conf import cart_ns, create_cart_parser, cart_model, cart_detail_model, update_cart_detail_parser
from app.dao import dao_cart

@cart_ns.route('/')
class Cart(Resource):
    @cart_ns.expect(create_cart_parser)
    @cart_ns.marshal_with(cart_model)
    # @jwt_required()
    def post(self):
        """ Thêm mới hoặc tăng số lượng sách """
        args = create_cart_parser.parse_args()

        cart = dao_cart.create_or_increase_cart(args['user_id'], args['quantity'], args['book_id'])

        if cart:
            return cart, 200

        return {}, 404

    @cart_ns.expect(update_cart_detail_parser)
    @cart_ns.marshal_with(cart_detail_model)
    @jwt_required()
    def patch(self):
        """ Giảm số lượng sách, xoá sách khỏi giỏ thì thêm quantity = số lượng hiện tại """
        args = update_cart_detail_parser.parse_args()

        cart_detail = dao_cart.decrease_cart(args['quantity'], args['book_id'], args['cart_id'])

        if cart_detail:
            return cart_detail, 200

        return {}, 404


@cart_ns.route('/<int:cart_id>')
class CartDetail(Resource):
    @jwt_required()
    def delete(self, cart_id):
        """ Xoá giỏ hàng """
        deleted = dao_cart.delete_cart(cart_id)

        if deleted:
            return {}, 204

        return {}, 404

cart_ns.add_resource(Cart, '/')
cart_ns.add_resource(CartDetail, '/<int:cart_id>')
