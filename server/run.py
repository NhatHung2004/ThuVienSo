from flask import request, flash, redirect
from app import create_app, login_manager, db
from flask_login import login_user, logout_user
from app.models import UserRole, User
from app.dao import dao_user
from app.admin import LogoutView, UserView
from app.extensions import admin

app = create_app()

@app.route('/login-admin', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    user = dao_user.login(username, password, role=UserRole.ADMIN)

    if user:
        login_user(user)
    else:
        flash('Sai tài khoản hoặc mật khẩu!', 'danger')

    return redirect('/admin')

@app.route("/logout")
def logout_process():
    logout_user()
    return redirect('/')

@login_manager.user_loader
def load_user(user_id):
    return dao_user.get_user_by_id(user_id)

admin.add_view(UserView(User, db.session))
admin.add_view(LogoutView(name='Đăng xuất'))

if __name__ == '__main__':
    app.run(debug=True) 

