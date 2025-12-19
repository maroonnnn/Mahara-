# 🔄 How to Sync Your Files to GitHub

## Quick Guide: Update GitHub When You Edit Files

---

## 🚀 Method 1: Using NPM Scripts (Easiest!)

I've added helper scripts to your `package.json`. Use these commands:

### Quick Update (All changes with default message):
```bash
npm run git:update
```
This will:
1. Add all changed files
2. Commit with message "Update files"
3. Push to GitHub

### Sync with Timestamp:
```bash
npm run git:sync
```
This creates a commit with a timestamp message.

### Step-by-Step Commands:
```bash
# Check what files changed
npm run git:status

# Add all files
npm run git:add

# Commit with custom message
npm run git:commit "Your commit message here"

# Push to GitHub
npm run git:push
```

---

## 📝 Method 2: Manual Git Commands

### Basic Workflow:

1. **Check what changed:**
   ```bash
   git status
   ```

2. **Add files to staging:**
   ```bash
   git add .
   ```
   Or add specific files:
   ```bash
   git add components/layout/Header.js
   ```

3. **Commit with a message:**
   ```bash
   git commit -m "Hide become seller button on landing page"
   ```

4. **Push to GitHub:**
   ```bash
   git push origin main
   ```

### All in One Command:
```bash
git add . && git commit -m "Your message here" && git push origin main
```

---

## 🎯 Method 3: Using Git GUI (Visual)

### Option A: GitHub Desktop
1. Download: https://desktop.github.com/
2. Sign in with your GitHub account
3. Add your repository
4. Click "Commit" and "Push" buttons

### Option B: VS Code Git Integration
1. Open VS Code
2. Click the Source Control icon (left sidebar)
3. Stage changes (click + next to files)
4. Write commit message
5. Click "Commit" then "Sync Changes"

---

## ⚡ Method 4: Create a Batch Script (Windows)

Create a file `update-github.bat` in your project root:

```batch
@echo off
echo Updating GitHub...
git add .
git commit -m "Update: %date% %time%"
git push origin main
echo Done! Check GitHub for updates.
pause
```

Then double-click the file to update GitHub!

---

## 🔄 Method 5: Auto-Sync with Git Hooks (Advanced)

### Setup Pre-Push Hook:

Create `.git/hooks/pre-push` (or use existing):

```bash
#!/bin/sh
echo "Pushing to GitHub..."
```

This runs automatically before every push.

---

## 📋 Common Git Commands Cheat Sheet

| Command | What It Does |
|---------|-------------|
| `git status` | See what files changed |
| `git add .` | Add all changed files |
| `git add filename.js` | Add specific file |
| `git commit -m "message"` | Save changes with message |
| `git push` | Upload to GitHub |
| `git pull` | Download from GitHub |
| `git log` | See commit history |

---

## 🎨 Best Practices

### 1. **Write Good Commit Messages:**
```bash
# Good ✅
git commit -m "Hide become seller button on landing page"
git commit -m "Add portfolio image gallery feature"
git commit -m "Fix mobile menu responsive issue"

# Bad ❌
git commit -m "update"
git commit -m "fix"
git commit -m "changes"
```

### 2. **Commit Often:**
- Commit after completing a feature
- Commit after fixing a bug
- Don't wait too long between commits

### 3. **Check Status Before Committing:**
```bash
git status  # Always check first!
```

### 4. **Pull Before Push (if working with team):**
```bash
git pull origin main  # Get latest changes
git push origin main  # Push your changes
```

---

## 🚨 Troubleshooting

### Issue: "Your branch is ahead of origin/main"
**Solution:** Just push!
```bash
git push origin main
```

### Issue: "Updates were rejected"
**Solution:** Pull first, then push:
```bash
git pull origin main --rebase
git push origin main
```

### Issue: "Nothing to commit"
**Solution:** You haven't changed any files, or files aren't tracked. Check:
```bash
git status
```

### Issue: "Authentication failed"
**Solution:** You need to authenticate. Use:
- Personal Access Token (recommended)
- SSH keys
- GitHub Desktop app

---

## 🔐 Setting Up Authentication

### Option 1: Personal Access Token (Recommended)

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select `repo` scope
4. Copy the token
5. Use it as password when Git prompts

### Option 2: SSH Keys

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub
# Copy ~/.ssh/id_ed25519.pub content
# Add to GitHub → Settings → SSH Keys
```

---

## 📱 Quick Reference Card

```
┌─────────────────────────────────────┐
│  UPDATE GITHUB - 3 STEPS           │
├─────────────────────────────────────┤
│  1. git add .                       │
│  2. git commit -m "message"         │
│  3. git push origin main            │
└─────────────────────────────────────┘

OR USE: npm run git:update
```

---

## 🎯 Recommended Workflow

### Daily Development:

1. **Start working:**
   ```bash
   npm run dev
   ```

2. **Make your changes** (edit files)

3. **When done with a feature:**
   ```bash
   npm run git:update
   ```
   Or with custom message:
   ```bash
   git add .
   git commit -m "Add new feature: portfolio showcase"
   git push origin main
   ```

4. **Check GitHub** - Your changes are live! 🎉

---

## 💡 Pro Tips

1. **Use descriptive commit messages:**
   - What changed?
   - Why did it change?
   - What's the impact?

2. **Commit related changes together:**
   - Don't mix unrelated features in one commit
   - One feature = one commit

3. **Use branches for big features:**
   ```bash
   git checkout -b new-feature
   # Make changes
   git commit -m "Add new feature"
   git push origin new-feature
   # Create Pull Request on GitHub
   ```

4. **Keep commits small:**
   - Easier to review
   - Easier to rollback if needed
   - Better history

---

## 🔗 Related Resources

- **GitHub Repository:** https://github.com/maroonnnn/Mahara-
- **Git Documentation:** https://git-scm.com/doc
- **GitHub Guides:** https://guides.github.com/

---

## ✅ Quick Test

Try it now! After making any change:

```bash
npm run git:update
```

Then check your GitHub repository - your changes should be there! 🚀

---

**Last Updated:** December 2024  
**Version:** 1.0

