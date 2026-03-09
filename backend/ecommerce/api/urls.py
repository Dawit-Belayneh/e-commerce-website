from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

urlpatterns = [
    path('signup/', views.SignupAPIView.as_view(), name='signup'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('users/', views.UserListCreateAPIView.as_view(), name='user-list-create'),
    # path('user/<int:pk>/', views.UserRetrieveUpdateDestroyAPIView.as_view(), name='user-detail'),
    path('categories/', views.CategoryListCreateAPIView.as_view(), name='category-list-create'),
    path('category/<int:pk>/', views.CategoryRetrieveUpdateDestroyAPIView.as_view(), name='category-detail'),
    path('products/', views.ProductListCreateAPIView.as_view(), name='product-list-create'),
    path('products/<slug:slug>/', views.ProductRetrieveUpdateDestroyAPIView.as_view(), name='product-detail'),
    path('product-images/', views.ProductImageListCreateAPIView.as_view(), name='product-image-list-create'),
    path('product-image/<int:pk>/', views.ProductImageRetrieveUpdateDestroyAPIView.as_view(), name='product-image-detail'),
    path('reviews/', views.ReviewListCreateAPIView.as_view(), name='review-list-create'),
    path('review/<int:pk>/', views.ReviewRetrieveUpdateDestroyAPIView.as_view(), name='review-detail'),
    path('orders/', views.OrderListCreateAPIView.as_view(), name='order-list-create'),
    path('order/<int:pk>/', views.OrderRetrieveUpdateDestroyAPIView.as_view(), name='order-detail'),
    path('order-items/', views.OrderItemListCreateAPIView.as_view(), name='order-item-list-create'),
    path('order-item/<int:pk>/', views.OrderItemRetrieveUpdateDestroyAPIView.as_view(), name='order-item-detail'),
    path('carts/', views.CartListCreateAPIView.as_view(), name='cart-list-create'),
    path('cart/<int:pk>/', views.CartRetrieveUpdateDestroyAPIView.as_view(), name='cart-detail'),
    path('cart-items/', views.CartItemListCreateAPIView.as_view(), name='cart-item-list-create'),
    path('cart-item/<int:pk>/', views.CartItemRetrieveUpdateDestroyAPIView.as_view(), name='cart-item-detail'),
    path('payments/', views.PaymentListCreateAPIView.as_view(), name='payment-list-create'),
    path('payment/<int:pk>/', views.PaymentRetrieveUpdateDestroyAPIView.as_view(), name='payment-detail'),
] 