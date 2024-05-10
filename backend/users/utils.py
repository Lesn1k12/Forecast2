from django.core.mail import EmailMessage
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

BASE_URL = '127.0.0.1:8000'

def send_confirmation_email(request, user):
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    confirmation_url = f"{BASE_URL}/users/signupconfirm/{uidb64}/{token}/"
    print(confirmation_url)
    subject = 'Подтверждение регистрации'
    message = confirmation_url
    email = EmailMessage(subject, message, to=[user.email])
    email.send()


def send_verif_up_mail(request, user):
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    confirmation_url = f"{BASE_URL}/users/mailconfirm/{uidb64}/{token}/"
    subject = 'Budget Predict Verify'    
    message = f'Hi, {request.data["username"]}, thanks for choosing our web-application. Please,confirm your email by following this link {confirmation_url} sda'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [request.data['email']]
    send_mail(subject,message,email_from,recipient_list)
    email = request.data['email']
    print('uidb64', uidb64, 'token', token)
    
    
def resset_pass_mail(email, user):
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    confirmation_url = f"{BASE_URL}/users/resetpass/{uidb64}/{token}/"
    print('====================================================')
    print(confirmation_url)
    subject = 'Budget Predict Verify'    
    message = f'Hi, {user.username}, you can change your password by following this link {confirmation_url} '
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject,message,email_from,recipient_list)
    print('uidb64', uidb64, 'token', token)


def replace_invalid_characters(s):
    invalid_characters = ['?', '*', '/', '\\', '|', '<', '>', ':', '"']
    for char in invalid_characters:
        s = s.replace(char, '_')
    return s
