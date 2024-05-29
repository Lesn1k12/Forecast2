from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from .models import User
from django.utils.dateparse import parse_datetime
from django.contrib.auth.tokens import default_token_generator
from .serializers import UserSerializer, TransactionSerializer, EventsSerializer, AssetsSerializer, \
    PriceHistorySerializer
from .utils import send_verif_up_mail, resset_pass_mail, replace_invalid_characters
from .models import Transaction, Events, Assets, PriceHistory
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from django.utils.http import urlsafe_base64_decode
from django.utils import timezone
import pandas as pd
from datetime import datetime
from dateutil.relativedelta import relativedelta
from prophet import Prophet
from users import config
from django.core.mail import EmailMultiAlternatives


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


# -------------User--------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user
    try:
        token = Token.objects.get(user=user)
    except Token.DoesNotExist:
        raise NotFound("Token not found for the given user.")
    context = {'username': user.username, 'email': user.email, 'public_key': token.key, 'id': user.id}
    return Response(context, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


# -------------Transactions--------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transaction(request):
    # user = request.user
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
            'id': request.query_params['id'],
            'user_id': request.user
        }
        transaction_to_delete = Transaction.objects.filter(**filters)
        if not transaction_to_delete.exists():
            return Response('Transaction not found', status=status.HTTP_404_NOT_FOUND)

        transaction_to_delete.delete()
        return Response('Transaction deleted', status=status.HTTP_200_OK)
    except Exception as ex:
        return Response({"error": ex}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sort_by_category(request):  # получить все транзакции по одной категории
    filters = {
        'user': request.user,
        'category': request.data.get('category')
    }
    queryset = Transaction.objects.filter(**filters)
    df = pd.DataFrame.from_records(queryset.values())
    context = df.to_json(orient='records')
    return Response(context)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def procent_of_categories(
        request):  # получить в процентах транзакции(можно на какой то период времени(наверное но я не тестил начсет периода))

    start_time = request.data.get('start_time')
    end_time = request.data.get('end_time')

    filters = {'user': request.user}

    if start_time:
        filters['time__gte'] = start_time
    if end_time:
        filters['time__lte'] = end_time

    queryset = Transaction.objects.filter(**filters)
    df = pd.DataFrame.from_records(queryset.values())
    total_rows = len(df)
    category_counts = df['category'].value_counts()
    percentage_by_category = (category_counts / total_rows) * 100
    category_counts_dict = percentage_by_category.to_dict()
    return Response(category_counts_dict)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def month_transaction_info(request):
    start_date = datetime.strptime(request.data.get('time'), '%Y-%m')
    end_date = start_date + relativedelta(months=+1)
    filters = {
        'user': request.user,
        'time__gte': start_date,
        'time__lte': end_date
    }
    queryset = Transaction.objects.filter(**filters)
    df = pd.DataFrame.from_records(queryset.values())
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
    middle_transaction = df['amount'].mean()
    highest_expense = df['amount'].min()
    highest_income = df['amount'].max()
    total_expense = df[df['amount'] < 0]['amount'].sum()

    # display(df)

    total_income = df[df['amount'] > 0]['amount'].sum()

    total_left = total_income - total_expense

    def category_stat():
        total_rows = len(df)
        category_counts = df['category'].value_counts()
        percentage_by_category = (category_counts / total_rows) * 100
        category_dict = percentage_by_category.to_dict()
        return category_dict

    context = {
        'middle_transaction': middle_transaction,
        'highest_expense': highest_expense,
        'highest_income': highest_income,
        'total_expense': total_expense,
        'total_income': total_income,
        'total_left': total_left,
        'category_stat': category_stat()
    }
    return Response(context)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def forecast_transaction(request):
    try:
        filters = {
            'user': request.user,
            'time__lte': timezone.now()
        }
        queryset = Transaction.objects.filter(**filters)
    except Exception as ex:
        return Response({"error": ex}, status=status.HTTP_404_NOT_FOUND)

    df = pd.DataFrame.from_records(queryset.values())

    print(df)

    df['time'] = pd.to_datetime(df['time']).dt.tz_localize(None)  # конвертируем время в дататайм тип и убираем utc
    df = df.sort_values(by='time')  # перебераем по дате транзакции и упорядочиваем

    for i in range(1, len(df)):  # суммируем каждую транзакцию i с i-1
        df.loc[i, 'amount'] = df.loc[i, 'amount'] + df.loc[i - 1, 'amount']
    # display(df)
    data_ph = {'ds': df['time'], 'y': df['amount'],
               'r0': df['category']}  # создаем данные для датафрейма дата/транзакция/category

    df_ph = pd.DataFrame(data_ph)  # создаем датафрейм дата/транзакция/категория

    model = Prophet(daily_seasonality=False, weekly_seasonality=False, yearly_seasonality=False,
                    changepoint_prior_scale=0.000003, seasonality_prior_scale=5)  # создаем модель и задаем параметры
    model.add_seasonality(name='monthly', period=30.5, fourier_order=7)
    model.add_country_holidays(country_name='PL')
    model.fit(df_ph)
    future = model.make_future_dataframe(periods=30)  # создаем дф на котором будем делать прогноз(количество дней)
    forecast = model.predict(future)  # создаем дф с предиктом = предсказываем че спрогнозировали
    print('==========================================FORECASST=============================')
    # display(forecast) #отображаем в консоли предикт
    model.plot(forecast)  # рисуем график предикта
    # plt.show() #показываем граф предикта
    comp = model.plot_components(forecast)  # компоненты (неделя тренд год)
    print('==========================================COMPONENTSSSSSSSSSS=========================')
    # display(comp) #выводим в консоль
    # plt.show() #рисуем
    # seasonally_data = forecast[['ds', 'weekly']] #ПОМЕТКААААААА дописать ретерн недельного тренда
    # plt.show()
    returns_front = forecast[['ds', 'yhat']]
    # display(returns_front)
    # forecast = pd.DataFrame.to_json(forecast)
    # seasonally_data = pd.DataFrame.to_json(seasonally_data)
    returns_front = returns_front.to_json()
    print('==================================================returns_to_front===============================')
    # display(returns_front)
    context = {
        returns_front
    }

    return Response(context, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def total_mail(request):
    try:
        filters = {
            'user': request.user,
            'time__lte': timezone.now()
        }
        queryset = Transaction.objects.filter(**filters)
    except Exception as ex:
        return Response({"error": ex}, status=status.HTTP_404_NOT_FOUND)

    df = pd.DataFrame.from_records(queryset.values())
    df['time'] = pd.to_datetime(df['time']).dt.tz_localize(None)  # конвертируем время в дататайм тип и убираем utc
    df = df.sort_values(by='time')  # перебераем по дате транзакции и упорядочиваем
    print(df)
    file_path = replace_invalid_characters(f'{request.user}{timezone.now()}.html')
    df.to_html(file_path, index=False)

    ###

    subject = 'Budget Analysis'
    email_from = config.CF_EMAIL_HOST
    recipient_list = [request.user.email]

    with open(file_path, 'r') as html_file:
        html_content = html_file.read()

    email = EmailMultiAlternatives(subject, '', email_from, recipient_list)

    email.attach_alternative(html_content, 'text/html')

    email.send()

    return Response(status=status.HTTP_200_OK)


# -------------Events--------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_event(request):
    try:
        serializer = EventsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def take_event(request):
    try:
        events = Events.objects.filter(user=request.user)
        serializer = EventsSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def delete_event(request):
    try:
        event = Events.objects.get(id=request.data['id'], user=request.user)
        event.delete()
        return Response('Event deleted', status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(['PATCH'])
def update_event(request):
    try:
        event = Events.objects.get(id=request.data['id'], user=request.user)

        event.title = request.data.get('title', event.title)
        event.start_time = request.data.get('start_time', event.start_time)
        event.end_time = request.data.get('end_time', event.end_time)
        event.save()
        return Response({'message': 'Event updated'}, status=status.HTTP_200_OK)
    except Events.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# -------------Actives--------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_actives(request):
    asset_data = {
        'name': request.data.get('name'),
        'owner_user': request.user.id,
        'category': request.data.get('category')
    }
    asset_serializer = AssetsSerializer(data=asset_data)
    if asset_serializer.is_valid():
        asset_serializer.save()
        price_history_data = {
            'asset': asset_serializer.instance.id,
            'price': request.data.get('price'),
            'date': parse_datetime(request.data.get('date', timezone.now().isoformat())),
            # "date": "2023-10-21T00:00:00" - не удалять.
        }
        price_history_serializer = PriceHistorySerializer(data=price_history_data)
        if price_history_serializer.is_valid():
            price_history_serializer.save()
            return Response({'asset': asset_serializer.data, 'price_history': price_history_serializer.data},
                            status=status.HTTP_201_CREATED)
        return Response(price_history_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(asset_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_actives(request):
    try:
        asset = Assets.objects.get(id=request.query_params['id'],
                                   owner_user=request.user)
        latest_price_history = PriceHistory.objects.filter(asset=asset).latest('date')
        response_data = {
            'name': asset.name,
            'current_price': latest_price_history.price,
            'date': latest_price_history.date,
            'category': asset.category
        }
        return Response(response_data, status=status.HTTP_200_OK)
    except Assets.DoesNotExist:
        return Response({'error': 'Asset not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_history_actives(request):
    try:
        asset = Assets.objects.get(id=request.query_params['id'], owner_user=request.user)
        price_history = PriceHistory.objects.filter(asset=asset)
        serializer = PriceHistorySerializer(price_history, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Assets.DoesNotExist:
        return Response({'error': 'Asset not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_actives(request):
    try:
        assets = Assets.objects.filter(owner_user=request.user)
        response_data = []
        for asset in assets:
            price_history = PriceHistory.objects.filter(asset=asset).order_by('-date')[:2]
            if len(price_history) == 2:
                price_change = round((((price_history[0].price - price_history[1].price) / price_history[1].price) * 100), 3)
                asset_data = {
                    'id': asset.id,
                    'name': asset.name,
                    'current_price': price_history[0].price,
                    'date': price_history[0].date,
                    'category': asset.category,
                    'price_change': price_change
                }

            elif price_history.exists():
                asset_data = {
                    'id': asset.id,
                    'name': asset.name,
                    'current_price': price_history[0].price,
                    'date': price_history[0].date,
                    'category': asset.category,
                    'price_change':  0
                }
            else:
                asset_data = {
                    'id': asset.id,
                    'name': asset.name,
                    'category': asset.category,
                    'current_price': 'No price history',
                    'date': 'No date',
                    'price_change': 0
                }
            response_data.append(asset_data)
        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_actives(request):
    try:
        asset = Assets.objects.get(id=request.query_params['id'], owner_user=request.user)
        asset.name = request.query_params.get('name', asset.name)
        new_price = request.query_params.get('new_price')
        if new_price is not None:
            new_price = int(new_price)
            new_price_history_data = {
                'asset': asset.id,
                'price': new_price,
                'date': request.query_params.get('date', timezone.now()),
            }
            price_history_serializer = PriceHistorySerializer(data=new_price_history_data)
            if price_history_serializer.is_valid():
                price_history_serializer.save()
                asset.save()
                return Response('Asset price and name updated', status=status.HTTP_200_OK)
            return Response(price_history_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        asset.save()
        return Response('Asset name updated', status=status.HTTP_200_OK)
    except Assets.DoesNotExist:
        return Response({'error': 'Asset not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_actives(request):
    try:
        asset = Assets.objects.get(id=request.query_params['id'], owner_user=request.user)
        asset.delete()
        return Response('Asset deleted', status=status.HTTP_200_OK)
    except Assets.DoesNotExist:
        return Response({'error': 'Asset not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
