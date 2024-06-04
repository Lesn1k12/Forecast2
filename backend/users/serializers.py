from rest_framework import serializers
from .models import Transaction, Events, Assets, User, PriceHistory, Chat, Message


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'public_key']


class TransactionSerializer(serializers.ModelSerializer):
    time = serializers.DateTimeField(allow_null=True, required=False)

    class Meta(object):
        model = Transaction
        fields = ['user', 'category', 'time', 'amount', 'description', 'currency', 'title']


class EventsSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Events
        fields = ['user', 'title', 'start_time', 'end_time']


class AssetsSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Assets
        fields = ['name', 'unique_id', 'owner_user', 'category']


class PriceHistorySerializer(serializers.ModelSerializer):
    class Meta(object):
        model = PriceHistory
        fields = ['asset', 'price', 'date']


class ChatSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Chat
        fields = ['user0', 'user1', 'chat_id']


class MessageSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Message
        fields = ['id', 'chat_id', 'receiver', 'sender', 'time', 'text']
