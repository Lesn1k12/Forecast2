from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from .serializers import UserSerializer, TransactionSerializer
from .utils import send_verif_up_mail, resset_pass_mail
from .models import Transaction
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from django.utils.http import urlsafe_base64_decode
from django.utils import timezone


@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({'token': token.key, 'user': serializer.data})


@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        send_verif_up_mail(request, user)
        # token = Token.objects.create(user=user) #создаем токен для юзера
        return Response('confirm your email', status=status.HTTP_102_PROCESSING)
        # return Response({'token': token.key, 'user': serializer.data})

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def mail_confirm(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return Response('email confirmed')
    else:
        return Response('smth went wrong')


@api_view(['POST'])
def wanna_reset_password(request):
    email = request.data['email']
    user = User.objects.get(email=email)
    resset_pass_mail(email, user)


@api_view(['POST'])
def reset_password(request, token, uidb64):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
        newpass = request.data.get('new_password')
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response(status=status.HTTP_400_BAD_REQUEST)
    user.set_password(newpass)
    user.save()
    return Response('password changed', status=status.HTTP_200_OK)


@api_view(["get"])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user
    context = {'username': user.username, 'email': user.email, 'wallet': user.wallet}
    return Response(context, status=status.HTTP_200_OK)


# -------------Transactions--------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transaction(request):
    user = request.user
    category = request.data.get('category')
    start_amount = request.data.get('start_amount')
    end_amount = request.data.get('end_amount')
    start_time = request.data.get('start_time')
    end_time = request.data.get('end_time')
    currency = request.data.get('currency')
    filters = {'user': request.user}

    if category:
        filters['category'] = category
    if start_amount:
        filters['amount__gte'] = start_amount
    if end_amount:
        filters['amount__lte'] = end_amount
    if start_time:
        filters['time__gte'] = start_time
    if end_time:
        filters['time__lte'] = end_time
    if currency:
        filters['currency'] = currency

    transaction = Transaction.objects.filter(**filters)
    serializer = TransactionSerializer(transaction, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_transaction(request):
    validate = {
        'category': request.data.get('category', ''),
        'amount': request.data.get('amount'),
        'currency': request.data.get('currency'),
    }
    serializer = TransactionSerializer(data=validate)
    cleaned_time = timezone.now() if not request.data['time'] else request.data['time']
    cleaned_category = 'others' if not request.data['category'] else request.data['category']
    try:
        if serializer.is_valid():
            Transaction.objects.create(
                user=request.user,
                category=cleaned_category,
                amount=request.data['amount'],
                time=cleaned_time,
                description=request.data['description'],
                currency=request.data['currency'],
            )
        return Response({"message": "Transaction added correctly"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print("Error:", str(e))
        return Response("An error occurred. Transaction not added.")


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_transaction(request):
    try:
        filters = {
            'id': request.data['id'],
            'user_id': request.user
        }

        transaction_to_delete = Transaction.objects.filter(**filters)
        if not transaction_to_delete.exists():
            return Response('Transaction not found', status=status.HTTP_404_NOT_FOUND)

        transaction_to_delete.delete()
        return Response('Transaction deleted', status=status.HTTP_200_OK)
    except:
        return Response('something went wrong with updating task', status=status.HTTP_400_BAD_REQUEST)
