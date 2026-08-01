
# 🌾 AgriFlux

**Smart Agriculture Platform with AI Assistant**

A full-stack agriculture e-commerce platform built for Indian farmers. AgriFlux helps farmers buy seeds, fertilizers, tools, and other agricultural products online — combined with AI-powered farming advice, real-time weather forecasting, secure payments, and a bilingual (English/Hindi) interface.

> Built as a college major project at **CDAC ACTS, Pune** — PGCP-AC February 2026, Project No. 34
> Guide: **Ms. Shweta Singh**

---

## ✨ Key Features

- 🔐 **Multi-role system** — Farmers (Users) & Admin
- 🌦️ **Real-time weather forecast** with contextual farming advice
- 🤖 **AI chatbot (AgriBot)** for farming Q&A in Hindi and English (Groq · LLaMA 3.3 70B)
- 🔑 **Secure JWT-based authentication** (Spring Security)
- 💳 **Razorpay payment gateway** integration (COD & Online Payment)
- 🌐 **Bilingual UI** — instant English/Hindi language switching
- 🛒 Full shopping flow — cart, checkout, order tracking (5-stage status)
- 🧾 Invoice/order handling built directly into the Spring Boot backend

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Vite, Redux Toolkit, React Router DOM, Axios, Tailwind CSS |
| **Backend** | Java, Spring Boot, Spring Security, JWT, Spring Data JPA, Hibernate |
| **Database** | MySQL |
| **AI** | Groq API (LLaMA 3.3 70B) |
| **Weather** | OpenWeatherMap API |
| **Payments** | Razorpay |
| **API Testing** | Postman |
| **Deployment** | Docker, Render, Railway MySQL |

---

## 🏛️ System Architecture

AgriFlux follows a clean **3-tier architecture**:

```
React (Vite)  ───REST/JSON───▶  Spring Boot API  ───SQL───▶  MySQL
   :5173                             :8080                     :3306
```

| Layer | Technology | Port | Responsibility |
|---|---|---|---|
| Frontend | React + Vite + Redux Toolkit | 5173 | UI, State Management |
| Backend | Spring Boot (Java) | 8080 | Business Logic, REST APIs, Security |
| Database | MySQL | 3306 | Data Persistence |

### External APIs

| Service | Purpose | Technology |
|---|---|---|
| Groq API | AI Chatbot (AgriBot) | LLaMA 3.3 70B |
| OpenWeatherMap | Weather forecast + farming advice | REST API |
| Razorpay | Online payment processing | Payment Gateway |

> **Note:** All order and invoice handling is managed within the Spring Boot backend — there is no separate microservice.

---

## 📁 Backend Structure (Spring Boot)

```
com.agriflux.controller   → REST API endpoints (Auth, Product, Cart, Order, Weather, Chatbot, Payment)
com.agriflux.service      → Business logic layer
com.agriflux.repository   → JPA repositories for DB queries
com.agriflux.model        → JPA Entity classes (User, Product, Order, Cart, etc.)
com.agriflux.dto          → Request and Response DTOs
com.agriflux.security     → JWT filter, JWT utility, UserDetailsService
com.agriflux.config       → Security, CORS, Razorpay, App config
com.agriflux.enums        → Role, OrderStatus, PaymentMethod, PaymentStatus
com.agriflux.exception    → Global exception handler, custom exceptions
```

---

## 🗄️ Database Schema (Key Tables)

| Table | Key Columns | Relationship |
|---|---|---|
| `users` | id, name, email, password, role | Has many orders, addresses, one cart |
| `products` | id, name, price, stock_quantity, category_id | Belongs to category |
| `categories` | id, name, description, is_active | Has many products |
| `cart` | id, user_id | One per user, has many cart_items |
| `cart_items` | id, cart_id, product_id, quantity | Belongs to cart and product |
| `orders` | id, user_id, address_id, total_amount, status | Has many order_items |
| `order_items` | id, order_id, product_id, price_at_purchase | Price locked at order time |
| `addresses` | id, user_id, full_name, city, state, pincode | Belongs to user |

---

## 🔌 REST API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login and get JWT token | Public |

### Products
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/{id}` | Get product by ID | Public |
| GET | `/api/products/search?keyword=` | Search products | Public |
| GET | `/api/products/category/{id}` | Products by category | Public |
| GET | `/api/products/featured` | Featured products | Public |
| POST | `/api/admin/products` | Create product | Admin |
| PUT | `/api/admin/products/{id}` | Update product | Admin |
| DELETE | `/api/admin/products/{id}` | Soft delete product | Admin |

### Cart
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/cart` | Get user cart | User |
| POST | `/api/cart/add` | Add item to cart | User |
| PUT | `/api/cart/update/{id}?quantity=` | Update quantity | User |
| DELETE | `/api/cart/remove/{id}` | Remove item | User |
| DELETE | `/api/cart/clear` | Clear cart | User |

