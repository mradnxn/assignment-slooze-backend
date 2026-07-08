# S.H.I.E.L.D. Food Court (Take-Home Assignment)

A secure full-stack food ordering application designed for Nick Fury and his S.H.I.E.L.D. team members. Built using **Next.js 16 (App Router)** and **NestJS + Prisma + PostgreSQL**.

---

## 🛠️ Tech Stack & Architecture

- **Backend**: NestJS, Prisma ORM, PostgreSQL. (Compiled in standard **CommonJS** mode for production-grade module resolution and execution).
- **Frontend**: Next.js 16 (App Router), React 19, Axios, Tailwind v4.
- **UI Design System**: Clean, premium off-white (`#f8fafc`) and blue theme focusing on high typography readability and responsive grids (no glassmorphism).

---

## 🔐 Advanced Security & Architecture Implementations

### 1. Secure HTTP-Only Cookie Session Model
To safeguard credentials against Cross-Site Scripting (XSS) token theft:
- Client-side `localStorage` token storage is **completely deleted**.
- On successful login, the NestJS backend sets the JWT inside an **HttpOnly** cookie (`access_token`) with the `SameSite=Lax` and `Path=/` attributes. JavaScript cannot read this cookie.
- The frontend Axios instance is configured with `withCredentials: true` to automatically and securely attach this cookie to all outgoing API requests.
- To terminate a session, the frontend calls the backend `POST /auth/logout` endpoint, which securely clears the cookie.

### 2. Hybrid SSR & Leaf Client Component Tree
To maintain instant loading and search visibility:
- **Server Component Rendering (SSR)**: Layouts, navigation headers, restaurant feeds, and order tables are statically pre-rendered on the server side (via Next.js Server Components that resolve auth context and fetch secure data directly from the server before delivering HTML).
- **Leaf Client Component Interactivity**: Interactive elements (login buttons, payment dropdown select elements, quantity adjusters, checkout trigger states) are isolated to lightweight client components wrapped in a central `<CartProvider>` context.

### 3. RBAC (Role-Based Access Control) Matrix
The application strictly enforces user access rules across controllers and components:

| Function | ADMIN | MANAGER | MEMBER |
| :--- | :---: | :---: | :---: |
| **View Restaurants & Menu Items** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Create Order (Add food items)** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Place Order (Checkout & Pay)** | ✅ Yes | ✅ Yes | ❌ No |
| **Cancel Order** | ✅ Yes | ✅ Yes | ❌ No |
| **Update Order Payment Method** | ✅ Yes | ❌ No | ❌ No |

### 4. Relational Multi-Tenancy (10-Point Bonus Objective)
We have implemented a relational access model to isolate India and America geographic nodes:
- **India Node** managers (Captain Marvel) and members (Thanos, Thor) can only view and place orders to restaurants in **India** ("Royal Indian Feast", "Mumbai Street Eats").
- **America Node** managers (Captain America) and members (Travis) are restricted strictly to restaurants in **America** ("Liberty Diner", "NY Slice Pizzeria").
- **Global Admin** (Nick Fury) has global access to bypass geographic tenancy rules.
- **Backend Guard Enforcements (`TenancyGuard`)**:
  - Automatically overrides listing queries to filter by the user's country context.
  - Queries database properties on path IDs (e.g. `/restaurants/:id` or `/orders/:id`) to block cross-border access with `403 Forbidden` errors.
  - Verifies that `MEMBER` users can only read or cancel their *own* orders, whereas `MANAGER` users can view all orders in their country node.

---

## 🔑 Quick Demo Credentials

All accounts are seeded in the database. The login screen features a **Quick Login Grid** where you can click any profile card to instantly auto-fill credentials:

