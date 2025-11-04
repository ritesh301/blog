# 🚀 Blogzy Deployment Guide - Netlify + Render

This guide will help you deploy your Blogzy application with the frontend on **Netlify** and backend on **Render** (free tier).

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Netlify account (sign up at netlify.com)
- ✅ Render account (sign up at render.com)
- ✅ MongoDB Atlas account (sign up at mongodb.com/cloud/atlas)

---

## Part 1: Setup MongoDB Atlas (Cloud Database)

### Step 1: Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login
3. Click **"Build a Database"**
4. Choose **FREE tier** (M0 Sandbox)
5. Select a cloud provider and region (choose closest to you)
6. Name your cluster: `blogzy-cluster`
7. Click **"Create"**

### Step 2: Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `blogzy-admin`
5. Password: **Generate** (copy and save it!)
6. Database User Privileges: **Atlas Admin**
7. Click **"Add User"**

### Step 3: Whitelist IP Address

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - IP Address: `0.0.0.0/0`
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **4.1 or later**
4. Copy the connection string:
   ```
   mongodb+srv://blogzy-admin:<password>@blogzy-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `/blogzy` after `.net`
   
   Final format:
   ```
   mongodb+srv://blogzy-admin:YOUR_PASSWORD@blogzy-cluster.xxxxx.mongodb.net/blogzy?retryWrites=true&w=majority
   ```

**Save this connection string! You'll need it for Render deployment.**

---

## Part 2: Push Code to GitHub

### Step 1: Initialize Git Repository

Open terminal in your project folder:

```bash
cd "c:\Users\RITESH PRADHAN\OneDrive\Desktop\blogzy"
git init
```

### Step 2: Add Files

```bash
git add .
```

### Step 3: Commit

```bash
git commit -m "Initial commit - Blogzy full-stack app"
```

### Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **"+"** → **"New repository"**
3. Repository name: `blogzy`
4. Description: `Full-stack blog platform with MongoDB`
5. Choose **Public**
6. **DON'T** initialize with README (we already have code)
7. Click **"Create repository"**

### Step 5: Push to GitHub

Copy the commands shown on GitHub and run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/blogzy.git
git branch -M main
git push -u origin main
```

✅ **Your code is now on GitHub!**

---

## Part 3: Deploy Backend on Render

### Step 1: Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: **blogzy**
4. Click **"Connect"**

### Step 2: Configure Service

Fill in the details:

- **Name**: `blogzy-backend`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: Leave blank (or `.`)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: **Free**

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `your_mongodb_atlas_connection_string` |
| `JWT_SECRET` | `your_super_secret_random_string_here_make_it_long_and_random` |
| `JWT_EXPIRE` | `7d` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `admin123` (change this!) |
| `PORT` | `5000` |

**Important:** Replace values with your actual MongoDB URI and strong JWT secret!

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://blogzy-backend-xxxx.onrender.com`

**Copy this URL! You'll need it for Netlify.**

### Step 5: Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see:
```json
{
  "success": true,
  "message": "Blogzy API is running!",
  "timestamp": "2025-11-02T..."
}
```

✅ **Backend is deployed!**

---

## Part 4: Deploy Frontend on Netlify

### Step 1: Update Configuration Files

Before deploying to Netlify, update these files:

#### 1. Update `netlify.toml`

Replace `your-backend-url.onrender.com` with your actual Render backend URL:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://blogzy-backend-xxxx.onrender.com/api/:splat"
  status = 200
  force = true
```

#### 2. Update `js/config.js`

Replace the production API URL:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : 'https://blogzy-backend-xxxx.onrender.com/api'; // Your actual backend URL
```

#### 3. Update `server.js` CORS settings

Replace the Netlify URL placeholders:

```javascript
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-site-name.netlify.app', 'https://www.your-site-name.netlify.app']
        : '*',
    // ...
};
```

**Note:** You can also update this after deployment when you know your Netlify URL.

#### 4. Commit and Push Changes

```bash
git add .
git commit -m "Update API URLs for production deployment"
git push origin main
```

### Step 2: Deploy to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"GitHub"**
4. Authorize Netlify to access your repositories
5. Select your **blogzy** repository
6. Click **"Deploy site"**

### Step 3: Configure Build Settings

Netlify will auto-detect settings from `netlify.toml`, but verify:

- **Base directory**: Leave blank
- **Build command**: `echo 'No build required'`
- **Publish directory**: `.` (current directory)
- **Production branch**: `main`

Click **"Deploy blogzy"**

### Step 4: Wait for Deployment

- Deployment takes 1-2 minutes
- You'll get a random URL like: `https://random-name-12345.netlify.app`

### Step 5: Change Site Name (Optional)

1. Go to **Site settings** → **Site details**
2. Click **"Change site name"**
3. Enter your preferred name: `my-blogzy-app`
4. Your new URL: `https://my-blogzy-app.netlify.app`

