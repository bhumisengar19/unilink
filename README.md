# 🚀 UniLink — Real-Time University Networking Platform

UniLink is a full-stack MERN application built to connect university students through collaboration, communication, and opportunities. It integrates real-time features, cloud storage, and a modern animated UI to deliver a seamless campus networking experience.

---

# 🌟 Core Features

## 🔐 Authentication & Security

* JWT-based authentication system
* Secure password hashing (bcrypt)
* Protected routes with middleware
* Refresh token support for session management

---

## 👤 User Profiles

* Create and manage user profiles
* Upload profile images using Cloudinary
* Store and retrieve user data from MongoDB Atlas

---

## 📝 Posts & Feed System

* Create, view, and manage posts
* Structured backend using MVC architecture
* Scalable design for future enhancements (likes, comments, etc.)

---

## 💬 Real-Time Communication

* Socket.io integration for real-time features
* Foundation for chat system and live notifications
* Scalable WebSocket architecture

---

## 📅 Opportunities & Collaboration

* Dedicated Opportunities section
* Post and explore internships, events, and collaborations
* Backend APIs for opportunity management

---

## 🚨 SOS Emergency Feature (Unique 🔥)

* Built-in SOS system for emergency situations
* Allows users to trigger alerts
* Designed for future integration with:

  * Location tracking
  * Nearby user notifications
  * Admin alerts

---

## ☁️ Cloud Integration

* Cloudinary for image uploads and storage
* MongoDB Atlas for scalable database
* Environment-based secure configuration

---

## 🎨 UI/UX (Advanced Design System)

* Dark-themed modern interface
* Neumorphic / 3D-inspired UI components
* Smooth animations and transitions
* Responsive design across screens
* Reusable component architecture

---

# 📂 Project Structure

```id="c6q4jw"
unilink/
│
├── client/              # React frontend (Vite + Tailwind)
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── config files
│
├── server/              # Node.js backend (Express)
│   ├── config/          # DB & Cloudinary configs
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & upload middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── sockets/         # WebSocket logic
│   └── utils/           # Helper functions
│
└── README.md
```

---

# 🛠 Tech Stack

### Frontend:

* React.js (Vite)
* Tailwind CSS
* Axios

### Backend:

* Node.js
* Express.js

### Database:

* MongoDB Atlas

### Real-Time:

* Socket.io

### Cloud:

* Cloudinary

---

# ⚙️ Environment Variables

Create a `.env` file inside the server folder:

```id="k8v8l7"
PORT=5000
MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# 🚀 Getting Started

## 1. Clone the repository

```id="w9m9lq"
git clone https://github.com/bhumisengar19/unilink.git
cd unilink
```

---

## 2. Install dependencies

### Backend:

```id="7aq9u6"
cd server
npm install
```

### Frontend:

```id="k0l1qs"
cd ../client
npm install
```

---

## 3. Run the application

### Start Backend:

```id="9p9n2r"
npm run dev
```

### Start Frontend:

```id="2o6b7d"
npm run dev
```

---

# 🧪 API Testing (Postman)

* POST `/api/auth/register`
* POST `/api/auth/login`
* POST `/api/upload` → form-data (image)
* POST `/api/opportunities`
* GET `/api/posts`

---

# 📸 Screenshots

* Modern login UI with 3D design
* Dark theme interface
* Animated components
* Opportunity dashboard


<img width="200" height="300" alt="Screenshot 2026-03-29 015147" src="https://github.com/user-attachments/assets/7add02d9-b9db-43f4-8d08-f9eaed996fa3" />
<img width="300" height="200" alt="Screenshot 2026-03-29 023750" src="https://github.com/user-attachments/assets/f6e5f283-cfcc-4f91-9209-73ea22443b0b" />
<img width="300" height="200" alt="Screenshot 2026-03-29 023607" src="https://github.com/user-attachments/assets/6a024a2d-7163-4a64-8087-72cf7f184674" />

---

# 💡 Future Enhancements

* AI Assistant integration
* Skill-based matchmaking
* Study rooms (real-time collaboration)
* Event management system
* Marketplace system
* Advanced SOS with GPS tracking

---

# 🧠 Learning Outcomes

* Full-stack MERN development
* JWT authentication & security practices
* Cloud integration (Cloudinary + MongoDB Atlas)
* Real-time systems using Socket.io
* Designing modern animated UI systems
* Building scalable backend architecture

---

# 👩‍💻 Author

**Bhumi Sengar**

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub!
