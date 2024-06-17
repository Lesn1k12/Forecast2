import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models import Q
from .models import Chat, User, Message
from asgiref.sync import sync_to_async
from datetime import datetime
from pytz import timezone as tz


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.chat_id = None
        self.room_group_name = None

    async def connect(self):
        query_string = self.scope['query_string'].decode()
        print(self.scope)
        query_params = parse_qs(query_string)
        print(f'query_params: {query_params}')
        sender_id = query_params.get('user', [None])[0]
        receiver_id = query_params.get('receiver_id', [None])[0]
        if sender_id is None or receiver_id is None:
            print("sender_id or receiver_id is missing in the query string")
            await self.close()
            return

        self.chat_id = await self.get_or_create_chat_id(user0_id=sender_id, user1_id=receiver_id)
        self.room_group_name = f'chat_{self.chat_id}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        print(f'{str(self.chat_id)} connected to group {self.room_group_name}')
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        print(f'disconnected from group {self.room_group_name} - chat_id: {str(self.chat_id)}')

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            data = json.loads(text_data)
            message = data['text']
            sender_id = data['user']
            receiver_id = int(data['receiver_id'])
            time = datetime.now(tz('Europe/Warsaw')).strftime('%Y-%m-%d %H:%M:%S')
            username_receiver = await self.get_username_by_id(receiver_id)
            await self.save_message(message, sender_id, receiver_id)
            group_name = f'chat_{str(self.chat_id)}'
            print(f'group_name: {group_name}')
            await self.channel_layer.group_send(
                group_name,
                {
                    'type': 'chat_message',
                    'text': message,
                    'user': sender_id,
                    'receiver_id': receiver_id,
                    'username_receiver': username_receiver,
                    'time': time,
                }
            )
        else:
            print('no text data')

    async def chat_message(self, event):
        message = event['text']
        username_receiver = event['username_receiver']
        sender_id = event['user']
        receiver_id = event['receiver_id']
        time = event['time']

        await self.send(text_data=json.dumps({
            'text': message,
            'user': sender_id,
            'receiver_id': int(receiver_id),
            'username_receiver': username_receiver,
            'time': time,
        }))
        print(f'Received chat_message event: {event}')

    @sync_to_async
    def save_message(self, message, sender_id, receiver_id):
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)
        chat = Chat.objects.get(chat_id=self.chat_id)
        Message.objects.create(
            chat=chat,
            sender=sender,
            receiver=receiver,
            text=message,
        )

    @sync_to_async
    def get_or_create_chat_id(self, user0_id, user1_id):
        try:
            if user0_id == user1_id:
                raise TypeError('user0_id and user1_id cannot be the same')
            chat = Chat.objects.filter(
                Q(user0_id=user0_id, user1_id=user1_id) | Q(user0_id=user1_id, user1_id=user0_id)
            ).first()

            if chat:
                return chat.chat_id
            else:
                new_chat = Chat.objects.create(user0_id=user0_id, user1_id=user1_id)
                return new_chat.chat_id
        except Exception as e:
            print(f'Error: {e}')

    @sync_to_async
    def get_username_by_id(self, user_id):
        user = User.objects.get(id=user_id)
        return user.username
