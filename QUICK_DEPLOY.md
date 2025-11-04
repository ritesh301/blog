# 🚀 Quick Deployment Steps

## Before Pushing to GitHub:

### 1. Update Backend URL in Files:

After deploying backend on Render, update these files with your actual backend URL:

#### `netlify.toml` (Line 7):
```toml
to = "https://YOUR-BACKEND-URL.onrender.com/api/:splat"
```

#### `js/config.js` (Line 8):
```javascript
: 'https://YOUR-BACKEND-URL.onrender.com/api';
```

### 2. Update CORS in `server.js` (Line 15):
After getting Netlify URL:
```javascript
? ['https://YOUR-SITE-NAME.netlify.app']
```

---

## Deployment Order:

### Step 1: Setup MongoDB Atlas
1. Create free cluster
2. Create database user
3. Whitelist IP: 0.0.0.0/0
4. Get connection string
5. Save it for Render deployment

### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/blogzy.git
git push -u origin main
```

### Step 3: Deploy Backend (Render)
1. New Web Service
2. Connect GitHub repo
3. Add environment variables:
   - MONGODB_URI
   - JWT_SECRET
   - NODE_ENV=production
   - ADMIN_USERNAME=admin
   - ADMIN_PASSWORD=your_password
4. Deploy and copy URL

### Step 4: Update Config Files
1. Update netlify.toml with Render URL
2. Update js/config.js with Render URL
3. Commit and push:
```bash
git add .
git commit -m "Update API URLs"
git push origin main
```

### Step 5: Deploy Frontend (Netlify)
1. New site from Git
2. Connect GitHub repo
3. Deploy
4. Get Netlify URL

### Step 6: Update CORS
1. Update server.js with Netlify URL
2. Commit and push
```bash
git add .
git commit -m "Update CORS"
git push origin main
```

---

## 🎯 URLs You Need:

- **MongoDB URI:** mongodb+srv://user:pass@cluster.mongodb.net/blogzy
- **Render Backend:** https://blogzy-backend-xxxx.onrender.com
- **Netlify Frontend:** https://your-site-name.netlify.app

---

## ✅ Test After Deployment:

1. Visit Netlify URL
2. Register new user
3. Login
4. Create blog post
5. Admin login (admin/your_password)
6. Check admin dashboard

---

## 🔄 To Update:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Both Render and Netlify will auto-deploy!
