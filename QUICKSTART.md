# Быстрый старт

## Запуск с Docker (рекомендуется)

```bash
# 1. Запустить все сервисы
docker-compose up --build

# 2. В другом терминале выполнить миграции и загрузить данные
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py seed_data
```

Откройте в браузере:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger: http://localhost:8000/swagger/

## Запуск без Docker

### Backend

```bash
# 1. Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Установить зависимости
pip install -r requirements.txt

# 3. Настроить базу данных
# Для разработки можно использовать SQLite
# Создайте .env файл:
# USE_SQLITE=True

# 4. Выполнить миграции
python manage.py migrate

# 5. Загрузить начальные данные
python manage.py seed_data

# 6. Запустить сервер
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Тестовые аккаунты

После выполнения `seed_data`:

- **Админ**: 
  - Логин: `admin123`
  - Пароль: `admin123`
  - Доступ: Админ-панель по адресу /admin

- **Обычные пользователи**:
  - Логины: `user1`, `user2`, `user3`, `user4`, `user5`
  - Пароль для всех: `password123`

## Основные функции

1. **Гость** может:
   - Просматривать услуги и запчасти
   - Искать и фильтровать
   - Видеть цены в KZT

2. **Клиент** может:
   - Записываться на услуги
   - Заказывать запчасти
   - Пользоваться корзиной
   - Получать консультации
   - Просматривать историю

3. **Админ** может:
   - Управлять записями
   - Управлять заказами
   - Редактировать услуги и запчасти
   - Обновлять запасы

## Структура проекта

- `auto_service/` - Настройки Django
- `api/` - API приложение (модели, views, serializers)
- `accounts/` - Аутентификация
- `frontend/` - React приложение
- `docker-compose.yml` - Конфигурация Docker
- `requirements.txt` - Python зависимости

## Проблемы?

1. **Ошибка подключения к БД**: Убедитесь, что PostgreSQL запущен или используйте SQLite (USE_SQLITE=True)
2. **Ошибка CORS**: Проверьте настройки CORS_ALLOWED_ORIGINS в settings.py
3. **Ошибка миграций**: Выполните `python manage.py makemigrations` перед `migrate`

