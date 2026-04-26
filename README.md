# LinkCart — Single Product Sharing Platform

A full-stack web application to build, manage, and share your digital presence through customizable profiles, links, and scalable backend architecture.

---

## 🌐 Overview

LinkCart enables users to create a centralized digital identity — similar to a "link-in-bio" platform — with a focus on performance, clean UI, and secure architecture.

---

## ✨ Features

* Authentication system with JWT
* Secure password hashing using bcrypt
* User profile management
* Profile completion tracking
* Scalable structure for digital presence (links/products)
* Responsive UI with Tailwind CSS
* RESTful API architecture
* Input validation and security handling

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* PostgreSQL (Neon)
* JWT Authentication
* bcrypt

### Frontend

* React.js
* React Router
* Tailwind CSS
* Vite

---

## 📁 Project Structure (Overview)

```
LinkCart/
│
├── Backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── routes/
│   │   └── App.jsx
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

* Node.js (v14 or higher)
* npm or yarn
* Neon PostgreSQL account

---

## 🔙 Backend Setup

**1. Navigate to backend**

```bash
cd LinkCart/Backend
```

**2. Install dependencies**

```bash
npm install
```

**3. Create ************`.env`************ file**

```
PORT=5000
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_secret_key
```

**4. Start server**

```bash
npm start
```

---

## 🔜 Frontend Setup

**1. Navigate to frontend**

```bash
cd LinkCart/Frontend
```

**2. Install dependencies**

```bash
npm install
```

**3. Run app**

```bash
npm run dev
```

---

## 🔌 API Endpoints

### Authentication

* POST `/api/auth/signup`
* POST `/api/auth/login`

### Profile

* GET `/api/profile` *(Protected)*
* POST `/api/profile` *(Protected)*

---

## 🔐 Security

* Password hashing (bcrypt)
* JWT-based authentication
* Protected routes
* Input validation
* SQL injection prevention

---

## 🧭 Roadmap

* Analytics dashboard
* Custom link management
* Public profile pages
* Product listing system
* Admin dashboard

---

## 🤝 Contributing

Contributions and suggestions are welcome.

```bash
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
```

---

## 📄 License

MIT License

---
