# 🛒 EthioShop - Full Stack E-commerce Platform

## 🚀 Overview

EthioShop is a full-stack e-commerce  web application built using Django REST Framework and React.
It allows users to browse products, add items to cart, place orders, and manage their accounts securely.

This project demonstrates real-world backend architecture, API design, and frontend integration.

---

## 🧑‍💻 Tech Stack

### Backend

* Django
* Django REST Framework
* JWT Authentication (SimpleJWT)
* SQLite

### Frontend

* React
* Axios
* React Router

---

## ✨ Features

### 🔐 Authentication

* User registration (Signup)
* Login with JWT authentication
* Protected API endpoints

### 🛍 Products & Categories

* View all products
* Filter by category
* Featured Products
* Search products
* Admin product management

### 🛒 Cart System

* Add to cart
* Update quantity
* Remove items
* User-specific cart

### 📦 Order System

* Place orders
* View personal orders
* Secure order handling

### ⭐ Reviews

* Add product reviews
* Only authenticated and Purchase the item users can review

### 🔒 Permissions

* Public access for viewing products
* Admin-only product management
* User-based access control for orders and cart

---

## 📁 Project Structure

backend/
├── ecommerce/
├── products/
├── orders/
├── payments/

frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   └── api/

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Dawit-Belayneh/e-commerce-website.git
cd e-commerce-website
```

### 2. Backend Setup

```bash
cd backend/ecommerce
python -m venv venv
venv\Scripts\activate   # Windows

pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔑 API Authentication

Login to get JWT token:

```http
POST /api/token/
```

Use token in headers:

```
Authorization: Bearer <your_token>
```

---

## 📸 Screenshots

<img width="1348" height="622" alt="Screenshot 2026-03-23 103235" src="https://github.com/user-attachments/assets/52c312db-e6d7-44f0-92db-6d8af1d69a59" />
<img width="1351" height="637" alt="Screenshot 2026-03-23 103413" src="https://github.com/user-attachments/assets/11905792-4964-4415-994a-cb00a64ae195" />
<img width="1350" height="634" alt="Screenshot 2026-03-23 103448" src="https://github.com/user-attachments/assets/85e8df02-a395-44f7-af79-b2a9ed433bcf" />
<img width="1348" height="636" alt="Screenshot 2026-03-23 103517" src="https://github.com/user-attachments/assets/ef34b2b2-9973-4401-b085-0600e7f9fdc9" />
<img width="1354" height="630" alt="Screenshot 2026-03-23 103555" src="https://github.com/user-attachments/assets/45bb27fc-f28c-4384-a37c-c3bba17f5bda" />
<img width="1345" height="631" alt="Screenshot 2026-03-23 103703" src="https://github.com/user-attachments/assets/327dd959-cce2-462d-9451-39528f8d8eaf" />
<img width="1343" height="628" alt="Screenshot 2026-03-23 103741" src="https://github.com/user-attachments/assets/247a9fdf-a92d-4742-8337-0271fde46c3b" />

---

## 🎯 Future Improvements

* Payment integration (Stripe / Chapa)
* Seller dashboard
* Order tracking with map
* Email notifications

---

## 🙌 Author

**Dawit Belayneh**
Aspiring Full Stack Developer

---

## 📢 Status

🚧 This project is under continuous improvement as I learn and grow in full-stack development.

---

## ⭐ Support

If you like this project, please give it a ⭐ on GitHub!
