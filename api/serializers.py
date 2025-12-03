from rest_framework import serializers
from .models import Service, Part, Master, Appointment, Order, OrderItem, ConsultationMessage
from django.contrib.auth.models import User


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'description', 'duration_minutes', 'price_kzt', 
                 'category', 'image', 'active', 'created_at']
        read_only_fields = ['id', 'created_at']


class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = ['id', 'sku', 'title', 'description', 'price_kzt', 'stock_quantity',
                 'supplier', 'image', 'active', 'created_at']
        read_only_fields = ['id', 'created_at']


class MasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Master
        fields = ['id', 'name', 'specialization', 'phone', 'active']


class AppointmentSerializer(serializers.ModelSerializer):
    service_title = serializers.CharField(source='service.title', read_only=True)
    master_name = serializers.CharField(source='master.name', read_only=True, allow_null=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'user', 'user_username', 'service', 'service_title', 'master', 
                 'master_name', 'appointment_datetime', 'status', 'notes', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class OrderItemSerializer(serializers.ModelSerializer):
    part_title = serializers.CharField(source='part.title', read_only=True)
    part_sku = serializers.CharField(source='part.sku', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'part', 'part_title', 'part_sku', 'quantity', 'price_at_order']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'user_username', 'total_kzt', 'status', 
                 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class ConsultationMessageSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = ConsultationMessage
        fields = ['id', 'user', 'user_username', 'message', 'reply', 'status', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

