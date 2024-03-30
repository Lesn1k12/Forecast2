from django.urls import re_path, path

from users import views

urlpatterns = [
    # ------Auth------
    re_path('login', views.login),
    re_path('signup', views.signup),
        #------Mail------
    path('mailconfirm/<str:uidb64>/<str:token>/', views.mailconfirm, name='mailconfirm'),
    path('resetpass/<str:uidb64>/<str:token>/', views.resetpassword, name='resetpass'),
    re_path('wannaresetpass/', views.wannaresetpass),
    #------Transactions------
    re_path('get_transaction', views.get_transaction),
    re_path('post_transaction', views.post_transaction),
    re_path('sort_by_category', views.sort_by_category),
    re_path('procent_of_categories', views.procent_of_categories),
    re_path('month_transaction_info', views.month_transaction_info),
    re_path('forecast_transaction', views.forecast_transaction),
    re_path('delete_transaction', views.delete_transaction),
    #------Mail------
    re_path('total_mail',views.total_mail),
    ]