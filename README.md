#  Finance Data Processing and Access Control Backend

## 🚀 Live API

Base URL: https://finance-backend-yirw.onrender.com

A scalable and production-grade backend system designed for managing financial transactions with **secure authentication**, **Role-Based & Permission-Based Access Control**, and **high-performance data processing**.

 This project demonstrates strong fundamentals in:

- 🧠 System Design & Architecture  
- 🔐 Identity & Access Management  
- ⚡ Performance Optimization  
- 📊 Data Aggregation & Analytics  
- 🛡️ Secure API Development  

> This backend is designed not just to fulfill requirements, but to reflect real-world backend engineering practices with scalability, security, and maintainability in mind.

## 🏗️ System Design & Architecture

### 🔄 High-Level Request Flow

Client → Routes → Middleware → Controllers → Models → Database → Response

---

### 🧠 Architectural Pattern

This backend follows a **Layered Modular Architecture (MVC-inspired)**:

- **Routes Layer** → Defines API endpoints and request entry points  
- **Middleware Layer** → Handles authentication, authorization, and validation  
- **Controller Layer** → Contains core business logic  
- **Model Layer** → Defines schema and interacts with the database  
- **Utility Layer** → Shared helpers (JWT, error handling, async wrapper)  

> This separation ensures **scalability, maintainability, and clean separation of concerns**.

---

### 🔐 Authentication Flow (JWT-Based)

1. User logs in and receives a JWT token  
2. Token is stored in **HTTP-only cookies**  
3. Every request passes through `authenticate` middleware  
4. Token is verified and user is attached to `req.user`  

> Ensures **secure, stateless, and scalable authentication**.

---

### 👥 Authorization Flow (RBAC + PBAC)

1. After authentication, request passes to `authorize()` middleware  
2. User role is mapped to a set of permissions  
3. Middleware checks if required permission exists  
4. Access is granted or denied accordingly  

Example:
```js
authorize('create:record')
```

## 🛡️ Identity Governance & Access Control

### 🔐 Identity Bootstrapping

To prevent unauthorized creation of privileged accounts, the system implements an automated **Identity Bootstrapping mechanism**.

- On the first server startup, a **Master Admin** is automatically created  
- Admin credentials are securely sourced from **environment variables**  
- Ensures no manual or unauthorized admin creation  

> Provides **controlled system initialization** and secure ownership establishment.

---

### 👥 Role-Based Access Control (RBAC)

The system defines three core roles:

- **Viewer** → Restricted to personal data (Self-Service Access)  
- **Analyst** → Global read-only access for auditing and insights  
- **Admin** → Full lifecycle control (Create, Update, Delete, User Management)  

> Role behavior is strictly enforced at the backend level.

---

### 🔑 Permission-Based Access Control (PBAC)

Instead of simple role checks, the system uses **fine-grained permissions**:

- `create:record`  
- `read:record`  
- `update:record`  
- `delete:record`  
- `view:dashboard`  
- `manage:users`  

These permissions are mapped to roles and enforced using middleware:

```js

authorize('create:record')
```
> Enables scalable and flexible access control for future role expansion.

### 🔒 Security Architecture
- JWT-based authentication system
- Tokens stored in HTTP-only, secure cookies
- Password hashing using bcrypt
- Protection against:
     - Cross-Site Scripting (XSS)
     - Session Hijacking

> Designed using a defense-in-depth security strategy.

### 🧠 Access Control Flow
1. User sends request
2. authenticate middleware verifies JWT
3. User is attached to req.user
4. authorize() middleware checks permissions
5. Access granted or rejected
   
> This Identity Governance model ensures secure, scalable, and maintainable access control, aligned with real-world backend system design principles.

## 🚀 Core Features

### 🔐 Authentication & Security
- JWT-based authentication system  
- Secure session handling via **HTTP-only cookies**  
- Password hashing using bcrypt  
- Protection against **XSS & session hijacking**  

