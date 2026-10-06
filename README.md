# ShopEase — Secure E-Commerce Web Application

ShopEase is a full-stack e-commerce web application built with React, Node.js, Express, and MongoDB. The application provides product management, authentication, role-based access control, secure login, OAuth authentication, refresh-token rotation, rate limiting, account lockout protection, and administrative dashboards.

## 🚀 Live Application

**Frontend:**
`PASTE_VERCEL_URL_HERE`

**Backend API:**
`PASTE_RENDER_URL_HERE`

**GitHub Repository:**
`https://github.com/MunazaMunir-dev/shopease`

> The application is deployed over HTTPS.

---

## 🛠️ Technology Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Google OAuth
* REST APIs

### Security

* Password hashing
* JWT access tokens
* Refresh token rotation
* Role-Based Access Control (RBAC)
* Rate limiting
* Account lockout
* Secure HTTP authentication
* Environment variables for secrets

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas
* Source Control: GitHub

---

# 📋 Main Features

## 1. User Authentication

ShopEase provides secure authentication functionality including:

* User registration
* Email/password login
* Password hashing
* JWT-based authentication
* Access token validation
* Refresh token handling
* Logout
* Protected routes

Passwords are **never stored in plain text**. Passwords are securely hashed before being stored in MongoDB.

---

## 2. Google OAuth Login

Users can authenticate using Google OAuth.

### OAuth Flow

1. User selects **Login with Google**.
2. Application redirects the user to Google.
3. Google authenticates the user.
4. Google redirects the user back to the backend callback URL.
5. Backend verifies the authentication response.
6. User session/tokens are created.
7. User is redirected to the application.

### Production OAuth Callback

The Google OAuth callback URL must be configured for the deployed backend.

Example:

```text
https://YOUR-BACKEND-DOMAIN/api/auth/google/callback
```

---

# 🔐 Authentication Security

## Access Token

After successful authentication, the server issues an access token used for authenticated API requests.

Protected requests require a valid authentication token.

Example:

```http
Authorization: Bearer ACCESS_TOKEN
```

---

## Refresh Token Rotation

ShopEase uses refresh-token rotation to improve session security.

When a refresh token is used:

1. The server validates the existing refresh token.
2. The existing refresh token is invalidated/rotated.
3. A new access token is generated.
4. A new refresh token is generated.
5. The client continues with the new token pair.

This reduces the risk of long-lived refresh-token reuse.

---

# 🛡️ Rate Limiting & Account Lockout

Authentication endpoints are protected against repeated login attempts.

The system provides:

* Request rate limiting
* Failed-login tracking
* Account lockout after repeated failed attempts
* Protection against brute-force login attempts

A user who exceeds the allowed failed-login threshold is temporarily prevented from continuing authentication attempts.

---

# 👥 Role-Based Access Control (RBAC)

ShopEase supports different user roles.

## SuperAdmin

SuperAdmin has the highest level of access.

Typical permissions include:

* Manage users
* Manage products
* Access administrative dashboard
* Manage system-level resources
* Perform administrative operations

## Manager

Manager has management-level permissions.

Typical permissions include:

* Manage products
* View relevant management data
* Access manager dashboard
* Perform permitted management operations

## Employee

Employee has restricted permissions.

Typical permissions include:

* Access employee dashboard
* Perform assigned operations
* View permitted resources

Employees cannot access SuperAdmin-only operations.

---

# 🚫 RBAC Access Rejection

Protected API routes verify the user's role before allowing access.

For example:

```text
Employee → SuperAdmin API
       ↓
   Access Denied
       ↓
HTTP 403 Forbidden
```

This can be demonstrated during the live viva using Postman.

---

# 🧪 Viva Demonstration / Testing

The following security features can be demonstrated during the viva.

## 1. OAuth Login

**Steps:**

1. Open the login page.
2. Click **Continue with Google**.
3. Authenticate using a Google account.
4. Complete the OAuth flow.
5. Verify that the user is successfully logged in.

---

## 2. Refresh Token Rotation

**Steps:**

1. Login successfully.
2. Obtain the access/refresh token pair.
3. Send a refresh-token request.
4. Verify that a new token pair is generated.
5. Attempt to reuse the previous refresh token.
6. Verify that the old token is rejected according to the application's rotation policy.

---

## 3. Rate Limiting / Account Lockout

**Steps:**

1. Open the login API in Postman.
2. Enter an incorrect password.
3. Repeat the failed login attempts according to the configured threshold.
4. Verify that the system applies the rate limit/account-lockout mechanism.
5. Verify that further attempts are rejected while the protection is active.

---

## 4. RBAC Rejection in Postman

**Steps:**

1. Login using an Employee account.
2. Obtain the employee authentication token.
3. Send a request to a SuperAdmin-only API endpoint.
4. Add the token to the Authorization header.

Example:

```http
Authorization: Bearer EMPLOYEE_ACCESS_TOKEN
```

5. Send the request.

Expected result:

```text
HTTP 403 Forbidden
```

This demonstrates that unauthorized roles cannot access restricted resources.

---

# 👤 Test Credentials

The following accounts are provided for demonstration and viva testing.

