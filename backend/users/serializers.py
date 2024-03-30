from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Transaction


class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['id', 'username', 'password', 'email']


class TransactionSerializer(serializers.ModelSerializer):
    time = serializers.DateTimeField(allow_null=True, required=False)

    class Meta(object):
        model = Transaction
        fields = ['user', 'category', 'time', 'amount', 'description', 'currency']