### Orders
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/orders/place` | Place order | User |
| GET | `/api/orders/my-orders` | Get my orders | User |
| GET | `/api/orders/{id}` | Get order by ID | User |
| PUT | `/api/orders/{id}/cancel` | Cancel order | User |
| GET | `/api/admin/orders` | Get all orders | Admin |
| PUT | `/api/admin/orders/{id}/status` | Update order status | Admin |

### Other
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/weather?city=` | Get weather by city | Public |
| GET | `/api/weather/forecast?city=` | Get 5-day forecast | Public |
| POST | `/api/chatbot/chat` | Chat with AgriBot | Public |
| POST | `/api/payment/create-order` | Create Razorpay order | User |
| POST | `/api/payment/verify` | Verify payment | User |

---

## 💻 Frontend Tech Stack

| Library | Purpose |
|---|---|
| React 18 | UI component library |
| Vite 5 | Build tool and dev server |
| Redux Toolkit | Global state management (auth, cart, language) |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP client with JWT interceptor |
| Tailwind CSS v3 | Utility-first styling |

### Pages

| Page | Route | Access | Key Features |
|---|---|---|---|
| Home | `/` | Public | Hero, featured products, categories, weather banner |
| Login | `/login` | Public | JWT auth, form validation |
| Register | `/register` | Public | User registration |
| Products | `/products` | Public | Search, filter, sort, stock badges |
| Product Detail | `/products/:id` | Public | Image, quantity, add to cart, buy now |
| Cart | `/cart` | User | Items, update qty, remove, order summary |
| Checkout | `/checkout` | User | Address selection, payment, order notes |
| Orders | `/orders` | User | Order history, status tracking |
| Weather | `/weather` | Public | City search, forecast, farming advice |
| Settings | `/settings` | Public | Language switch (English/Hindi) |
| Admin Dashboard | `/admin` | Admin | Stats, recent orders, quick actions |
| Manage Products | `/admin/products` | Admin | Add, edit, delete, search products |
| Manage Orders | `/admin/orders` | Admin | View all orders, update status |

---

## 🚀 Getting Started

### Prerequisites

- Java 17+ and Maven
- Node.js 18+ and npm
- MySQL 8+
- API keys: Groq, OpenWeatherMap, Razorpay

### Clone the repository

```bash
git clone https://github.com/<your-username>/agriflux.git
cd agriflux
```

### Backend (Spring Boot)

```bash
cd backend
# configure application.properties with DB credentials & API keys
mvn spring-boot:run
```

Runs on `http://localhost:8080`

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

### Environment Variables

Create a `.env` (frontend) and configure `application.properties` (backend) with:

```
DB_URL, DB_USERNAME, DB_PASSWORD
JWT_SECRET
GROQ_API_KEY
OPENWEATHER_API_KEY
RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
```

> Store all API keys, DB credentials, and JWT secrets as environment variables — never commit them to source control.

---

## 📦 Deployment

| Component | Platform |
|---|---|
| Backend (Spring Boot) | Render (Dockerized) |
| Frontend (React) | Render |
| Database (MySQL) | Railway MySQL |
| Containerization | Docker |

---

## 🔮 Future Improvements

- Google OAuth2 login
- Email notifications for order updates
- Product reviews & ratings
- Admin analytics dashboard with charts
- Cloudinary integration for product images
- Redis caching for frequently accessed data

---

## 🛠️ Built With

Java • Spring Boot • Spring Security • JWT • React + Vite • Redux Toolkit • Tailwind CSS • MySQL • Spring Data JPA • Hibernate • Groq AI • OpenWeatherMap • Razorpay • Docker • Render • Railway MySQL

---

## 👥 Team

| Name | PRN |
|---|---|
| Gaurav Mahadik | 260240120061 |
| Harsh Jain | 260240120070 |
| Shrutik Choudhary | 260240120179 |
| Krushnal Mahajan | 260240120092 |
| Vivek Bhogade | 260240120043 |

**Project Guide:** Ms. Shweta Singh
**Institute:** CDAC ACTS, Pune

---

## 📄 License

This project was built as a college major project. Feel free to fork and adapt for learning purposes.