> **Important:** Replace the placeholders below with the actual seeded test-account credentials before submission. Do not publish any personal account passwords.

| Role       | Email                   | Password                   |
| ---------- | ----------------------- | -------------------------- |
| SuperAdmin | `SUPERADMIN_TEST_EMAIL` | `SUPERADMIN_TEST_PASSWORD` |
| Manager    | `MANAGER_TEST_EMAIL`    | `MANAGER_TEST_PASSWORD`    |
| Employee   | `EMPLOYEE_TEST_EMAIL`   | `EMPLOYEE_TEST_PASSWORD`   |

These accounts should be used only for demonstration/testing.

---

# 🔑 Environment Variables

Create a `.env` file for local development.

Example:

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_ATLAS_URI

JWT_SECRET=YOUR_JWT_SECRET
REFRESH_TOKEN_SECRET=YOUR_REFRESH_TOKEN_SECRET

FRONTEND_URL=http://localhost:5173

NODE_ENV=development

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### Security Notice

Never commit `.env` to GitHub.

The `.gitignore` file should contain:

```gitignore
.env
node_modules/
```

Production environment variables must be configured through the deployment platform.

---

# 💻 Local Installation

## 1. Clone the Repository

```bash
git clone https://github.com/MunazaMunir-dev/shopease.git
```

## 2. Enter the Project

```bash
cd shopease
```

## 3. Install Backend Dependencies

```bash
cd server
npm install
```

## 4. Configure Environment Variables

Create:

```text
server/.env
```

and add the required environment variables.

## 5. Start Backend

```bash
npm start
```

or, if nodemon is configured:

```bash
nodemon server.js
```

The backend runs locally on:

```text
http://localhost:5000
```

---

# 🌐 Frontend Setup

Open a new terminal.

Navigate to the frontend directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

---

# 🗄️ Database

ShopEase uses MongoDB Atlas as its cloud database.

The backend connects to MongoDB through the `MONGO_URI` environment variable.

Database credentials and connection strings must not be committed to the public repository.

---

# 📦 API Overview

The backend exposes REST APIs for application functionality such as:

* Authentication
* User management
* Product management
* Role-based operations
* OAuth authentication
* Token refresh
* Logout
* Protected resources

Protected endpoints require authentication and, where applicable, an authorized role.

---

# 🔒 Security Practices

ShopEase follows these security practices:

* Passwords are hashed before database storage.
* Secrets are stored in environment variables.
* `.env` is excluded from Git.
* Authentication is implemented using tokens.
* Refresh tokens are rotated.
* Protected routes require authentication.
* RBAC prevents unauthorized role access.
* Authentication attempts are rate-limited.
* Account lockout protection is implemented.
* Production deployment uses HTTPS.

---

# 🚀 Deployment

## Backend

The backend is deployed using a cloud hosting provider such as Render.

Typical configuration:

```text
Root Directory: server
Build Command: npm install
Start Command: node server.js
```

Required production environment variables must be added through the hosting provider's environment-variable settings.

## Frontend

The React frontend is deployed using Vercel.

Typical configuration:

```text
Build Command: npm run build
Output Directory: dist
```

The frontend must use the deployed backend URL for production API requests.

---

# 📁 Project Structure

```text
shopease/
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

> Update the structure above if your actual project folders use different names.

---

# 🧪 Testing

Testing should cover:

* User registration
* Normal login
* Invalid login
* Google OAuth
* Token refresh
* Refresh-token rotation
* Logout
* Rate limiting
* Account lockout
* SuperAdmin authorization
* Manager authorization
* Employee authorization
* Unauthorized API access
* Product operations
* Protected routes

Postman can be used to test protected APIs and RBAC behavior.

---

# 📌 Project Requirements

This project fulfills the following deployment and security requirements:

* [x] Live HTTPS deployment
* [x] Public GitHub repository
* [x] Comprehensive README
* [x] SuperAdmin test account
* [x] Manager test account
* [x] Employee test account
* [x] OAuth Login
* [x] Refresh Token Rotation
* [x] Rate Limiting / Account Lockout
* [x] RBAC Access Rejection
* [x] Password hashing
* [x] Environment-based secret management

---

# 👩‍💻 Developer

**Munaza Munir**

BS Software Engineering
COMSATS University Islamabad

GitHub:
https://github.com/MunazaMunir-dev

---

# 📄 Academic Submission

This project is prepared for academic evaluation and live viva demonstration.

The deployment, authentication, authorization, and security mechanisms are included as part of the project requirements.
<img width="1920" height="1080" alt="Screenshot (313)" src="https://github.com/user-attachments/assets/57aeba08-5066-4bee-995b-c91384a4bb83" />
<img width="1920" height="1080" alt="Screenshot (312)" src="https://github.com/user-attachments/assets/07b65c2c-7bad-4f6c-a97c-3562fcdfce27" />
<img width="1920" height="1080" alt="Screenshot (311)" src="https://github.com/user-attachments/assets/ddc79216-3ad5-4c4b-8aa8-e34f040f3d15" />
<img width="1920" height="1080" alt="Screenshot (309)" src="https://github.com/user-attachments/assets/8b54a6a9-f642-4326-8bfb-559c30312725" />
