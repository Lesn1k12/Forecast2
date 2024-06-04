import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models import Q

from .models import Chat, User, Message
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.chat_id = None

    async def connect(self):
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)
        sender_id = query_params.get('user', [None])[0]
        receiver_id = query_params.get('receiver_id', [None])[0]
        if sender_id is None or receiver_id is None:
            print("sender_id or receiver_id is missing in the query string")
            await self.close()
            return

        self.chat_id = await self.get_or_create_chat_id(user0_id=sender_id, user1_id=receiver_id)
        print(f'{str(self.chat_id)} connected')
        await self.accept()

    async def disconnect(self, close_code):
        print('disconnected ' + str(self.chat_id))

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            try:
                text_data_json = json.loads(text_data)
                message = text_data_json.get('content', '')
                sender_id = text_data_json.get('user', '')
                receiver_id = text_data_json.get('receiver_id', '')
                await self.send(text_data=json.dumps({
                    'response': message,
                }))
                await self.save_message(message, sender_id, receiver_id)

                print("text_data_json: ", text_data_json)
            except json.JSONDecodeError:
                print("пришла хуйня (не json) анлак")
        else:
            print("Received empty text_data")

    @sync_to_async
    def save_message(self, message, sender_id, received_id):
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=received_id)
        chat = Chat.objects.get(chat_id=self.chat_id)
        Message.objects.create(
            chat=chat,
            sender=sender,
            receiver=receiver,
            text=message,
            reed=False,
        )

    @sync_to_async
    def get_or_create_chat_id(self, user0_id, user1_id):
        chat = Chat.objects.filter(
            Q(user0_id=user0_id, user1_id=user1_id) | Q(user0_id=user1_id, user1_id=user0_id)
        ).first()

        if chat:
            return chat.chat_id
        else:
            new_chat = Chat.objects.create(user0_id=user0_id, user1_id=user1_id)
            return new_chat.chat_id
