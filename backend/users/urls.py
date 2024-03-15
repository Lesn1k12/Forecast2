from django.urls import re_path, path

from users import views

urlpatterns = [
    #------Auth------
    re_path('login', views.login),
    re_path('signup', views.signup),
    path('mailconfirm/<str:uidb64>/<str:token>/', views.mailconfirm, name='mailconfirm'),
    path('resetpass/<str:uidb64>/<str:token>/', views.resetpassword, name='resetpass'),
    re_path('wannaresetpass/', views.wannaresetpass),
    re_path('get_userdata', views.get_user_data),
    #------Transactions------
    re_path('get_transaction', views.get_transaction),
    re_path('post_transaction', views.post_transaction),
    re_path('delete_transaction', views.delete_transaction),
    ]
