# 🤝 Helping Hands — University Donation Platform

A full-stack web application that connects financially struggling university students with donors willing to support their educational needs. Built with React, Node.js, MongoDB, and deployed on Vercel.

🌐 **Live Demo:** [helping-hands-iba.vercel.app](https://helping-hands-iba.vercel.app)

---

## 📌 Features

### 🏠 Public Home Page
- Hero section with platform statistics
- Browse all approved student requests
- Search and filter by category (Tuition, Books, Medical, etc.)
- How it works section
- No login required to browse

### 🎓 Student Features
- Register with university email (`.edu.pk` only)
- Submit funding requests with:
  - Title, description, category, amount needed
  - 📄 Fee challan upload (proof of financial need)
  - 🏦 Bank account details for direct transfers
- Track received donations and funding progress
- Browse and donate to other students' requests
- View donation history

### 💛 Donor Features
- Register with any email
- Browse all approved student requests
- View fee challan as proof before donating
- Donate with optional message
- Upload payment screenshot as proof of donation
- Track complete donation history

### 🛡️ Admin Features
- Approve or reject student requests
- View fee challan image before approving
- View bank account details of students
- Manage all users
- Platform statistics dashboard

### 🔐 Security
- JWT authentication
- Role-based access control (Student / Donor / Admin)
- University email validation for students
- Protected routes
- Ownership validation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt.js |
| File Storage | Cloudinary |
| Deployment | Vercel (Frontend + Backend) |

---

## 📁 Project Structure

```
HelpingHands/
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── requestController.js
│   │   ├── donationController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── HelpRequest.js
│   │   └── Donation.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── donationRoutes.js
│   │   ├── adminRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   └── createAdmin.js
│   ├── .env.example
│   ├── vercel.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── RequestCard.jsx
    │   └── pages/
    │       ├── Home.jsx
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── StudentDashboard.jsx
    │       ├── DonorDashboard.jsx
    │       ├── AdminDashboard.jsx
    │       └── RequestDetails.jsx
    ├── vercel.json
    └── vite.config.js
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) local OR [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Git](https://git-scm.com/)
- [Cloudinary](https://cloudinary.com/) account (free)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/deepaklal009/HelpingHands.git
cd HelpingHands
```

---

### 2. Setup the Backend

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend/` folder (see `.env.example`):

```env
PORT=4500
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:

```bash
npm run dev
```

You should see:
```
Server running on port 4500
MongoDB connected
```

---

### 3. Setup the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:4500/api
```

Start the frontend:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

### 4. Create the Admin Account

Run this one-time script to create an admin:

```bash
cd Backend
node utils/createAdmin.js
```

Output:
```
✅ Admin created successfully!
Email: admin@helpinghands.com
Password: admin123
```

> Run this **once only**.

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@helpinghands.com | admin123 |
| Student | yourname@university.edu.pk | your password |
| Donor | any email | your password |

---

## 📋 How to Use

### As a Student
1. Register with your **university email** (must end in `.edu.pk`)
2. Login → Student Dashboard
3. Click **"New Request"** and fill:
   - Title, category, description, amount needed
   - Bank account details (for receiving donations)
   - Upload your **fee challan** as proof
4. Wait for admin approval
5. Track donations and funding progress
6. Browse other students' requests and donate to them

### As a Donor
1. Register with any email
2. Login → Donor Dashboard
3. Browse approved requests
4. Click a request → view fee challan as proof
5. See student's bank account for direct transfer
6. Enter amount, optional message, upload payment screenshot
7. Track donation history

### As an Admin
1. Login with admin credentials
2. Admin Dashboard → view all pending requests
3. Click **"View"** to see full request details including:
   - Student info
   - Fee challan image
   - Bank account details
4. **Approve** or **Reject** the request
5. Manage users in the Users tab

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register (students need .edu.pk email) |
| POST | `/api/auth/login` | Login, returns JWT token |

### Requests
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/requests` | All | Get all requests |
| GET | `/api/requests/approved` | Public | Get approved requests |
| GET | `/api/requests/my` | Student | Get my requests |
| GET | `/api/requests/:id` | All | Get request by ID |
| POST | `/api/requests` | Student | Create request with challan |
| PATCH | `/api/requests/:id/approve` | Admin | Approve a request |
| PATCH | `/api/requests/:id/reject` | Admin | Reject a request |
| DELETE | `/api/requests/:id` | Student | Delete own request |

### Donations
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/donations` | Auth | Donate with optional payment proof |
| GET | `/api/donations/my` | Auth | Get my donations |
| GET | `/api/donations/request/:id` | Auth | Get donations for a request |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/stats` | Admin | Platform statistics |
| GET | `/api/admin/users` | Admin | Get all users |
| DELETE | `/api/admin/users/:id` | Admin | Delete a user |

---

## 🔒 Environment Variables

### Backend `.env`
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 4500) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend `.env`
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

---

## 👥 Roles & Permissions

| Feature | Student | Donor | Admin |
|---------|---------|-------|-------|
| Browse home page | ✅ | ✅ | ✅ |
| Register / Login | ✅ | ✅ | ✅ |
| Create funding request | ✅ | ❌ | ❌ |
| Upload fee challan | ✅ | ❌ | ❌ |
| View fee challan | ✅ | ✅ | ✅ |
| Donate to requests | ✅ | ✅ | ❌ |
| Upload payment proof | ✅ | ✅ | ❌ |
| Approve / Reject requests | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## ❗ Common Issues & Fixes

**CORS Error**
```js
// Add to Backend/server.js
app.use(cors({ origin: "http://localhost:5173" }));
```

**Student registration blocked**
- Must use `.edu.pk` email e.g. `yourname@nust.edu.pk`

**404 on page refresh**
- Make sure `frontend/vercel.json` exists with rewrite rules

**Cloudinary upload failing**
- Check all 3 Cloudinary env variables are set correctly
- Make sure `express.json({ limit: "10mb" })` is in server.js

**MongoDB connection timeout**
- Check Atlas Network Access allows `0.0.0.0/0`
- Verify `MONGO_URI` is correct in environment variables

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add some feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request


---

## 👨‍💻 Author

Made with ❤️ by [Deepak Lal](https://github.com/deepaklal009)
