# 📓 Notes App – How to Run

## Two Parts to Start

This app has **two parts** that must run simultaneously:

### 1️⃣ Backend Server (file watcher + API)
```bash
node server/index.js
```
This starts on **http://localhost:3001** and:
- Watches `public/content/` folder for any changes
- Serves file tree via `/api/tree`
- Serves file content via `/api/file?path=...`
- Pushes real-time updates via WebSocket

### 2️⃣ Frontend (React app)
```bash
npm run dev
```
This starts on **http://localhost:5173**

## 🔄 How Live Reload Works

1. Add a new `.md` file to `public/content/YourFolder/`
2. Chokidar detects the change instantly
3. Server sends a WebSocket message to the browser
4. The sidebar updates automatically — **no refresh needed!**

## 📁 Content Folder Structure

```
public/
  content/
    CSS/
      intro.md
    HTML/
      index.md
    JAVA/
      DSA_in_Java.md
    Javascript/
      chapter1_Introduction.md
      chapter2_Basics.md
      ...
```

Just add or edit `.md` files in any subfolder and the app updates live!
