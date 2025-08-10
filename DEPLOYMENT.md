# Deployment Guide for Sebb.ai

## 🚀 Deploy to Render

Your Rails app is now configured for deployment to Render! Here's how to deploy it:

### 1. **Prepare Your Repository**

Make sure all your changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

### 2. **Deploy to Render**

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `sebb-ai` (or your preferred name)
   - **Environment**: `Docker`
   - **Region**: `Oregon` (or your preferred region)
   - **Branch**: `main`
   - **Root Directory**: Leave empty (root of repo)

### 3. **Environment Variables**

Set these environment variables in Render:

- `RAILS_ENV`: `production`
- `RAILS_MASTER_KEY`: Copy the content of `config/credentials/production.key`
- `DATABASE_URL`: Will be auto-set by Render
- `SEBB_AI_DATABASE_PASSWORD`: Will be auto-set by Render

### 4. **Database Setup**

Render will automatically create a PostgreSQL database for you. The connection details will be automatically configured.

### 5. **Build & Deploy**

Click "Create Web Service" and Render will:
1. Build your Docker image
2. Install dependencies
3. Precompile assets
4. Start your Rails server

## 🔧 What We Fixed

### **Local Development Issues:**
- ✅ Corrupted credentials files (master.key and production.key)
- ✅ Stale server processes
- ✅ Missing development configuration

### **Production Deployment Issues:**
- ✅ Incomplete render.yaml configuration
- ✅ Dockerfile port configuration
- ✅ Bundler version compatibility
- ✅ Production credentials setup

## 🐛 Troubleshooting

### **If Build Fails:**

1. **Check Render logs** for specific error messages
2. **Verify environment variables** are set correctly
3. **Ensure RAILS_MASTER_KEY** matches your production.key file

### **If App Won't Start:**

1. **Check database connection** in Render logs
2. **Verify PORT environment variable** is set
3. **Check if assets are precompiled** correctly

### **Common Issues:**

- **Bundler errors**: We've specified bundler version 2.5.11 in render.yaml
- **Credentials issues**: We've added fallback secret_key_base in production.rb
- **Port binding**: Dockerfile now uses $PORT environment variable

## 📱 Testing Your Deployment

Once deployed, you can:

1. **Visit your Render URL** (e.g., `https://sebb-ai.onrender.com`)
2. **Test all pages** to ensure they load correctly
3. **Check database functionality** if you have any database features
4. **Monitor performance** in Render dashboard

## 🔄 Updating Your App

To deploy updates:

1. **Push changes to GitHub**
2. **Render will automatically redeploy** (if auto-deploy is enabled)
3. **Or manually redeploy** from Render dashboard

## 💡 Pro Tips

- **Enable auto-deploy** for automatic updates when you push to main
- **Set up monitoring** to track your app's performance
- **Use Render's free tier** for testing, then upgrade as needed
- **Check logs regularly** to catch issues early

## 🆘 Need Help?

If you encounter issues:

1. **Check Render logs** first
2. **Verify environment variables**
3. **Ensure all files are committed** to GitHub
4. **Check if database is accessible**

Your app should now deploy successfully to Render! 🎉 