### Step 6: Update Backend CORS

Now that you have your Netlify URL, update the backend CORS:

1. Go to your Render dashboard
2. Click on **blogzy-backend** service
3. Go to **Environment**
4. Add new environment variable:
   - Key: `FRONTEND_URL`
   - Value: `https://your-site-name.netlify.app`

Or update `server.js` and push:

```javascript
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://my-blogzy-app.netlify.app']
        : '*',
    // ...
};
```

Then commit and push:
```bash
git add .
git commit -m "Update CORS with Netlify URL"
git push origin main
```

Render will auto-redeploy.

✅ **Frontend is deployed!**

---

## Part 5: Final Testing

### Test Your Live Website

1. Visit your Netlify URL: `https://your-site-name.netlify.app`

2. **Test Registration:**
   - Go to `/register.html`
   - Create a new account
   - Check if you're redirected to login

3. **Test Login:**
   - Go to `/login.html`
   - Login with your credentials
   - Check if you're redirected to homepage

4. **Test Blog Creation:**
   - Go to `/write-blog.html`
   - Create a new blog
   - Check if it appears in `/blog-list.html`

5. **Test Admin:**
   - Go to `/login.html`
   - Switch to Admin tab
   - Login with: `admin` / `admin123`
   - Go to `/admin.html`
   - Check if you see all blogs and statistics

---

## 🎯 Your Deployed URLs

After completing all steps, you'll have:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend (Netlify)** | `https://your-site-name.netlify.app` | Main website |
| **Backend (Render)** | `https://blogzy-backend-xxxx.onrender.com` | API server |
| **Database (MongoDB Atlas)** | Cloud cluster | Data storage |

---

## 🔧 Configuration Summary

### Files Updated for Deployment:
- ✅ `netlify.toml` - Netlify configuration
- ✅ `render.yaml` - Render configuration (optional)
- ✅ `js/config.js` - API URL configuration
- ✅ `js/api.js` - Dynamic API base URL
- ✅ `server.js` - CORS configuration
- ✅ `package.json` - Build scripts
- ✅ `.gitignore` - Ignore sensitive files
- ✅ `.env.example` - Environment variable template

---

## 🚨 Important Notes

### 1. **Free Tier Limitations:**
- **Render Free:** Server sleeps after 15 min of inactivity (wakes in ~30 sec on first request)
- **MongoDB Atlas Free:** 512 MB storage
- **Netlify Free:** 100 GB bandwidth/month

### 2. **Security:**
- Change default admin password!
- Use strong JWT_SECRET
- Don't commit `.env` file to GitHub

### 3. **Custom Domain (Optional):**
- You can add a custom domain in Netlify settings
- Update CORS settings accordingly

---

## 🔄 Updating Your Website

Whenever you make changes:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

- **Netlify:** Auto-deploys on push (takes 1-2 min)
- **Render:** Auto-deploys on push (takes 5-10 min)

---

## 📊 Monitoring

### Check Backend Status:
Visit: `https://your-backend-url.onrender.com/api/health`

### Check Netlify Status:
Visit your Netlify dashboard → Deploys

### Check MongoDB:
Visit MongoDB Atlas → Metrics

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" errors
**Solution:** 
- Check if backend is awake (visit `/api/health`)
- Verify CORS settings include your Netlify URL
- Check browser console for exact error

### Issue: "MongoDB connection failed"
**Solution:**
- Verify MongoDB Atlas connection string is correct
- Check if IP whitelist includes `0.0.0.0/0`
- Verify database user credentials

### Issue: "404 Not Found" on refresh
**Solution:**
- Make sure `netlify.toml` has the redirect rule
- Netlify should handle SPA routing automatically

### Issue: Backend slow on first request
**Solution:**
- This is normal on Render free tier (server sleeps)
- First request takes 20-30 seconds to wake up
- Consider upgrading to paid tier if needed

---

## ✅ Deployment Checklist

Before going live, ensure:

- [ ] MongoDB Atlas cluster created and connection string obtained
- [ ] GitHub repository created and code pushed
- [ ] Backend deployed on Render with all environment variables
- [ ] Backend health check passes
- [ ] Frontend deployed on Netlify
- [ ] API URLs updated in config files
- [ ] CORS settings include Netlify URL
- [ ] Admin credentials changed from defaults
- [ ] All pages tested (register, login, blog creation, admin)
- [ ] Mobile responsiveness verified

---

## 🎉 Congratulations!

Your Blogzy application is now live on the internet! 🌐

**Share your live URL with friends and start blogging! 📝**

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Render logs for backend errors
3. Check Netlify deploy logs
4. Verify all environment variables are set correctly

---

**Happy Blogging! 🚀**
