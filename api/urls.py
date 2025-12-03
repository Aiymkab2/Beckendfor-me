from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'services', views.ServiceViewSet, basename='service')
router.register(r'parts', views.PartViewSet, basename='part')
router.register(r'appointments', views.AppointmentViewSet, basename='appointment')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'consultation', views.ConsultationViewSet, basename='consultation')

# Admin routes
router.register(r'admin/appointments', views.AdminAppointmentViewSet, basename='admin-appointment')
router.register(r'admin/services', views.AdminServiceViewSet, basename='admin-service')
router.register(r'admin/parts', views.AdminPartViewSet, basename='admin-part')

urlpatterns = [
    path('', include(router.urls)),
    path('masters/', views.MasterListView.as_view(), name='masters'),
    path('cart/add/', views.CartView.as_view(), name='cart-add'),
    path('orders/create/', views.CreateOrderView.as_view(), name='order-create'),
    path('admin/parts/orders/', views.AdminPartOrderView.as_view(), name='admin-part-orders'),
]