| Name | Email | Role | Country Node | Default Password |
| :--- | :--- | :--- | :--- | :--- |
| **Nick Fury** | `nick.fury@shield.gov` | `ADMIN` | Global | `Password123!` |
| **Captain Marvel** | `captain.marvel@shield.gov` | `MANAGER` | India | `Password123!` |
| **Captain America** | `captain.america@shield.gov` | `MANAGER` | America | `Password123!` |
| **Thanos** | `thanos@shield.gov` | `MEMBER` | India | `Password123!` |
| **Thor** | `thor@shield.gov` | `MEMBER` | India | `Password123!` |
| **Travis** | `travis@shield.gov` | `MEMBER` | America | `Password123!` |

---

## 📡 API Reference Collection

### 1. Authentication
- `POST /auth/register` - Create a new user.
- `POST /auth/login` - Authenticate credentials and write secure HttpOnly cookie.
- `POST /auth/logout` - Clear the HttpOnly session cookie.
- `GET /auth/me` - Retrieve the active user's decoded profile context.

### 2. Restaurants
- `GET /restaurants` - Fetch restaurants list (automatically filtered by tenancy country parameters).
- `GET /restaurants/:id` - Fetch restaurant details (returns 403 if tenancy check fails).
- `GET /restaurants/:id/menu` - Fetch menu items for a restaurant.

### 3. Orders
- `POST /orders` - Create a new order (body includes: `{ restaurantId, paymentMethod, items: [{ menuItemId, quantity }] }`). Checks that the restaurant belongs to the user's country.
- `POST /orders/:id/checkout` - Mark order as paid/checked out (RESTRICTED: Admin/Manager only).
- `POST /orders/:id/cancel` - Cancel order (RESTRICTED: Admin/Manager only).
- `PATCH /orders/:id/payment-method` - Change payment options (RESTRICTED: Admin only).
- `GET /orders` - Fetch orders (tenancy-isolated list).
- `GET /orders/:id` - Fetch single order details (tenancy-isolated).

## 📡 API Reference & Postman Collection

We have provided a ready-to-import Postman Collection in the root of the workspace directory:
📄 **[SHIELD_Bites.postman_collection.json](file:///c:/Users/MY/Desktop/slooze-project/SHIELD_Bites.postman_collection.json)**

### How to use:
1. Open **Postman**.
2. Click **Import** in the top navigation panel, and select `SHIELD_Bites.postman_collection.json` from your local workspace folder.
3. Test requests inside folders:
   - Trigger **Login** (e.g. Nick Fury or Thanos) under the `Auth` folder to obtain the secure HttpOnly cookie.
   - Test global restaurant lists, create new orders, or perform cancel checks.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- A running PostgreSQL instance

---

### Step 1: Backend Setup (NestJS)

1. Navigate to the backend directory:
   ```bash
   cd backend/slooze
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Create a `.env` file in `backend/slooze/`:
    ```env
    # Supports both Prisma Postgres cloud URLs (used in this project) or standard PostgreSQL strings:
    DATABASE_URL="postgres://<api_key>:<password>@db.prisma.io:5432/postgres?sslmode=require"
    
    # Alternative local PostgreSQL format:
    # DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<dbname>?schema=public"
    
    JWT_SECRET="super-secret-key-change-me"
    PORT=3000
    ```

4. Push the Prisma database schema (recreates Postgres tables, updates enum constraints, and generates the client):
   ```bash
   npx prisma db push --force-reset
   ```

5. Seed the default database data (creates the 6 users, 4 restaurants, and menu items):
   ```bash
   npx prisma db seed
   ```

6. Start the development server:
   ```bash
   npm run start:dev
   ```
   The backend will boot on `http://localhost:3000`.

---

### Step 2: Frontend Setup (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd ../../frontend/slooze
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The Next.js application will launch on port `3001` (configured in `package.json` to prevent port conflicts with NestJS).

---

### Step 3: Run & Verify
- Open your browser to `http://localhost:3001`.
- Click on **Captain Marvel** or **Captain America** card to auto-fill credentials and click **Log In**.
- Inspect browser cookies and check the `HttpOnly` flag on `access_token`.
- Test cart assemblies and verify that checkout is greyed out for Members (e.g. Thanos) but fully active for Managers (e.g. Captain Marvel) and Admins.
