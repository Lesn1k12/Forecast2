from django.urls import re_path, path

from users import views

urlpatterns = [
    # ------Auth------
    re_path('login', views.login),
    re_path('signup', views.signup),
    path('mailconfirm/<str:uidb64>/<str:token>/', views.mail_confirm, name='mailconfirm'),
    path('resetpass/<str:uidb64>/<str:token>/', views.reset_password, name='resetpass'),
    re_path('wannaresetpass/', views.wanna_reset_password),
    re_path('get_userdata', views.get_user_data),
    # ------Transactions------
    re_path('get_transaction', views.get_transaction),
    re_path('post_transaction', views.create_transaction),
    re_path('delete_transaction', views.delete_transaction),
]
