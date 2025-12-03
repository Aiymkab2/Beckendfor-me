from django.contrib import admin
from .models import Service, Part, Master, Appointment, Order, OrderItem, ConsultationMessage


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'price_kzt', 'duration_minutes', 'active']
    list_filter = ['active', 'category']
    search_fields = ['title', 'description']


@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    list_display = ['title', 'sku', 'price_kzt', 'stock_quantity', 'active']
    list_filter = ['active']
    search_fields = ['title', 'sku', 'description']


@admin.register(Master)
class MasterAdmin(admin.ModelAdmin):
    list_display = ['name', 'specialization', 'phone', 'active']
    list_filter = ['active']


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'service', 'master', 'appointment_datetime', 'status']
    list_filter = ['status', 'appointment_datetime']
    search_fields = ['user__username', 'service__title']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_kzt', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username']


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'part', 'quantity', 'price_at_order']
    list_filter = ['order__status']


@admin.register(ConsultationMessage)
class ConsultationMessageAdmin(admin.ModelAdmin):
    list_display = ['user', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'message']

