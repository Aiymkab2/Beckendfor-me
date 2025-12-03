# СТО - Автосервис

Полнофункциональный веб-сайт автосервиса на Django + React.

## Технологический стек

- **Backend**: Django 4.2, Django REST Framework
- **Frontend**: React 18, Vite
- **База данных**: PostgreSQL (SQLite для разработки)
- **Аутентификация**: JWT (djangorestframework-simplejwt)
- **Документация API**: Swagger (drf-yasg)
- **Docker**: Docker + docker-compose

## Функционал

### Роли пользователей

1. **Гость** (не авторизован)
   - Просмотр каталога услуг и запчастей
   - Поиск и фильтрация
   - Просмотр цен (в KZT)

2. **Клиент** (авторизован)
   - Личный кабинет
   - Запись на услуги
   - Заказ запчастей
   - Корзина
   - Онлайн-консультация
   - История записей и заказов

3. **Админ** (admin123 / admin123)
   - Рабочая панель
   - Управление записями
   - Управление заказами
   - CRUD услуг и запчастей
   - Управление запасами

## Установка и запуск

### С Docker (рекомендуется)

```bash
# Клонировать репозиторий
git clone <repository-url>
cd auto-service

# Запустить контейнеры
docker-compose up --build

# Выполнить миграции и загрузить данные
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py seed_data
```

Сайт будет доступен:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger: http://localhost:8000/swagger/

### Без Docker

#### Backend

```bash
# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt

# Настроить базу данных (SQLite для разработки)
# Создать .env файл из .env.example
cp .env.example .env

# Выполнить миграции
python manage.py migrate

# Загрузить начальные данные
python manage.py seed_data

# Запустить сервер
python manage.py runserver
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Начальные данные

После выполнения `python manage.py seed_data` будут созданы:

- **Админ**: admin123 / admin123
- **5 тестовых пользователей**: user1-user5 / password123
- **10 услуг** (включая замену масла, диагностику, шиномонтаж и др.)
- **20 запчастей** с разными SKU
- **4 мастера**

## API Эндпоинты

### Аутентификация
- `POST /api/auth/register/` - Регистрация
- `POST /api/auth/login/` - Вход
- `POST /api/auth/logout/` - Выход
- `GET /api/auth/profile/` - Профиль

### Публичные
- `GET /api/services/` - Список услуг
- `GET /api/services/{id}/` - Детали услуги
- `GET /api/parts/` - Список запчастей
- `GET /api/parts/{id}/` - Детали запчасти
- `GET /api/masters/` - Список мастеров

### Клиентские
- `POST /api/appointments/` - Создать запись
- `GET /api/appointments/` - Мои записи
- `POST /api/cart/add/` - Добавить в корзину
- `POST /api/orders/create/` - Создать заказ
- `GET /api/orders/` - Мои заказы
- `POST /api/consultation/` - Отправить сообщение
- `GET /api/consultation/` - Мои консультации

### Админ
- `GET /api/admin/appointments/` - Все записи
- `PATCH /api/admin/appointments/{id}/` - Обновить запись
- `GET /api/admin/parts/orders/` - Все заказы
- `PUT /api/admin/services/{id}/` - Обновить услугу
- `PUT /api/admin/parts/{id}/` - Обновить запчасть
- `PATCH /api/admin/parts/{id}/update_stock/` - Обновить запасы

## Документация API

Swagger документация доступна по адресу: http://localhost:8000/swagger/

## Структура проекта

```
.
├── auto_service/          # Django проект
│   ├── settings.py
│   ├── urls.py
│   └── ...
├── api/                   # API приложение
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── management/
│       └── commands/
│           └── seed_data.py
├── accounts/              # Аутентификация
│   ├── models.py
│   ├── views.py
│   └── ...
├── frontend/              # React приложение
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── ...
│   └── package.json
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```

## Разработка

### Запуск тестов

```bash
python manage.py test
```

### Линтинг

```bash
# Backend (flake8, black)
flake8 .
black .

# Frontend
cd frontend
npm run lint
```

## Лицензия

MIT

