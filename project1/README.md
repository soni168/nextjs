# 🔐 AuthForge – Full Stack Authentication System

A secure full-stack authentication system built with Next.js App Router, MongoDB, and JWT.
Includes user registration, login, email verification, and password reset via secure tokens.

---

## 🚀 Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **MongoDB** + Mongoose
- **JWT** (JSON Web Tokens)
- **Nodemailer** + Mailtrap
- **Axios**
- **Tailwind CSS**

---

## ✨ Features

- ✅ User Registration with Email Verification
- ✅ Secure Login with JWT (HTTP-only cookies)
- ✅ Forgot Password via Email Token
- ✅ Password Reset with Secure Token (hashed in DB)
- ✅ Protected Routes via Middleware
- ✅ Secure API Routes
- ✅ MongoDB Integration
- ✅ Production Deployment on Vercel

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/users/
│   │   ├── signup/
│   │   ├── login/
│   │   ├── logout/
│   │   ├── me/
│   │   ├── forgotpassword/
│   │   ├── resetpassword/
│   │   └── verifyEmail/
│   ├── signup/
│   ├── login/
│   ├── forgotpassword/
│   ├── resetpassword/
│   ├── verifyEmail/
│   └── profile/
├── helpers/
│   ├── mailer.ts
│   └── getDataFromToken.ts
├── models/
│   └── userModel.ts
└── dbconfig/
    └── dbconfig.ts
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/soni168/nextjs.git
cd nextjs
```

Install dependencies:

```bash
npm install
```

Set up environment variables — create a `.env.local` file:

```env
MONGO_URI=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret
DOMAIN=http://localhost:3000
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
FROM_EMAIL=no-reply@authforge.dev
```

---

## 🧪 Run Locally

```bash
npm run dev
```

Open in browser: [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Build for Production

```bash
npm run build
```

---

## 🚀 Deployment

Deployed on **Vercel**. Push to `main` branch triggers automatic deployment.

---

## 🔒 Security Highlights

- Passwords hashed with **bcrypt**
- Reset/verify tokens hashed with **SHA-256** before storing in DB
- Raw token sent in email, hashed token stored — prevents DB breach attacks
- HTTP-only cookies for JWT storage
- Email enumeration protection on forgot password endpoint

---

## 📌 Future Improvements

- OAuth (Google / GitHub login)
- Role-based access control
- Refresh token rotation
- Password strength meter
- Rate limiting on auth endpoints

---

Made by **Soni Chaudhary**