---

### 👥 Identity & User Management
- User registration, login, and logout  
- Role assignment (**Admin / Analyst / Viewer**)  
- Account status management (Active / Inactive)  
- Soft delete mechanism for audit safety  

---

### 🛡️ Role-Based Access Control (RBAC + PBAC)
- Middleware-driven access control  
- Fine-grained permission system:
  - `create:record`
  - `read:record`
  - `update:record`
  - `delete:record`
  - `manage:users`  
- Strict backend enforcement of permissions  

---

### 💰 Transaction Management
- Create, update, delete financial records  
- Admin can assign transactions to other users  
- Role-based data visibility  
- Clean and structured financial data handling  

---

### 🔍 Advanced Filtering & Search
- Filter transactions by:
  - Type (income / expense)  
  - Category  
  - Date range  
- Dynamic query building for flexible filtering  

---

### 📊 Dashboard & Analytics
- Total income & total expense  
- Net balance calculation  
- Category-wise spending breakdown  
- Average transaction insights  

> Powered by **MongoDB Aggregation Pipelines**

---

### 📤 Data Export
- Export transactions into CSV format  
- Useful for reporting and external analysis  

---

### ⚡ Performance Optimization
- Compound indexing for faster queries  
- Server-side pagination for scalability  
- Optimized query execution  

---

### 🧾 Validation & Data Integrity
- Joi-based request validation  
- Mongoose schema validation  
- Prevention of invalid or inconsistent data  

---

### 🧠 Clean Architecture
- Modular folder structure  
- Reusable middleware & utilities  
- Centralized error handling  
- Async wrapper to eliminate boilerplate  

> Designed with **real-world backend engineering practices** in mind.

## ✅ Assignment Requirements Mapping

This project is designed to fully satisfy the given backend assignment requirements while going beyond them with additional engineering improvements.

---

### 👥 1. User & Role Management

✔ Implemented user registration, login, and logout  
✔ Role-based system: **Admin, Analyst, Viewer**  
✔ User status control (Active / Inactive)  
✔ Admin-level user management (update roles, deactivate users)  

> Access is strictly enforced via middleware-based RBAC + PBAC system.

---

### 💰 2. Financial Records Management

✔ Full CRUD operations for transactions  
✔ Fields include:
- Amount  
- Type (income / expense)  
- Category  
- Date  
- Notes  

✔ Admin can assign transactions to other users  
✔ Data validation enforced at multiple layers  

---

### 🔍 3. Filtering & Querying

✔ Advanced filtering by:
- Type  
- Category  
- Date range  

✔ Efficient querying using **MongoDB indexing**  
✔ Clean and dynamic query construction  

---

### 📊 4. Dashboard Summary APIs

✔ Aggregated financial insights including:
- Total income  
- Total expenses  
- Net balance  
- Category-wise breakdown  
- Average transaction values  

> Implemented using **MongoDB Aggregation Pipeline** for performance.

---

### 🛡️ 5. Access Control Logic

✔ Backend-level access enforcement using middleware  
✔ Permission-based system (`create:record`, `read:record`, etc.)  
✔ Role-specific behavior:
- Viewer → personal data only  
- Analyst → global read access  
- Admin → full control  

---

### 🧾 6. Validation & Error Handling

✔ Request validation using Joi  
✔ Schema validation using Mongoose  
✔ Centralized error handling middleware  
✔ Custom error utility for consistent responses  

> Ensures robustness and reliability under real-world usage.

---

### 💾 7. Data Persistence

✔ MongoDB used as primary database  
✔ Mongoose ODM for schema modeling  
✔ Efficient data relationships via ObjectId references  

---

## 🚀 Beyond Assignment (Extra Enhancements)

This project goes beyond basic requirements with additional features:

