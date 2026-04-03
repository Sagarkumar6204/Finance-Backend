# 📊 Finance Data Processing & Access Control Backend

A production-ready **Financial Governance API** built with the MERN stack. This system handles high-stakes financial data using a **Zero-Trust RBAC (Role-Based Access Control)** architecture, ensuring data integrity through advanced MongoDB aggregation and indexing.

---

## 🏗️ System Architecture & Design
This project follows the **Controller-Service-Model** pattern, ensuring a clean **Separation of Concerns (SoC)**.

### **1. Identity Governance (Access Control)**
* **Identity Bootstrapping:** To prevent unauthorized Admin creation, the system uses an automated **Data Seeding** script. On the first server heartbeat, a **Master Admin** is initialized via Environment Variables if no admin exists.
* **Role-Based Access Control (RBAC):** Implemented via custom Middlewares.
    * **Viewer:** Locked to personal data (Self-Service).
    * **Analyst:** Global read-access for auditing.
    * **Admin:** Full Lifecycle Management (Promotion/Deactivation).
* **Security:** Authentication is handled via **JWT (JSON Web Tokens)** stored in **HTTP-Only, Secure Cookies**, effectively neutralizing XSS and Session Hijacking threats.

### **2. Finance Data Processing (The Engine)**
* **Advanced Aggregation:** Uses MongoDB **Aggregation Pipelines** (`$match`, `$group`, `$sum`) to process real-time stats (Total Income, Expenses, and Net Balance) without loading raw data into server memory.
* **Data Sanitization:** Implements strict **Input Validation** and **Output Sanitization** (Bcrypt for passwords and Mongoose `.select('-password')`) to prevent data leakage.
* **Soft-Delete Logic:** Financial records are never hard-deleted to maintain a **Regulatory Audit Trail**. We use an `isDeleted` flag for governance.

---

## ⚡ Performance & Scalability
* **Indexing Strategy:** We use **Compound Indexing** (`userId: 1, date: -1`). 
    * **Complexity:** Reduces query time from **$O(N)$** to **$O(\log N)$**.
* **Server-Side Pagination:** All global data fetches are paginated to prevent memory overflows.
* **Scalability:** This backend is designed to handle **100,000+ concurrent users** and millions of transaction rows, thanks to stateless JWT and optimized database indexing.

---

## 🛠️ Local Setup & Installation

### **Prerequisites**
* Node.js (v18+)
* MongoDB (Atlas or Local)

### **Step 1: Clone & Install**
```bash
git clone <your-repo-link>
cd Finance-Access-Control
npm install
```

### Step 2: Environment Configuration
#Create a .env file in the root directory:

```bash
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```
### Step 3: Run the App
```bash
npm start
# The system will automatically seed the Master Admin on the first run.
```

##  Testing with Postman

###  Using Localhost

1. Navigate to the `/postman` folder in the root directory  
2. Import `FinAccess-API.json` into Postman  
3. Set the `base_url` variable to `http://localhost:3000`  

---

###  Using Deployed Link

If testing the live production API:

1. Change the Postman `base_url` variable to `https://your-deployed-api.com`  
2. Test all RBAC layers (Admin / Analyst / Viewer) using the credentials provided above  
##  Test Credentials (RBAC Demo)

| Role    | Email               | Password    | Permissions                                              |
|---------|--------------------|-------------|----------------------------------------------------------|
| Admin   | admin@gmail.com    | Admin@123   | Full Governance, Role Updates & Soft-Delete              |
| Analyst | analyst@gmail.com  | Analyst@123 | Global Transaction View & Platform Analytics             |
| Viewer  | user@gmail.com     | User@123    | Personal Ledger & Individual Dashboard Only              |

> **Note:** The Admin account is automatically created on the first server heartbeat via the Identity Bootstrapping script.

## 📈 Technical Specs Summary

- **Filter/Search:** Optimized using Mongoose query middleware  

- **Time Complexity:**
  - **Read:** `O(log N)` (leveraging indexing)
  - **Write/Update:** `O(1)` (direct document access)

- **Data Integrity:**  
  Multi-stage validation ensures prevention of:
  - Negative amounts  
  - Invalid categories  
