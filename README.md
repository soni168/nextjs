# 🔐 NextAuth System – Full Stack Authentication App

A secure full-stack authentication system built using Next.js App Router, MongoDB, and JWT.  
This project includes user registration, login, password reset via token, and protected routes.

---

## 🚀 Tech Stack

- Next.js 16 (App Router)
- React
- TypeScript
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Axios
- Tailwind CSS

---

## ✨ Features

- ✅ User Registration
- ✅ User Login
- ✅ Password Reset via Email Token
- ✅ Token Verification
- ✅ Protected Routes
- ✅ Secure API Routes
- ✅ MongoDB Database Integration
- ✅ Production Ready Deployment (Vercel)

---

## 📁 Project Structure


app/
├── api/
│ └── users/
│ ├── signup
│ ├── login
│ ├── resetpassword
│ └── verifyemail
├── login/
├── signup/
├── resetpassword/
└── profile/

lib/
└── dbConfig.ts

models/
└── userModel.ts


---

## ⚙️ Installation

Clone the repository:


git clone https://github.com/your-username/your-repo-name.git

cd your-repo-name


Install dependencies:


npm install


---

## 🔐 Environment Variables

Create a `.env` file in the root directory and add:


MONGO_URL=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret
DOMAIN=http://localhost:3000


---

## 🧪 Run Locally


npm run dev


Open in browser:


http://localhost:3000


---

## 🏗️ Build for Production


npm run build


---

## 🚀 Deployment

This project is optimized for deployment on Vercel.

---

## 📌 Future Improvements

- Email service integration (Nodemailer)
- Password strength validation
- Role-based authentication
- Refresh token system
- OAuth (Google/GitHub login)

---

## 👩‍💻 Author

Soni Chaudhary  
