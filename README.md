# Seemanchal Makhana - E-Commerce Platform Documentation

## 🎯 Project Overview

**Seemanchal Makhana** is a comprehensive e-commerce platform built with **Next.js 15** for selling traditional Indian foods, spices, and ingredients. The application features a full-stack solution with user authentication, product management, shopping cart, payment integration (Razorpay), order management, and admin dashboard.

## 📦 Tech Stack

### Frontend:

- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Static type checking
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
- **React Hook Form** - Efficient form management
- **Zod** - TypeScript-first schema validation
- **Lucide React** - Icon library
- **Embla Carousel** - Touch-friendly carousel library
- **React Query (TanStack Query)** - Data fetching and caching
- **Recharts** - Charting library for admin dashboard

### Backend:

- **Next.js API Routes** - Serverless backend
- **NextAuth.js v4** - Authentication library
- **Mongoose** - MongoDB ODM
- **Bcryptjs** - Password hashing
- **JWT** - JSON Web Tokens
- **Razorpay** - Payment gateway
- **Cloudinary** - Image hosting and CDN
- **ShipRocket** - Shipping integration (SDK)

### Database:

- **MongoDB** - NoSQL database

### Utilities:

- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Sonner** - Alternative toast library
- **Embla Carousel Auto Scroll** - Auto-scrolling carousel

## 🚀 Setup & Installation

### Prerequisites:

- Node.js 18+ and npm/yarn/pnpm
- MongoDB database (local or cloud - MongoDB Atlas)
- Razorpay merchant account
- Cloudinary account for image hosting
- ShipRocket account (optional, for shipping)
- GitHub OAuth app (optional, for social login)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd seemanchal-makhana
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Environment Setup

Create `.env.local` file in the root directory:

```bash
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-a-secret-key> # Run: openssl rand -base64 32

# Razorpay
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# ShipRocket (optional)
SHIPROCKET_EMAIL=<your-shiprocket-email>
SHIPROCKET_PASSWORD=<your-shiprocket-password>

# Email Configuration (if needed)
SMTP_HOST=<your-smtp-host>
SMTP_PORT=<your-smtp-port>
SMTP_USER=<your-smtp-user>
SMTP_PASSWORD=<your-smtp-password>
```

### Step 4: Database Setup

The application uses MongoDB with Mongoose. Make sure MongoDB is running:

```bash
# If using MongoDB locally
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env.local
```

### Step 5: Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Step 6: Build for Production

```bash
npm run build
npm start
```

---

## 🗄️ Database Models

### User Model

