from django.shortcuts import render
from rest_framework import generics
from .serializers import (
    UserSerializer, CategorySerializer, ProductSerializer, ProductImageSerializer,
    ReviewSerializer, OrderSerializer, OrderItemSerializer, CartSerializer, CartItemSerializer,
    PaymentSerializer)
from products.models import Product, Category, ProductImage, Review, User
from orders.models import Order, OrderItem, Cart, CartItem
from payments.models import Payment

# Create your views here.