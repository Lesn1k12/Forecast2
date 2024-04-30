from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Transaction, Events, Assets, PriceHistory


class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['id', 'username', 'password', 'email']


class TransactionSerializer(serializers.ModelSerializer):
    time = serializers.DateTimeField(allow_null=True, required=False)

    class Meta(object):
        model = Transaction
        fields = ['user', 'category', 'time', 'amount', 'description', 'currency']


class EventsSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Events
        fields = ['user', 'title', 'start_time', 'end_time']


class AssetsSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Assets
        fields = ['name', 'unique_id', 'owner_user']


class PriceHistorySerializer(serializers.ModelSerializer):
    class Meta(object):
        model = PriceHistory
        fields = ['asset', 'price', 'date']
