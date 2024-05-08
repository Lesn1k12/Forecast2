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
    name = models.CharField(max_length=255)
    unique_id = models.IntegerField(default=0)
    owner_user = models.ForeignKey(User, on_delete=models.CASCADE)


class PriceHistory(models.Model):
    asset = models.ForeignKey(Assets, related_name='price_history', on_delete=models.CASCADE)
    price = models.IntegerField(validators=[MaxValueValidator(limit_value=9999999999)], default=0)
    date = models.DateTimeField(default=timezone.now)
