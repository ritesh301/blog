# 🎉 Blogzy - Full-Stack Blog Platform

A modern, feature-rich blogging platform built with **MongoDB, Express.js, HTML/CSS/JavaScript, and Bootstrap**.

![Status](https://img.shields.io/badge/status-active-success.svg)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green.svg)
![Node.js](https://img.shields.io/badge/Backend-Node.js-blue.svg)
![Bootstrap](https://img.shields.io/badge/Frontend-Bootstrap%205-purple.svg)

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with JWT
- Two-tier authentication (User & Admin)
- Password encryption with bcrypt
- Protected routes and API endpoints

### 📝 Blog Management
- ✍️ Write, edit, and delete blogs (authenticated users)
- 📖 Read blogs without authentication
- 🔍 Search and filter by category
- ❤️ Like and comment on blogs
- 🖼️ Image support for blog posts

### 👨‍💼 Admin Dashboard
- View all blogs and statistics
- Manage user-submitted blogs
- View contact form submissions
- Delete any blog post
- Real-time dashboard updates

### 🎨 User Experience
- Responsive Bootstrap 5 design
- Dark/Light theme toggle
- Smooth animations and transitions
- Mobile-friendly interface
- Rich text content support

---

## 🚀 Quick Start

### Option 1: Automated Start (Windows)
Simply double-click `start.bat` file!

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
npm start
```

**Terminal 2 - Frontend:**
```bash
python -m http.server 3000
```

**Open Browser:**
Visit `http://localhost:3000`

📖 **Full Setup Instructions:** See [START_GUIDE.md](START_GUIDE.md)

---

## 🔑 Default Credentials

**Admin Access:**
- Username: `admin`
- Password: `admin123`

**Note:** Change these in `.env` for production!

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling
- **JavaScript (ES6+)** - Logic
- **Bootstrap 5** - UI Framework
- **Font Awesome** - Icons

---

## 📂 Project Structure

```
blogzy/
├── backend/               # Backend API
│   ├── config/           # Database configuration
│   ├── models/           # Mongoose schemas
│   ├── middleware/       # Auth middleware
│   └── routes/           # API routes
├── css/                  # Stylesheets
├── js/                   # JavaScript files
│   ├── api.js           # API helper
│   ├── blogs.js         # Blog logic
│   ├── admin.js         # Admin dashboard
│   └── main.js          # General functions
├── *.html                # HTML pages
├── server.js             # Express server
├── package.json          # Dependencies
├── .env                  # Environment variables
├── start.bat             # Quick start script
└── START_GUIDE.md        # Complete setup guide
```

---

## 🌐 Available Pages

- 🏠 **Homepage** - `/index.html`
- 📝 **All Blogs** - `/blog-list.html`
- ✍️ **Write Blog** - `/write-blog.html` (Auth required)
- 🔐 **Login** - `/login.html`
- 📋 **Register** - `/register.html`
- 👨‍💼 **Admin Dashboard** - `/admin.html` (Admin only)
- ℹ️ **About** - `/about.html`
- 📧 **Contact** - `/contact.html`

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `GET /api/auth/me` - Get current user (protected)

### Blogs
- `GET /api/blogs` - Get all blogs (public)
- `GET /api/blogs/:id` - Get single blog (public)
- `POST /api/blogs` - Create blog (protected)
- `PUT /api/blogs/:id` - Update blog (protected)
- `DELETE /api/blogs/:id` - Delete blog (protected)
- `POST /api/blogs/:id/like` - Like blog (public)
- `POST /api/blogs/:id/comment` - Comment on blog (protected)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (admin only)

---

## 📦 Installation

1. **Clone or download the project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup MongoDB:**
   - Install MongoDB Community Edition
   - Start MongoDB service
   - Default URI: `mongodb://localhost:27017/blogzy`

4. **Configure environment:**
   - Edit `.env` file if needed
   - Change JWT_SECRET for production

5. **Start the application:**
   - Use `start.bat` or follow manual steps
   - Backend: `npm start`
   - Frontend: `python -m http.server 3000`

---

## 🧪 Testing

### As User:
1. Register at `/register.html`
2. Login at `/login.html`
3. Write blog at `/write-blog.html`
4. View your blog at `/blog-list.html`

### As Admin:
1. Login with admin credentials
2. Access dashboard at `/admin.html`
3. Manage all blogs and contacts

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Kill process or change PORT in `.env` |
| MongoDB error | Ensure MongoDB service is running |
| CORS error | Check both servers are running |
| 404 on API | Verify backend is on port 5000 |

See [START_GUIDE.md](START_GUIDE.md) for detailed troubleshooting.

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected API routes
- ✅ Input validation
- ✅ CORS configuration
- ✅ SQL injection prevention (NoSQL)
- ✅ XSS protection

**Note:** For production, ensure:
- Change JWT_SECRET
- Use HTTPS
- Set secure environment variables
- Enable rate limiting
- Use production MongoDB cluster

---

## 📝 License

This project is created for educational purposes.

---

## 👨‍💻 Author

Created by Ritesh Pradhan

---

## 🎉 Enjoy Blogging!

Start sharing your thoughts with the world! 🌍✨

For issues or questions, check the [START_GUIDE.md](START_GUIDE.md) documentation.
