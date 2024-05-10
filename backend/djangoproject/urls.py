from django.contrib import admin
from django.urls import include, re_path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

urlpatterns = [
    re_path('admin/', admin.site.urls),
    re_path('users/', include('users.urls')),
    re_path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    re_path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    re_path('api/token/refresh/', TokenVerifyView.as_view(), name='token_refresh'),

]
