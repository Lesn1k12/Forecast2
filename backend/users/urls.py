from django.urls import re_path, path

from users import views

urlpatterns = [
    #------Auth------
    re_path('login', views.login),
    re_path('signup', views.signup),
    #------User------
    re_path('get_userdata', views.get_user_data),
    #------Mail------
    path('mailconfirm/<str:uidb64>/<str:token>/', views.mail_confirm, name='mailconfirm'),
    path('resetpass/<str:uidb64>/<str:token>/', views.reset_password, name='resetpass'),
    re_path('wannaresetpass/', views.wanna_reset_password),
    #------Transactions------
    re_path('get_transaction', views.get_transaction),
    re_path('post_transaction', views.create_transaction),
    re_path('sort_by_category', views.sort_by_category),
    re_path('procent_of_categories', views.procent_of_categories),
    re_path('month_transaction_info', views.month_transaction_info),
    re_path('forecast_transaction', views.forecast_transaction),
    re_path('delete_transaction', views.delete_transaction),
    #------Mail------
    re_path('total_mail',views.total_mail),
    #------Events------
    re_path('create_event', views.create_event),
    re_path('delete_event', views.delete_event),
    re_path('get_events', views.take_event),
    re_path('patch_event', views.update_event),
    ]
