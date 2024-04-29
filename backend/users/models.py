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


# class TransactionHistory(models.Model):
#     transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, default=1)
#     previous_price = models.IntegerField(validators=[MaxValueValidator(limit_value=9999999999)], default=0)
#     change_time = models.DateTimeField(auto_now_add=True)