- 🔐 JWT-based authentication with secure cookies  
- ⚡ Compound indexing for performance optimization  
- 📄 Server-side pagination  
- 📤 CSV export functionality  
- 🧠 Multi-layer validation (Joi + Mongoose)  
- 🛡️ Admin auto-seeding (Identity Bootstrapping)  
- 🏗️ Clean modular architecture  

> These enhancements reflect real-world backend engineering practices beyond the scope of the assignment.

## ⚡ Performance & Scalability

### 📌 Indexing Strategy

To optimize query performance, the system uses **compound indexing**:

```js
{ userId: 1, date: -1 }
```
- Speeds up user-specific transaction queries
- Optimizes sorting for recent transactions
- Reduces database scan overhead

> Enables efficient handling of large-scale financial datasets.

### ⏱️ Time Complexity Optimization
- Read Operations:
  Improved from O(N) → O(log N) using indexing
-Write Operations:
  O(1) (direct document access in MongoDB)

> Ensures fast and predictable performance even with growing data size.

### 📄 Server-Side Pagination
- Implemented across all major listing APIs
- Supports page and limit parameters
Prevents:
- Large payload transfers
- Memory overflow issues

> Ensures smooth performance under heavy data loads.

### 🚀 Scalability Design

This backend is designed to handle:

- 100,000+ concurrent users
- Millions of transaction records

Powered by:

- Stateless JWT-based authentication
- Optimized database queries
- Modular architecture design

> Built with scalability in mind for real-world production scenarios.

### 🧹 Data Validation & Sanitization
- Request validation using Joi
- Schema validation using Mongoose
- Input sanitization before database operations

> Prevents invalid data, enhances security, and ensures data consistency.

### ⚙️ Query Optimization
- Role-based query filtering (user-specific vs global data)
- Efficient aggregation pipelines for analytics
- Selective field population to reduce payload size

> Minimizes unnecessary data processing and improves response time.

> Overall, the system is engineered for high performance, scalability, and efficient resource utilization, making it suitable for large-scale backend applications.

## ⚙️ Setup & Installation

### 📦 Prerequisites

Make sure you have installed:

- Node.js (v16 or higher)
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

---

### 🚀 Installation Steps

1. Clone the repository

```bash
git clone https://github.com/Sagarkumar6204/Finance-Backend.git
cd Finance-Backend
```
2.Install dependencies

```bash
npm install
```
3.Create a .env file in the root directory and add:
```bash
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=Admin@123
```
```bash
npm run dev
```
### 🌐 Server Runs On
```bash
http://localhost:3000
```
### 🧪 API Base URL
```bash
http://localhost:3000/api
```
> On first server start, the system will automatically create a Master Admin account using the provided environment variables (Identity Bootstrapping).

## 🧪 Testing API with Postman (Local Setup)

### 📍 Step 1: Start the Backend Server

Make sure your server is running:

```bash
npm run dev
```
Server will start on:
```bash
http://localhost:3000
```
#### 📂 Step 2: Import Postman Collection
1. Open Postman
2. Click on Import
3. Select the file from the root directory:
```bash
Backend\postmanAPI\finance-backend-api-postman_collection.json
```
### ⚙️ Step 3: Set Base URL

In Postman, set the base_url variable:
```bash
http://localhost:3000/api
```

### 🔐 Step 4: Login to Get Token

Use the login API:
```bash
POST /api/auth/login

{
  "email": "admin@gmail.com",
  "password": "Admin@123"
}
```
After successful login:

- JWT token will be generated
- Cookie will be automatically stored

### ⚙️ Step 5: Configure Postman Settings
- Enable Send Cookies Automatically
- Enable Follow Redirects

Or manually add header:
```bash
Authorization: Bearer <your_token>
```
### 🧪 Step 6: Test APIs

Now you can test all endpoints:

- /api/transactions/all
- /api/transactions/add
- /api/transactions/stats
- /api/admin/all-users

> This setup ensures complete local testing of authentication, RBAC, and transaction APIs before deploying the backend.

