# 🚀 GadgetECommerce - MERN Stack E-commerce Platform

A full-featured e-commerce platform built using the **MERN Stack** (MongoDB, Express, React, Node.js) with a modern and robust architecture. This application provides a complete online shopping experience, from product browsing and filtering to secure checkout and order management, for both users and administrators.

## ✨ Features

### 👤 User-Facing Application
- **Authentication:** Secure user registration and login using JWT.
- **Product Discovery:** Advanced product filtering, variant selection (e.g., color, storage), and detailed product pages.
- **Shopping Cart:** Persistent cart with quantity and variant management.
- **Checkout Process:** Dynamic and multi-step checkout with shipping options, address forms, and coupon/promo code validation.
- **Payment Integration:** Support for payment gateways like **Bkash**.
- **Order Management:** Users can view their order history and track order status.
- **And more:** SEO-friendly metadata, customer questions, product reviews, and a blog.

### 🔐 Admin Panel
- **Analytics Dashboard:** Overview of sales, orders, and user activity with summary cards and charts.
- **CRUD Operations:** Full management capabilities for:
  - Products (including variants, images, and inventory)
  - Categories, Subcategories, and Brands
  - Promotional Codes (percentage or fixed amount)
  - Content flags and carousels
- **Order Management:** View, update, and manage all customer orders.
- **User Management:** Control user roles and access permissions.

## 🛠️ Tech Stack

- **Frontend:**
  - **Framework:** React (with Vite)
  - **State Management:** Zustand
  - **UI Libraries:** MUI (Material-UI), Tailwind CSS, PrimeReact
  - **Animations:** Framer Motion
  - **Data Fetching:** Axios, TanStack Query

- **Backend:**
  - **Runtime:** Node.js
  - **Framework:** Express.js
  - **Database:** MongoDB with Mongoose ODM
  - **Authentication:** JSON Web Tokens (JWT) for role-based access
  - **File Uploads:** Multer

- **API:** Clean, RESTful API design following the Controller-Service-Model pattern.
- **Deployment:** Vercel (Frontend), Render/similar (Backend).

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- MongoDB (local instance or a cloud service like MongoDB Atlas)

### Backend Setup
1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `backend` root. This is required for environment variables like your database connection string and JWT secret.
    ```
    PORT=5000
    MONGODB_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```
4.  **Start the server:**
    - For development with auto-reloading:
      ```bash
      npm run nodemon
      ```
    - For production:
      ```bash
      npm start
      ```

### Frontend Setup
1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:5173` (or the address provided by Vite).