from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from .serializers import UserSerializer
from .utils import send_verif_up_mail, resset_pass_mail
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from django.utils.http import urlsafe_base64_decode

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username']) 
    if not user.check_password(request.data['password']):
        return Response({'detail': 'Not found.'}, status = status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user) 
    serializer = UserSerializer(instance=user) 
    return Response({'token': token.key, 'user': serializer.data}) 

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username = request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        send_verif_up_mail(request,user)
        #token = Token.objects.create(user=user) #создаем токен для юзера
        return Response('confirm your email',status=status.HTTP_102_PROCESSING)
        #return Response({'token': token.key, 'user': serializer.data})

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def mailconfirm(request,uidb64, token):
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
def wannaresetpass(request):
    email = request.data['email']
    user = User.objects.get(email = email)
    resset_pass_mail(email, user)
    
@api_view(['POST'])
def resetpassword(request, token, uidb64): 
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
        newpass = request.data.get('new_password')
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response(status=status.HTTP_400_BAD_REQUEST)
    user.set_password(newpass)
    user.save()
    return Response('password changed', status=status.HTTP_200_OK)
