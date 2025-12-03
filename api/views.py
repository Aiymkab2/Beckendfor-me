from rest_framework import viewsets, status, generics, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny, IsAuthenticatedOrReadOnly
from django.db.models import Q
from django.utils import timezone
from decimal import Decimal

from .models import Service, Part, Master, Appointment, Order, OrderItem, ConsultationMessage
from .serializers import (
    ServiceSerializer, PartSerializer, MasterSerializer, AppointmentSerializer,
    OrderSerializer, OrderItemSerializer, ConsultationMessageSerializer
)


# Public views
class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(active=True)
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category']
    ordering_fields = ['price_kzt', 'title', 'created_at']
    ordering = ['title']

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class PartViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Part.objects.filter(active=True)
    serializer_class = PartSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'sku', 'supplier']
    ordering_fields = ['price_kzt', 'title', 'stock_quantity']
    ordering = ['title']


# Client views
class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.username == 'admin123' or user.is_staff:
            return Appointment.objects.all()
        return Appointment.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MasterListView(generics.ListAPIView):
    queryset = Master.objects.filter(active=True)
    serializer_class = MasterSerializer
    permission_classes = [AllowAny]


class CartView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # This is a simplified cart - in production, use session or Redis
        part_id = request.data.get('part_id')
        quantity = int(request.data.get('quantity', 1))
        
        try:
            part = Part.objects.get(id=part_id, active=True)
            if part.stock_quantity < quantity:
                return Response({'error': 'Недостаточно товара на складе'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            return Response({
                'part_id': part.id,
                'title': part.title,
                'price_kzt': float(part.price_kzt),
                'quantity': quantity,
                'total': float(part.price_kzt * quantity)
            })
        except Part.DoesNotExist:
            return Response({'error': 'Запчасть не найдена'}, 
                          status=status.HTTP_404_NOT_FOUND)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.username == 'admin123' or user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=user)


class ConsultationViewSet(viewsets.ModelViewSet):
    serializer_class = ConsultationMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.username == 'admin123' or user.is_staff:
            return ConsultationMessage.objects.all()
        return ConsultationMessage.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CreateOrderView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        items_data = request.data.get('items', [])
        if not items_data:
            return Response({'error': 'Корзина пуста'}, status=status.HTTP_400_BAD_REQUEST)

        total = Decimal('0')
        order_items = []

        for item_data in items_data:
            part_id = item_data.get('part_id')
            quantity = int(item_data.get('quantity', 1))

            try:
                part = Part.objects.get(id=part_id, active=True)
                if part.stock_quantity < quantity:
                    return Response({'error': f'Недостаточно {part.title} на складе'}, 
                                  status=status.HTTP_400_BAD_REQUEST)

                item_total = part.price_kzt * quantity
                total += item_total
                order_items.append({
                    'part': part,
                    'quantity': quantity,
                    'price_at_order': part.price_kzt
                })
            except Part.DoesNotExist:
                return Response({'error': f'Запчасть {part_id} не найдена'}, 
                              status=status.HTTP_404_NOT_FOUND)

        order = Order.objects.create(user=request.user, total_kzt=total)
        
        for item_data in order_items:
            OrderItem.objects.create(
                order=order,
                part=item_data['part'],
                quantity=item_data['quantity'],
                price_at_order=item_data['price_at_order']
            )
            # Update stock
            item_data['part'].stock_quantity -= item_data['quantity']
            item_data['part'].save()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Admin views
class AdminAppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.username == 'admin123' or user.is_staff:
            return Appointment.objects.all()
        return Appointment.objects.none()


class AdminPartOrderView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.username == 'admin123' or user.is_staff:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.none()


class AdminServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.username == 'admin123' or user.is_staff:
            return Service.objects.all()
        return Service.objects.none()


class AdminPartViewSet(viewsets.ModelViewSet):
    queryset = Part.objects.all()
    serializer_class = PartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.username == 'admin123' or user.is_staff:
            return Part.objects.all()
        return Part.objects.none()

    @action(detail=True, methods=['patch'], url_path='update-stock')
    def update_stock(self, request, pk=None):
        part = self.get_object()
        stock_quantity = request.data.get('stock_quantity')
        if stock_quantity is not None:
            part.stock_quantity = int(stock_quantity)
            part.save()
            return Response(PartSerializer(part).data)
        return Response({'error': 'stock_quantity required'}, status=status.HTTP_400_BAD_REQUEST)