## 🌐 Testing API with Postman (Deployed Backend)

### 🚀 Step 1: Use Deployed API Base URL

After deployment, update the `base_url` variable in Postman:

```bash
https://finance-backend-yirw.onrender.com
```

#### 📂 Step 2: Import Postman Collection
1. Open Postman
2. Click on Import
3. Select the file from the root directory:
```bash
Backend\postmanAPI\finance-backend-api-postman_collection.json
```

### ⚙️ Step 3: Login to Get Token

Use the login endpoint:
```bash
POST /api/auth/login

{
  "email": "admin@gmail.com",
  "password": "Admin@123"
}
```
After successful login:

- JWT token will be generated
- Cookie will be stored automatically (if enabled)

### 🔐 Step 4: Configure Authorization
If cookies are not working (common in deployed APIs):

Add Authorization header manually:
```bash
Authorization: Bearer <your_token>
```

### ⚙️ Step 5: Important Postman Settings
- Enable Send Cookies Automatically
- Enable Follow Redirects
- Ensure correct base_url is set


### 🧪 Step 6: Test APIs

Now you can test all endpoints:

- /api/transactions/all
- /api/transactions/add
- /api/transactions/stats
- /api/admin/all-users

## 📬 API Endpoints

### 🔐 Authentication Routes

| Method | Endpoint              | Description              | Access |
|--------|----------------------|--------------------------|--------|
| POST   | `/api/auth/register` | Register new user        | Public |
| POST   | `/api/auth/login`    | Login user & get token   | Public |
| POST   | `/api/auth/logout`   | Logout user              | Private |

---

### 💰 Transaction Routes

| Method | Endpoint                          | Description                          | Access |
|--------|----------------------------------|--------------------------------------|--------|
| GET    | `/api/transactions/all`           | Get transactions (paginated)         | Private |
| GET    | `/api/transactions/filter`        | Filter transactions                  | Private |
| GET    | `/api/transactions/stats`         | Get financial analytics              | Private |
| GET    | `/api/transactions/export`        | Export transactions (CSV)            | Private |
| POST   | `/api/transactions/add`           | Create transaction                   | Private |
| PUT    | `/api/transactions/update/:id`    | Update transaction                   | Private |
| DELETE | `/api/transactions/delete/:id`    | Delete transaction                   | Private |

---

### 👥 Admin Routes

| Method | Endpoint                      | Description                  | Access |
|--------|------------------------------|------------------------------|--------|
| GET    | `/api/admin/all-users`       | Get all users (paginated)    | Admin |
| PUT    | `/api/admin/user/:id`        | Update user role/status      | Admin |
| DELETE | `/api/admin/user/:id`        | Soft delete user             | Admin |

---

> All protected routes require a valid JWT token (via cookies or Authorization header).

## 📌 Assumptions

- Each user is assigned a single role (Admin / Analyst / Viewer)  
- Transactions are linked to a specific user  
- Admin has authority to manage users and assign transactions  
- Soft delete is used instead of permanent deletion  
- Categories are predefined for consistency  
- Authentication is stateless using JWT  

> These assumptions ensure clarity and consistent system behavior.

---

## 🏗️ Design Decisions

- **MongoDB** chosen for flexible schema and aggregation capabilities  
- **PBAC over simple RBAC** for scalable permission handling  
- **Middleware-based architecture** for separation of concerns  
- **Compound indexing** for optimized read performance  
- **Soft delete strategy** for audit and data retention  
- **Joi + Mongoose validation** for multi-layer data integrity  

> These decisions reflect real-world backend engineering practices.

---

## 🚀 Future Improvements

- Redis caching for faster responses  
- Rate limiting for API protection  
- Swagger/OpenAPI documentation  
- Docker containerization  
- Unit & integration testing  
- CI/CD pipeline  

> These enhancements can further improve scalability and maintainability.

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
