# Deploy to Railway.app (EASIEST - Free!)

## Step 1: Sign Up on Railway
1. Go to: https://railway.app
2. Click "Start for Free"
3. Sign up with GitHub

## Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose: `cyruslarkpor11/ame-university-portal`

## Step 3: Deploy
Railway will auto-detect the `Dockerfile` and deploy!

Just click "Deploy" and wait 2-3 minutes.

## Step 4: Get Your URL
Railway will give you a URL like:
```
https://ame-university-portal.up.railway.app
```

## Step 5: Use This URL Everywhere
Update your Android and Computer to use:

| Portal | URL |
|--------|-----|
| **Login** | `https://ame-university-portal.up.railway.app/login` |
| **Admin** | `https://ame-university-portal.up.railway.app/portal/admin` |

## ✅ Done!
No ngrok needed! Works on Android and Computer from anywhere!

---

## Alternative: Railway CLI (Faster)

Install Railway CLI:
```bash
npm install -g @railway/cli
```

Login and deploy:
```bash
cd "C:\Users\cyrus\Desktop\My First Project"
railway login
railway init
railway up
```

Get URL:
```bash
railway domain
```

---

**Both Render and Railway are FREE and work great!**
- **Railway** = Easier, faster deployment
- **Render** = More features, slightly more complex

**Which one do you want to use?**
