🌾 AgriFlux

A full-stack agriculture e-commerce platform built for Indian farmers.

AgriFlux helps farmers buy seeds, fertilizers, tools, and other agricultural products online — combined with AI-powered farming advice, real-time weather forecasting, secure payments, and a bilingual (English/Hindi) interface.

✨ Key Features
🔐 Multi-role system — Farmers (Users) & Admin
🌦️ Real-time weather forecast with contextual farming advice
🤖 AI chatbot (AgriBot) for farming Q&A in Hindi and English
🔑 Secure JWT-based authentication
💳 Razorpay payment gateway integration
🧾 PDF invoice generation via a dedicated .NET microservice
🌐 Bilingual UI — instant English/Hindi language switching
🧩 Microservices architecture (Spring Boot + .NET)
🏗️ Tech Stack
Layer	Technology
Frontend	React + Vite, Redux Toolkit, React Router DOM, Axios, Tailwind CSS, Framer Motion
Backend	Spring Boot (Java), Spring Security, Spring Data JPA
Database	MySQL
Invoice Service	ASP.NET Core (C#) + iText7
AI	Groq API (LLaMA 3.3 70B)
Weather	OpenWeatherMap API
Payments	Razorpay
🏛️ System Architecture

AgriFlux follows a 3-tier architecture with an additional microservice for PDF generation:

React (Vite)  →  Spring Boot API  →  MySQL
  :5173            :8080
                     ↑
                     │  (order data via REST)
                     │
            .NET Invoice Service
                  :5000
Layer	Technology	Port	Responsibility
Frontend	React + Vite + Redux	5173	UI, State Management
Backend	Spring Boot (Java)	8080	Business Logic, REST APIs, Security
Database	MySQL	3306	Data Persistence
Invoice Service	ASP.NET Core	5000	PDF Invoice Generation
External APIs
Service	Purpose	Technology
Groq API	AI Chatbot (AgriBot)	LLaMA 3.3 70B
OpenWeatherMap	Weather forecast + farming advice	REST API
Razorpay	Online payment processing	Payment Gateway
iText7	PDF invoice generation	C# Library
📁 Backend Structure (Spring Boot)
com.agriflux.controller   → REST API endpoints (Auth, Product, Cart, Order, Weather, Chatbot, Payment)
com.agriflux.service      → Business logic layer
com.agriflux.repository   → JPA repositories for DB queries
com.agriflux.model        → JPA Entity classes (User, Product, Order, Cart, etc.)
com.agriflux.dto          → Request and Response DTOs
com.agriflux.security     → JWT filter, JWT utility, UserDetailsService
com.agriflux.config       → Security, CORS, Razorpay, App config
com.agriflux.enums        → Role, OrderStatus, PaymentMethod, PaymentStatus
com.agriflux.exception    → Global exception handler, custom exceptions
Database Schema (Key Tables)
Table	Key Columns	Relationship
users	id, name, email, password, role	Has many orders, addresses, one cart
products	id, name, price, stock_quantity, category_id	Belongs to category
categories	id, name, description, is_active	Has many products
cart	id, user_id	One per user, has many cart_items
cart_items	id, cart_id, product_id, quantity	Belongs to cart and product
orders	id, user_id, address_id, total_amount, status	Has many order_items
order_items	id, order_id, product_id, price_at_purchase	Price locked at order time
addresses	id, user_id, full_name, city, state, pincode	Belongs to user
🔌 REST API Endpoints
Authentication
Method	Endpoint	Description	Access
POST	/api/auth/register	Register new user	Public
POST	/api/auth/login	Login and get JWT token	Public
Products
Method	Endpoint	Description	Access
GET	/api/products	Get all products	Public
GET	/api/products/{id}	Get product by ID	Public
GET	/api/products/search?keyword=	Search products	Public
GET	/api/products/category/{id}	Products by category	Public
GET	/api/products/featured	Featured products	Public
POST	/api/admin/products	Create product	Admin
PUT	/api/admin/products/{id}	Update product	Admin
DELETE	/api/admin/products/{id}	Soft delete product	Admin
Cart
Method	Endpoint	Description	Access
GET	/api/cart	Get user cart	User
POST	/api/cart/add	Add item to cart	User
PUT	/api/cart/update/{id}?quantity=	Update quantity	User
DELETE	/api/cart/remove/{id}	Remove item	User
DELETE	/api/cart/clear	Clear cart	User
Orders
Method	Endpoint	Description	Access
POST	/api/orders/place	Place order	User
GET	/api/orders/my-orders	Get my orders	User
GET	/api/orders/{id}	Get order by ID	User
PUT	/api/orders/{id}/cancel	Cancel order	User
GET	/api/admin/orders	Get all orders	Admin
PUT	/api/admin/orders/{id}/status	Update order status	Admin
Other
Method	Endpoint	Description	Access
GET	/api/weather?city=	Get weather by city	Public
GET	/api/weather/forecast?city=	Get 5-day forecast	Public
POST	/api/chatbot/chat	Chat with AgriBot	Public
POST	/api/payment/create-order	Create Razorpay order	User
POST	/api/payment/verify	Verify payment	User
GET	/api/invoice/{id} (.NET)	Download PDF invoice	User
💻 Frontend
Tech Stack
Library	Purpose
React 18	UI component library
Vite 5	Build tool and dev server
Redux Toolkit	Global state management (auth, cart, language)
React Router DOM v6	Client-side routing
Axios	HTTP client with JWT interceptor
Framer Motion	Animations and transitions
Tailwind CSS v3	Utility-first styling
React Hot Toast	Toast notifications
Lucide React	Icon library
Pages
Page	Route	Access	Key Features
Home	/	Public	Hero, featured products, categories, weather banner
Login	/login	Public	JWT auth, form validation
Register	/register	Public	User registration
Products	/products	Public	Search, filter, sort, stock badges
Product Detail	/products/:id	Public	Image, quantity, add to cart, buy now
Cart	/cart	User	Items, update qty, remove, order summary
Checkout	/checkout	User	Address selection, payment, order notes
Orders	/orders	User	Order history, status tracking, invoice
Weather	/weather	Public	City search, forecast, farming advice
Settings	/settings	Public	Language switch (English/Hindi)
Admin Dashboard	/admin	Admin	Stats, recent orders, quick actions
Manage Products	/admin/products	Admin	Add, edit, delete, search products
Manage Orders	/admin/orders	Admin	View all orders, update status
🚀 Getting Started
Prerequisites
Java 17+ and Maven
Node.js 18+ and npm
MySQL 8+
.NET 6+ SDK
API keys: Groq, OpenWeatherMap, Razorpay
1. Clone the repository
bash
git clone https://github.com/<your-username>/agriflux.git
cd agriflux
2. Backend (Spring Boot)
bash
cd backend
# configure application.properties with DB credentials & API keys
mvn spring-boot:run

Runs on http://localhost:8080

3. Frontend (React + Vite)
bash
cd frontend
npm install
npm run dev

Runs on http://localhost:5173

4. Invoice Microservice (.NET)
bash
cd invoice-service
dotnet run

Runs on http://localhost:5000

5. Environment Variables

Create a .env (frontend) and configure application.properties / appsettings.json (backend/.NET) with:

DB_URL, DB_USERNAME, DB_PASSWORD
JWT_SECRET
GROQ_API_KEY
OPENWEATHER_API_KEY
RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
🔮 Future Improvements
Google OAuth2 login
Email notifications for order updates
Product reviews & ratings
Admin analytics dashboard with charts
Cloudinary integration for product images
Redis caching for frequently accessed data
Docker containerization
Cloud deployment (Railway / Vercel / AWS)
📦 Deployment
Component	Suggested Platform
Backend (Spring Boot)	Railway / Render
Frontend (React)	Vercel
Database (MySQL)	PlanetScale / Railway MySQL
Invoice Service (.NET)	Railway

Store all API keys, DB credentials, and JWT secrets as environment variables — never commit them to source control.

🛠️ Built With

Spring Boot • React + Vite • MySQL • .NET • Groq AI • Razorpay

📄 License

This project was built as a college major project. Feel free to fork and adapt for learning purposes.
