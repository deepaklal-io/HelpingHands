# 🤝 Helping Hands — University Donation Platform

A full-stack web application that connects financially struggling university students with donors willing to support their educational needs.

---

## 📌 Features

- 🎓 **Students** can create funding requests for tuition, books, medical, and more
- 💛 **Donors** can browse approved requests and donate
- 🛡️ **Admin** can approve/reject requests and manage users
- 🔐 JWT-based authentication with role-based access
- 📧 University email validation for students (`.edu.pk` only)
- 📊 Real-time funding progress tracking

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt.js |

---

## 📁 Project Structure

```
HelpingHands/
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   └── pages/
    ├── index.html
    └── vite.config.js
```

---

## ⚙️ Prerequisites

Make sure you have these installed before running the project:

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) local OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Git](https://git-scm.com/)

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

Create a `.env` file inside the `Backend/` folder:

```env
PORT=4500
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
```

> **MongoDB URI examples:**
> - Local: `mongodb://localhost:27017/helpinghands`
> - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/helpinghands`

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

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
VITE ready
Local: http://localhost:5173/
```

---

### 4. Create the Admin Account

The admin cannot register through the UI. Run this one-time script:

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

> Run this **once only**. The admin is saved permanently in your database.

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
1. Register with your **university email** — must end in `.edu.pk`
2. Login → redirected to Student Dashboard
3. Create a funding request with title, category, description, and amount
4. Wait for admin approval
5. Track donations received on your request

### As a Donor
1. Register with any email
2. Login → redirected to Donor Dashboard
3. Browse all approved student requests
4. Click a request and donate any amount
5. View your donation history in the "My Donations" tab

### As an Admin
1. Login with admin credentials
2. View all requests in the Admin Dashboard
3. Approve or Reject pending requests
4. Manage users in the Users tab

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Requests
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/requests` | All | Get all requests |
| GET | `/api/requests/approved` | Public | Get approved requests |
| GET | `/api/requests/my` | Student | Get my requests |
| GET | `/api/requests/:id` | All | Get request by ID |
| POST | `/api/requests` | Student | Create a request |
| PATCH | `/api/requests/:id/approve` | Admin | Approve a request |
| PATCH | `/api/requests/:id/reject` | Admin | Reject a request |
| DELETE | `/api/requests/:id` | Student | Delete own request |

### Donations
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/donations` | Donor | Make a donation |
| GET | `/api/donations/my` | Donor | Get my donations |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/stats` | Admin | Platform statistics |
| GET | `/api/admin/users` | Admin | Get all users |
| DELETE | `/api/admin/users/:id` | Admin | Delete a user |

---

## 🔒 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `4500` |
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/helpinghands` |
| `JWT_SECRET` | Secret key for JWT tokens | `mysecretkey123` |

For the frontend API client, set `VITE_API_BASE_URL` if your backend is not running at `http://localhost:4500/api`.

---

## ❗ Common Issues & Fixes

**CORS Error in browser**

Add this to your `Backend/server.js`:
```js
import cors from "cors";
app.use(cors({ origin: "http://localhost:5173" }));
```
Install if needed:
```bash
npm install cors
```

**MongoDB not connecting**
- Make sure MongoDB is running locally
- Or check your Atlas connection string in `.env`

**Student registration blocked**
- Students must use a `.edu.pk` email
- Example: `yourname@nust.edu.pk`

**White screen on frontend**
- Make sure only one `<BrowserRouter>` exists — it should be inside `App.jsx` only, not in `main.jsx`

**Port already in use**
- Change `PORT=4500` to another number like `4501` in your `.env`

---

## 👥 Roles & Permissions

| Feature | Student | Donor | Admin |
|---------|---------|-------|-------|
| Register / Login | ✅ | ✅ | ✅ |
| Create funding request | ✅ | ❌ | ❌ |
| Browse approved requests | ✅ | ✅ | ✅ |
| Donate to a request | ❌ | ✅ | ❌ |
| Approve / Reject requests | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add some feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

=> [Deepak Lal](https://github.com/deepaklal009)
