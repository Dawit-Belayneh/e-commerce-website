from django.contrib import admin
from .models import User, Category, Product, ProductImage, Review
# Register your models here.

admin.site.register(User)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(Review)