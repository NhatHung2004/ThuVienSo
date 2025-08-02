from app.models import Cart, CartDetail
from app import db

def create_or_increase_cart(user_id, quantity, book_id):
    cart = Cart.query.filter_by(user_id=user_id).first()

    if cart:
        cart_detail = CartDetail.query.filter_by(cart_id=cart.id, book_id=book_id).first()

        if cart_detail:
            cart_detail.quantity += quantity
        else:
            cart_detail = CartDetail(quantity=quantity, book_id=book_id, cart_id=cart.id)
            db.session.add(cart_detail)
    else:
        cart = Cart(user_id=user_id)

        db.session.add(cart)
        db.session.flush()

        cart_detail = CartDetail(cart_id=cart.id, book_id=book_id, quantity=quantity)
        db.session.add(cart_detail)

    db.session.commit()
    return cart

def decrease_cart(quantity, book_id, cart_id):
    cart_detail = CartDetail.query.filter_by(book_id=book_id, cart_id=cart_id).first()

    if cart_detail:
        cart_detail.quantity -= quantity

        if cart_detail.quantity <= 0:
            db.session.delete(cart_detail)

        db.session.commit()
        return cart_detail

    return None

def delete_cart(cart_id):
    cart = Cart.query.filter_by(id=cart_id).first()

    if cart:
        db.session.delete(cart)
        db.session.commit()
        return True

    return False
