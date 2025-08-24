 # 🌱 AgriLink - MERN Stack Application

AgriLink is a modern agriculture-focused platform that connects farmers, buyers, and financial services.  
It provides features like marketplace, AI advisory, weather updates, loan management, and crop insights.

---

## 🚀 Live Demo
- **Frontend (Vercel):** [https://agri-link-rh43.vercel.app](https://agri-link-rh43.vercel.app)  
- **Backend (Render):** [https://agrilink-1-nqxd.onrender.com](https://agrilink-1-nqxd.onrender.com)  

---

## 🧱 Tech Stack

| Layer       | Technology               |
|-------------|---------------------------|
| Frontend    | React + Vite + TailwindCSS |
| Backend     | Node.js + Express.js       |
| Database    | MongoDB Atlas              |
| Auth        | JWT + Google OAuth         |
| Deployment  | Render (backend), Vercel (frontend) |

---
```
## 📂 Project Structure
/agrilink
├── /backend # Node.js + Express API
│ ├── controllers
│ ├── models
│ ├── routes
│ ├── server.js
│ └── package.json
│
├── /frontend # React + Vite + Tailwind
│ ├── src
│ ├── public
│ └── package.json
│
├── .env.example # Example environment variables
└── README.md # Project documentation

```
## ⚙️ Installation & Setup

### 1. Clone the Repository
```
git clone https://github.com/your-username/agrilink.git
cd agrilink
```
2. Setup Backend
```
cd backend
npm install
```
Create a .env file in /backend with:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
Run backend:
```
npm start
```
3. Setup Frontend
```
cd frontend
npm install
```
Create a .env file in /frontend with:
```
VITE_API_BASE_URL=http://localhost:5000/api
```
Run frontend:
```
npm run dev
```
## 🌍 Deployment
### Backend (Render)
- Go to Render

- Create a new Web Service

- Connect your repo & select /backend

- Set Build Command: npm install

- Set Start Command: node server.js

- Add environment variables from .env

### Frontend (Vercel)
- Go to Vercel

- Import the project & select /frontend

Add environment variable:

VITE_API_BASE_URL=[https://agrilink-1-nqxd.onrender.com](https://agrilink-1-nqxd.onrender.com)

## 🔒 CORS Configuration

Backend (server.js) allows:

- http://localhost:5173 (development)

- https://agri-link-rh43.vercel.app (production)

## 🛠 Features

- 🌾 Marketplace for agricultural produce

- 🤖 AI-powered crop advisory

- 🌦 Real-time weather updates

- 💰 Loan management system

- 📊 Produce pricing insights

- 🔑 JWT authentication & Google OAuth login

## 👩‍💻 Authors

Rebeccah M. – Fullstack Developer
