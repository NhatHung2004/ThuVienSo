from flask import redirect
from flask_admin import expose, AdminIndexView, BaseView
from flask_login import current_user, logout_user
from flask_admin.contrib.sqla import ModelView
from wtforms.fields.choices import SelectField
from cloudinary import uploader
from wtforms.fields.simple import FileField, PasswordField
from markupsafe import Markup
from .models import UserRole
import bcrypt

class MyAdminIndexView(AdminIndexView):
    @expose('/')
    def index(self):
        return self.render('admin/index.html')

class AdminView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.role.__eq__("ADMIN")

class MyView(BaseView):
    def is_accessible(self):
        return current_user.is_authenticated

class ImagePreviewWidget(object):
    def __call__(self, field, **kwargs):
        attrs = ' '.join(f'{k}="{v}"' for k, v in kwargs.items())
        input_html = f'<input {attrs} type="file" name="{field.name}">'
        if field.data:
            return Markup(f'<img src="{field.data}" width="150"><br>{input_html}')
        return Markup(input_html)

class UserView(AdminView):
    column_list = ['id', 'username', 'role', 'avatar']
    can_create = True
    can_edit = True
    can_delete = True

    column_formatters = {
        'avatar': lambda v, c, m, p: Markup(
            f'<img src="{m.avatar}" width="50" height="50" style="object-fit: cover; border-radius: 50%;">') if m.avatar else ''
    }

    form_overrides = {
        'avatar': FileField,
        'password': PasswordField,
        'role': SelectField,
    }

    form_args = {
        'role': {
            'label': 'Role',
            'choices': [(role.name, role.value) for role in UserRole],
            'coerce': str
        }
    }

    form_create_rules = ['username', 'password', 'firstname', 'lastname', 'email', 'role', 'avatar']
    form_edit_rules = ['username', 'firstname', 'lastname', 'email', 'role', 'avatar']

    form_extra_fields = {
        'avatar': FileField('Avatar', widget=ImagePreviewWidget())
    }

    def on_model_change(self, form, model, is_created):
        if is_created:
            model.password = str(bcrypt.hashpw(form.password.data.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'))

        if form.avatar.data and hasattr(form.avatar.data, 'read'):
            uploaded_file = form.avatar.data
            upload_result = uploader.upload(uploaded_file)
            model.avatar = upload_result['secure_url']

        model.role = UserRole[form.role.data]

    def on_form_prefill(self, form, id):
        if form.avatar:
            model = self.get_one(id)
            form.avatar.data = model.avatar

class LogoutView(MyView):
    @expose('/')
    def index(self):
        logout_user()
        return redirect('/admin')