```typescript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "user" | "admin" | "customer" (default: "user"),
  avatar: String (default: "/diverse-user-avatars.png"),
  address: [ObjectId] (ref: Address),
  cart: ObjectId (ref: Cart),
  orders: [ObjectId] (ref: Order),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model

```typescript
{
  _id: ObjectId,
  name: String (required),
  slug: String (unique, required),
  description: String,
  price: Number (required),
  originalPrice: Number,
  images: [String],
  category: ObjectId (ref: Category, required),
  reviews: [ObjectId] (ref: Review),
  inStock: Boolean (default: true),
  featured: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model

```typescript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  clientOrderId: String (index),
  razorpayOrderId: String (index),
  razorpayPaymentId: String,
  razorpaySignature: String,
  paymentMethod: "razorpay" | "cod" (default: "cod"),
  amount: Number (in paise, required),
  currency: String (default: "INR"),
  items: [
    {
      productId: ObjectId (ref: Product),
      qty: Number,
      price: Number
    }
  ],
  status: "created" | "paid" | "failed" | "refund_pending" | "refunded" | "cancelled",
  orderStatus: "confirmed" | "preparing" | "ready_for_pickup" | "delayed" |
               "shipped" | "out_for_delivery" | "delivered" | "cancelled" |
               "returned" | "refund_initiated" | "refund_completed",
  deliveryAddress: ObjectId (ref: Address, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model

```typescript
{
  _id: ObjectId,
  product: ObjectId (ref: Product, required),
  user: ObjectId (ref: User, required),
  rating: Number (required),
  comment: String (required),
  status: "pending" | "approved" | "rejected" | "flagged" (default: "pending"),
  featured: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Address Model

```typescript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  fullName: String (required),
  phoneNumber: String (required),
  line1: String (required),
  line2: String,
  city: String (required),
  state: String (required),
  postalCode: String (required),
  country: String (required),
  isDefault: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model

```typescript
{
  _id: ObjectId,
  name: String (unique, required),
  key: String,
  products: [ObjectId] (ref: Product),
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Model

```typescript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  items: [
    {
      product: ObjectId (ref: Product),
      quantity: Number
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication

### NextAuth Configuration

The application uses **NextAuth.js v4** with **Credentials Provider**:

- **Strategy**: JWT (JSON Web Tokens)
- **Session Duration**: 30 days
- **Password Hashing**: bcryptjs with salt rounds of 10
- **Sign-in Page**: `/auth/login`

### Auth Flow:

1. **Registration** (`/api/auth/register`):

   - User submits name, email, password
   - Email uniqueness validation
   - Password hashing with bcryptjs
   - New user record created in MongoDB

2. **Login** (`NextAuth Credentials Provider`):

   - User submits email and password
   - Password compared with stored hash
   - JWT token created with user ID, email, and role
   - Session established for 30 days

3. **Session Management**:
   - JWT token stored in session
   - User data accessible via `useSession()` hook
   - Auth context wraps entire application

### Protected Routes:

- Admin routes: Require `admin` role
- Authenticated routes: Require valid session
- Public routes: No authentication required

Middleware configuration in [middleware.ts](middleware.ts) handles route protection.

---

## 🔌 API Endpoints

### Public Endpoints

#### Products

| Method | Endpoint               | Description                      | Query Params                |
| ------ | ---------------------- | -------------------------------- | --------------------------- |
| GET    | `/api/products`        | Get all products with pagination | `page`, `limit`, `featured` |
| GET    | `/api/products/[slug]` | Get product by slug              | -                           |

#### Authentication

| Method | Endpoint                  | Description       | Body                      |
| ------ | ------------------------- | ----------------- | ------------------------- |
| POST   | `/api/auth/register`      | Register new user | `{name, email, password}` |
| POST   | `/api/auth/[...nextauth]` | NextAuth endpoint | -                         |

---

### Protected Endpoints (Authenticated Users)

#### Orders

| Method | Endpoint          | Description       | Body                               |
| ------ | ----------------- | ----------------- | ---------------------------------- |
| GET    | `/api/orders`     | Get user's orders | -                                  |
| POST   | `/api/orders/cod` | Create COD order  | `{items, deliveryAddress, amount}` |

#### Razorpay Payment

| Method | Endpoint                       | Description           | Body                                                      |
| ------ | ------------------------------ | --------------------- | --------------------------------------------------------- |
| POST   | `/api/razorpay/order`          | Create Razorpay order | `{amount, items, deliveryAddress, clientOrderId}`         |
| POST   | `/api/razorpay/payment/verify` | Verify payment        | `{razorpayOrderId, razorpayPaymentId, razorpaySignature}` |

#### Cart

| Method | Endpoint    | Description           | Body      |
| ------ | ----------- | --------------------- | --------- |
| GET    | `/api/cart` | Get user's cart       | -         |
| POST   | `/api/cart` | Add/update cart items | `{items}` |

#### Reviews

| Method    | Endpoint                  | Description          | Body                           |
| --------- | ------------------------- | -------------------- | ------------------------------ |
| GET       | `/api/reviews`            | Get reviews          | `featured?`                    |
| POST      | `/api/reviews`            | Create review        | `{productId, rating, comment}` |
| PATCH/PUT | `/api/reviews/[reviewId]` | Update review status | `{status}`                     |

#### Address

| Method | Endpoint            | Description        | Body           |
| ------ | ------------------- | ------------------ | -------------- |
| GET    | `/api/address`      | Get user addresses | -              |
| POST   | `/api/address`      | Add new address    | Address object |
| PUT    | `/api/address/[id]` | Update address     | Address object |
| DELETE | `/api/address/[id]` | Delete address     | -              |

---

### Admin Endpoints (Admin Role Required)

#### Products

| Method | Endpoint                   | Description                   | Body                |
| ------ | -------------------------- | ----------------------------- | ------------------- |
| POST   | `/api/admin/products`      | Create product                | FormData with files |
| PUT    | `/api/admin/products/[id]` | Update product                | FormData with files |
| DELETE | `/api/admin/products/[id]` | Delete product                | -                   |
| GET    | `/api/admin/products`      | Get all products (admin view) | -                   |

#### Categories

| Method | Endpoint                       | Description        | Body     |
| ------ | ------------------------------ | ------------------ | -------- |
| GET    | `/api/admin/products/category` | Get all categories | -        |
| POST   | `/api/admin/products/category` | Create category    | `{name}` |

#### Users

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| GET    | `/api/admin/users` | Get all users |
