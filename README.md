# Nexura

A modular authentication and email service built with **NestJS**, supporting:

- JWT Authentication
- Google OAuth Integration
- OTP-based Login
- Email Verification
- Password Reset Workflow

Powered by **Passport.js**, **TypeORM**, and **PostgreSQL**.

---

## Features

- ✅ **User Registration & Login**
- ✅ **JWT Authentication**
- ✅ **Google OAuth2 Authentication**
- ✅ **OTP Verification (Login & Password Reset)**
- ✅ **Email Verification & Token System**
- ✅ **Password Reset & Email-based Token Recovery**
- ✅ **Email Sending via Nodemailer**

---

## Tech Stack

- [NestJS](https://nestjs.com/)
- [Passport.js](http://www.passportjs.org/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Nodemailer](https://nodemailer.com/)

---

## API Endpoints

### 📖 Auth

- **Get Environment Variables**  
  `GET /auth/env`

- **Register**  
  `POST /auth/register`

- **Login**  
  `POST /auth/login`

- **Verify Email Token**  
  `POST /auth/verify-email`

- **Request Password Reset**  
  `POST /auth/reset-password`

- **Verify Login OTP**  
  `POST /auth/verify-login-otp`

- **Verify Password Reset OTP**  
  `POST /auth/verify-reset-password-otp`

- **Set New Password**  
  `POST /auth/set-new-password` (JWT token required)

### 📧 Email

- **Send Email**  
  `POST /email/send-email`

---

## Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/CodeEnthusiast09/nexura.git
cd nexura
npm install
```

2. **Create a .env file in the root folder with the following variables:

```.env
# Application
PORT=
SECRET=

# Database (PostgreSQL)
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USENAME=
DATABASE_PWD=
DATABASE_NAME=

# Email Service
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=

# Frontend URL (For email links)
FRONT_END_URL=

# Google OAuth2
GOOGLE_CLIENT_ID= 
GOOGLE_CLIENT_SECRET= 
GOOGLE_CALLBACK_URL= 
```

3. **Run Database Migrations and Start the Project

```bash
npm run migration:run
npm run start:dev
```
