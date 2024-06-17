from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from users import consumers

#
# application = ProtocolTypeRouter({
#     "websocket": URLRouter([
#         path("ws/chat/", consumers.ChatConsumer.as_asgi()),
#     ]),
# })


from django.urls import re_path

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter([
        re_path(r"ws/chat/(?P<user>\d+)/(?P<receiver_id>\d+)/$", consumers.ChatConsumer.as_asgi()), ]),
})
