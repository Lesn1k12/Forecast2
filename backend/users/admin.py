from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User


class UserAdmin(BaseUserAdmin):
    # Update list_display to match the fields on your User model
    list_display = ('username', 'email', 'is_staff')


admin.site.register(User, BaseUserAdmin)
