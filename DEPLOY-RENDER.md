# Deploy to Render.com (FREE - No ngrok needed!)

## Step 1: Push Code to GitHub
Your code is already on GitHub: https://github.com/cyruslarkpor11/ame-university-portal

## Step 2: Sign Up on Render
1. Go to: https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (easiest)

## Step 3: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repo: `ame-university-portal`
3. Select the repository

## Step 4: Configure Deployment
Render will auto-detect the `render.yaml` config. Verify these settings:

| Setting | Value |
|---------|-------|
| **Name** | ame-university-portal |
| **Runtime** | Docker |
| **Plan** | Free |
| **Branch** | main |
| **Root Directory** | (leave empty) |

## Step 5: Environment Variables
Add these (already in render.yaml):
- `JAVA_OPTS`: `-Xmx512m -Xms256m`
- `SERVER_PORT`: `10000`
- `SPRING_PROFILES_ACTIVE`: `prod`

## Step 6: Deploy!
Click "Create Web Service"

Render will:
1. Build the Docker image
2. Deploy the app
3. Give you a **permanent URL** like:
   - `https://ame-university-portal.onrender.com`

## Step 7: Update Your URLs
Once deployed, use this URL on ALL devices (no ngrok needed!):

```
https://ame-university-portal.onrender.com
```

### Admin Portal:
```
https://ame-university-portal.onrender.com/portal/admin
```

### Login:
```
https://ame-university-portal.onrender.com/login
```

## ✅ Benefits:
- **Always online** - 24/7 availability
- **Works on Android** - no ngrok needed
- **Works on Computer** - anywhere in the world
- **Auto-deploys** - when you push to GitHub
- **Free forever** - with some limitations

## 🔄 Auto-Sync Still Works!
Your backend database sync will work because all devices connect to the same server!

---

**Want me to walk you through it step by step?**
