from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator
from django.utils import timezone


class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    category = models.CharField(max_length=25, default='others')
    amount = models.IntegerField(validators=[MaxValueValidator(limit_value=9999999999)], default=0)
    time = models.DateTimeField(null=True, blank=True, default=timezone.now)
    description = models.CharField(max_length=50, default='')
    currency = models.CharField(max_length=25, default='ZL')
    title = models.CharField(max_length=40, default='')


class Events(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    title = models.CharField(max_length=40, default='')
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)


class Assets(models.Model):
    available_categories = {
        "f": "finances",
        "c": "crypto",
        "i": "immovability",
        "t": "technique",
        "ip": "intellectual property",
        "pp": "physical property",
        "inv": "investments",
        "alt": "alternative",
        "o": "others"
    }
    name = models.CharField(max_length=255)
    unique_id = models.IntegerField(default=0)
    owner_user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=25, choices=[(key, value) for key, value in available_categories.items()])


class PriceHistory(models.Model):
    asset = models.ForeignKey(Assets, related_name='price_history', on_delete=models.CASCADE)
    price = models.IntegerField(validators=[MaxValueValidator(limit_value=9999999999)], default=0)
    date = models.DateTimeField(default=timezone.now)


# class Chat(models.Model):
#     user0 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user0')
#     user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user1')
#     chat_id = models.IntegerField(default=0)
#
#
# class Message(models.Model):
#     chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     text = models.CharField(max_length=255)
#     time = models.DateTimeField(default=timezone.now)
#     reed = models.BooleanField(default=False)
