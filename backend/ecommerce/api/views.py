from django.forms import ValidationError
from django.shortcuts import render
from rest_framework import permissions
from rest_framework.response import Response
from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes
import uuid
import django.db.transaction as transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework import generics, filters, status
from .serializers import (
    SignupSerializer, CategorySerializer, ProductSerializer, ProductImageSerializer,
    ReviewSerializer, OrderSerializer, OrderItemSerializer, CartSerializer, CartItemSerializer,
    PaymentSerializer)
from products.models import Product, Category, ProductImage, Review, User
from orders.models import Order, OrderItem, Cart, CartItem
from payments.models import Payment
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import IsAuthorOrReadOnly
User = get_user_model()

# Create your views here.
class SignupAPIView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = SignupSerializer

class CategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['name']
    search_fields = ['name']
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]

class CategoryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser()]

class ProductListCreateAPIView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = {
        'category__name': ['exact', 'icontains'], 
        'price': ['gte', 'lte'],
        'name': ['icontains'],
    }
    search_fields = ['name', 'description', 'category__name']
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]

class ProductRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]

class ProductImageListCreateAPIView(generics.ListCreateAPIView):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAdminUser()]

class ProductImageRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAdminUser()]

class ReviewListCreateAPIView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    
    def get_permissions(self):
        # allow anyone to (even logged out) to view revies
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        # only logged in users can post
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        product_id = self.request.data.get('product')
        from products.models import Product

        try:
        # Use .get() to get the actual object, not .filter()
            product_obj = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise ValidationError({"product": "Product not found."})
        
        # BACKEND SECURITY: Check if user has a DELIVERED order for this product
        has_purchased = Order.objects.filter(
            user=self.request.user,
            status='DELIVERED',
            items__product_name=product_obj.name # This assumes OrderItem has a ForeignKey to Product
        ).exists()

        if not has_purchased:
            raise ValidationError("You can only review products you have purchased and received.")
        
        if Review.objects.filter(product=product_obj, user=self.request.user).exists():
            raise ValidationError({"detail": "You have already reviewed this product."})

        serializer.save(user=self.request.user)

class ReviewRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    # Use our custom permission: Anyone can view, only owner can Edit/Delete
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

class OrderListCreateAPIView(generics.ListCreateAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        data = request.data
        user = request.user

        print("Received Order Data:", data)  # Debugging line to see incoming data
        try:
            with transaction.atomic():
                # 1. Create the Order
                order = Order.objects.create(
                    user=user,
                    customer_name=data.get('customer_name'),
                    customer_email=data.get('customer_email'),
                    shipping_address=data.get('shipping_address'),
                    total_amount=Decimal(str(data.get('total_amount'))) # Convert to Decimal
                )

                # 2. Create Order Items
                items_data = data.get('items', [])

                

                for item in items_data:

                    OrderItem.objects.create(
                        order=order,
                        product_name=item['product_name'],
                        quantity=item['quantity'],
                        price_per_item=Decimal(str(item.get('price_per_item')))
                    )

                # 3. Create the Payment Record
                # Ensure all fields required by your Payment model are here
                Payment.objects.create(
                    user=user,  # Most Payment models require a user!
                    order=order,
                    amount=Decimal(str(data.get('total_amount'))),
                    payment_method=data.get('payment_method'),
                    transaction_id=str(uuid.uuid4()),
                    status='PENDING'
                )

                return Response({"id": order.id, "message": "Order created!"}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            # This prints the error to your terminal so you can see it!
            error_message = str(e)
            print("CRITICAL DATABASE ERROR")
            print(error_message)
            print("CRITICAL ERROR IN VIEW:", str(e)) 
            return Response({"error": "Internal Server Error", "message": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OrderRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

class OrderItemListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return OrderItem.objects.filter(order__user=self.request.user)

class OrderItemRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return OrderItem.objects.filter(order__user=self.request.user)

class CartListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CartRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

class CartItemListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)
    
    def perform_create(self, serializer):
        cart = Cart.objects.filter(user=self.request.user).first()
        serializer.save(cart=cart)

class CartItemRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

class PaymentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

class PaymentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)