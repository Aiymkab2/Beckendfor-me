from django.db import models
from django.contrib.auth.models import User


class Service(models.Model):
    title = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')
    duration_minutes = models.IntegerField(verbose_name='Длительность (минуты)')
    price_kzt = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена (KZT)')
    category = models.CharField(max_length=100, verbose_name='Категория')
    image = models.ImageField(upload_to='services/', blank=True, null=True, verbose_name='Изображение')
    active = models.BooleanField(default=True, verbose_name='Активна')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'
        ordering = ['title']

    def __str__(self):
        return self.title


class Part(models.Model):
    sku = models.CharField(max_length=100, unique=True, verbose_name='SKU')
    title = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')
    price_kzt = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена (KZT)')
    stock_quantity = models.IntegerField(default=0, verbose_name='Количество на складе')
    supplier = models.CharField(max_length=200, blank=True, verbose_name='Поставщик')
    image = models.ImageField(upload_to='parts/', blank=True, null=True, verbose_name='Изображение')
    active = models.BooleanField(default=True, verbose_name='Активна')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Запчасть'
        verbose_name_plural = 'Запчасти'
        ordering = ['title']

    def __str__(self):
        return f'{self.title} ({self.sku})'


class Master(models.Model):
    name = models.CharField(max_length=200, verbose_name='Имя мастера')
    specialization = models.CharField(max_length=200, verbose_name='Специализация')
    phone = models.CharField(max_length=20, verbose_name='Телефон')
    active = models.BooleanField(default=True, verbose_name='Активен')

    class Meta:
        verbose_name = 'Мастер'
        verbose_name_plural = 'Мастера'

    def __str__(self):
        return self.name


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает'),
        ('confirmed', 'Подтверждена'),
        ('cancelled', 'Отменена'),
        ('done', 'Выполнена'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments', verbose_name='Клиент')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='appointments', verbose_name='Услуга')
    master = models.ForeignKey(Master, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments', verbose_name='Мастер')
    appointment_datetime = models.DateTimeField(verbose_name='Дата и время')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Статус')
    notes = models.TextField(blank=True, verbose_name='Примечания')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Запись'
        verbose_name_plural = 'Записи'
        ordering = ['-appointment_datetime']

    def __str__(self):
        return f'{self.user.username} - {self.service.title} - {self.appointment_datetime}'


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает'),
        ('processing', 'В обработке'),
        ('shipped', 'Отправлен'),
        ('delivered', 'Доставлен'),
        ('cancelled', 'Отменен'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders', verbose_name='Клиент')
    total_kzt = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Сумма (KZT)')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Статус')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']

    def __str__(self):
        return f'Заказ #{self.id} - {self.user.username} - {self.total_kzt} KZT'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name='Заказ')
    part = models.ForeignKey(Part, on_delete=models.CASCADE, related_name='order_items', verbose_name='Запчасть')
    quantity = models.IntegerField(verbose_name='Количество')
    price_at_order = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена на момент заказа')

    class Meta:
        verbose_name = 'Элемент заказа'
        verbose_name_plural = 'Элементы заказа'

    def __str__(self):
        return f'{self.part.title} x{self.quantity}'


class ConsultationMessage(models.Model):
    STATUS_CHOICES = [
        ('new', 'Новое'),
        ('answered', 'Отвечено'),
        ('closed', 'Закрыто'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='consultations', verbose_name='Клиент')
    message = models.TextField(verbose_name='Сообщение')
    reply = models.TextField(blank=True, verbose_name='Ответ')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new', verbose_name='Статус')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Консультация'
        verbose_name_plural = 'Консультации'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} - {self.created_at}'

