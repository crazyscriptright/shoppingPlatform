# D'Florencis - Premium Shopping Platform

<div align="center">

<img src=".github/logo.webp" alt="D'Florencis Logo" width="200"/>

**A modern, full-stack e-commerce platform built with React, Node.js, and PostgreSQL**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

---

## About

D'Florencis is a premium shopping platform offering a curated collection of fashion items including bags, shoes, watches, perfumes, and apparel. Built with modern technologies and best practices, it provides a seamless shopping experience with features like real-time cart management, secure authentication, and an intuitive admin dashboard.

---

## Features

### Customer Features

- **User Authentication**

  - Secure registration and login
  - JWT token-based authentication
  - Password recovery functionality
  - Profile management

- **Product Browsing**

  - Browse products by category (Bags, Shoes, Watches, Perfumes, Men's & Women's Fashion)
  - Advanced filtering (price range, category, new arrivals, featured)
  - Multiple sorting options (newest, price, popularity)
  - Infinite scroll pagination

- **Shopping Experience**

  - Add/remove items from cart
  - Real-time cart updates
  - Quantity management
  - Product details with image carousel

- **Checkout & Orders**
  - Streamlined checkout process
  - Razorpay payment integration
  - Order tracking
  - Order history
  - Delivery status updates

### Admin Features

- **Dashboard**

  - Real-time statistics (products, orders, users, revenue)
  - Recent orders overview

- **Product Management**

  - Add/Edit/Delete products
  - Stock management
  - Category assignment
  - Pricing and discounts

- **Order Management**

  - View all orders
  - Update order status
  - Track deliveries

- **User Management**
  - View all users
  - User role management

---

## Tech Stack

### Frontend

- **Framework:** React 19.2.0
- **Routing:** React Router DOM 7.10
- **Styling:** Tailwind CSS 4.0
- **UI Components:** Lucide React (icons)
- **HTTP Client:** Axios
- **Authentication:** JWT Decode
- **Fonts:** Playfair Display, Custom fonts

### Backend

- **Runtime:** Node.js 22+
- **Framework:** Express.js 4.21
- **Database:** PostgreSQL 14+
- **ORM:** node-postgres (pg)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **Environment:** dotenv
- **Security:** CORS, Helmet

---

## Screenshots

### Homepage

![Homepage](.github/home.png)

### Shop Page

![Shop](.github/shop.png)

---

## Installation

### Prerequisites

- Node.js 22+ installed
- PostgreSQL 14+ installed and running
- npm or yarn package manager
- Git

### Clone Repository

```bash
git clone https://github.com/crazyscriptright/shoppingPlatform.git
cd shoppingPlatform
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Edit .env with your configuration

# Initialize database
npm run init-db

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file

# Start development server
npm run dev
```

---

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/shopping_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Payment Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key

# App Configuration
VITE_APP_NAME=D'Florencis
```

---

## Project Structure

```
shopping/
├── backend/
│   ├── config/
│   │   ├── db.js              # Database configuration
│   │   └── init-db.js         # Database initialization
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── products.js        # Product routes
│   │   ├── cart.js            # Cart routes
│   │   ├── orders.js          # Order routes
│   │   └── admin.js           # Admin routes
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Entry point
│
├── frontend/
│   ├── public/
│   │   ├── collection/        # Collection images
│   │   ├── formated/          # Product images
│   │   └── shopping/          # UI assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── FeatureCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SectionHeader.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Collection.jsx
│   │   │   ├── Account.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── admin/
│   │   │       ├── AdminProducts.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       └── AdminUsers.jsx
│   │   ├── services/
│   │   │   └── api.js         # Axios configuration
│   │   ├── utils/
│   │   │   └── orderUtils.js  # Order utilities
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env                   # Environment variables
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .github/                   # GitHub assets
├── .gitignore
└── README.md
```

---

## Color Palette

```css
--dark-grey: #393D3F      /* Primary text & dark backgrounds */
--off-white: #FDFDFF      /* Background & light surfaces */
--warm-grey: #C6C5B9      /* Borders & secondary elements */
--soft-teal: #62929E      /* Primary actions & highlights */
--muted-slate: #546A7B    /* Secondary text & accents */
```

---

## License

This project is licensed under the MIT License.

---

## Author

Anil - [crazyscriptright](https://github.com/crazyscriptright)
