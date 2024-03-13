from django.urls import re_path, path
from users import views

urlpatterns = [
    #------Auth------
    re_path('login', views.login),
    re_path('signup', views.signup),
    path('mailconfirm/<str:uidb64>/<str:token>/', views.mailconfirm, name='mailconfirm'),
    path('resetpass/<str:uidb64>/<str:token>/', views.resetpassword, name='resetpass'),
    re_path('wannaresetpass/', views.wannaresetpass),
    ]
