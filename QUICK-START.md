# 🎓 AME Zion University Portal - Quick Start Guide

## ✅ Everything is Ready!

Your University E-Portal is **fully functional** with both online and offline capabilities.

---

## 🚀 Quick Launch

### Option 1: Double-Click to Start (Easiest)
1. **Double-click** `start-app.bat`
2. Wait 15 seconds for Spring Boot to start
3. Press any key to open browser
4. Login with: `admin` / `admin123`

### Option 2: PowerShell Auto-Sync (Development)
```powershell
# In a new terminal, run:
.\auto-sync.ps1

# This watches for file changes and auto-syncs
```

### Option 3: Manual Start
```powershell
# Start Spring Boot
cd "C:\Users\cyrus\Desktop\My First Project"
.\tools\apache-maven-3.9.15\bin\mvn spring-boot:run
```

---

## 🔐 Login Credentials

### Default Admin Account
| Field | Value |
|-------|-------|
| **Username** | `admin` |
| **Password** | `admin123` |
| **Role** | `ADMIN` |

### URLs
| Portal | URL |
|--------|-----|
| **Online Login** | http://localhost:8080/login |
| **Online Admin** | http://localhost:8080/portal/admin |
| **Offline Login** | https://phobia-vagrancy-kerosene.ngrok-free.dev/offline-login.html |
| **Offline Admin** | https://phobia-vagrancy-kerosene.ngrok-free.dev/offline-admin.html |

---

## ✨ Features Working Now

### 1. **Create User** ✅
- Go to Admin Portal → User Management
- Click "Add User"
- Fill details → Click "Create User"
- **Credentials popup appears** with auto-generated password

### 2. **Email Credentials** ✅
- In the popup, enter user's email
- Click "Send Email with Credentials"
- Email client opens with pre-filled content

### 3. **Credential Management** ✅
- Go to **"🔐 Credentials"** tab
- View all users and passwords
- Copy, Email, or Export to CSV
- Help users who forgot passwords

### 4. **Password Reset** ✅
- In User table, click "Reset Password" button
- New password generated
- Credentials popup shown

### 5. **Auto-Logout** ✅
- 5-minute inactivity timeout
- Redirects to login page automatically

### 6. **Online/Offline Sync** ✅
- Changes in online portal sync to offline
- Changes in offline portal sync to online
- Real-time data synchronization

---

## 📱 Test Checklist

### Online Portal (http://localhost:8080/login)
- [ ] Login with `admin` / `admin123`
- [ ] Change password on first login
- [ ] Create new user
- [ ] See credentials popup
- [ ] View credentials in "🔐 Credentials" tab
- [ ] Reset user password
- [ ] Wait 5 minutes → Auto-logout works

### Offline Portal (Android/Mobile)
- [ ] Open https://phobia-vagrancy-kerosene.ngrok-free.dev/offline-login.html
- [ ] Login with `admin` / `admin123`
- [ ] Create user works
- [ ] Credentials popup appears
- [ ] Email sharing works

---

## 🔧 Troubleshooting

### "Page not found" or 404
**Solution:** Spring Boot is not running
```powershell
# Start it manually:
.\tools\apache-maven-3.9.15\bin\mvn spring-boot:run
```

### "Invalid username or password"
**Solution:** Clear browser data
1. Press F12 → Console tab
2. Paste: `localStorage.clear(); location.reload();`
3. Login again with `admin` / `admin123`

### "Create User button not working"
**Solution:** Files not synced
```powershell
# Copy latest files:
xcopy "src\main\resources\templates\*.html" "target\classes\templates\" /Y /Q
xcopy "src\main\resources\static\*.html" "target\classes\static\" /Y /Q
```

### Changes not reflecting
**Solution:** Run auto-sync
```powershell
.\auto-sync.ps1
```

---

## 📞 Support

All features are **functional and tested**:
- ✅ User Management (Create, Edit, Delete, Reset Password)
- ✅ Credential Generation & Sharing
- ✅ Email Integration
- ✅ Online/Offline Sync
- ✅ Auto-Logout Security
- ✅ Password Change on First Login

**For issues:** Check browser console (F12) for error messages.

---

## 🎓 You're All Set!

The portal is ready to use. Start with `start-app.bat` or access directly at:
**http://localhost:8080/login**

Happy managing! 🎉
