# 🚀 CI/CD Setup Guide for Mahara

## Overview

This project uses **GitHub Actions** for Continuous Integration and Continuous Deployment (CI/CD). Every push to the repository automatically triggers tests, builds, and deployments.

---

## 📋 Workflows Included

### 1. **CI - Test and Lint** (`.github/workflows/ci.yml`)
- **Triggers:** Push to `main` or `develop`, Pull Requests
- **What it does:**
  - Runs on Node.js 18.x and 20.x
  - Installs dependencies
  - Runs ESLint
  - Builds the project
  - Uploads build artifacts

### 2. **CD - Deploy to Vercel** (`.github/workflows/cd.yml`)
- **Triggers:** Push to `main`, Manual trigger
- **What it does:**
  - Builds the project
  - Deploys to Vercel production
  - Uses Vercel tokens for authentication

### 3. **PR - Quality Check** (`.github/workflows/pr-check.yml`)
- **Triggers:** Pull Requests to `main` or `develop`
- **What it does:**
  - Runs linter
  - Builds project
  - Checks build size
  - Comments on PR with status

### 4. **Security Scan** (`.github/workflows/security-scan.yml`)
- **Triggers:** Push to `main`, PRs, Weekly schedule
- **What it does:**
  - Runs `npm audit`
  - Checks for vulnerabilities
  - Generates security report

---

## 🔧 Setup Instructions

### Step 1: Get Vercel Credentials

If you want to use automated Vercel deployment, you need:

1. **Vercel Token:**
   - Go to https://vercel.com/account/tokens
   - Create a new token
   - Copy the token

2. **Vercel Org ID:**
   - Go to https://vercel.com/account
   - Copy your Organization ID

3. **Vercel Project ID:**
   - Go to your project settings on Vercel
   - Copy the Project ID

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

```
VERCEL_TOKEN = your_vercel_token
VERCEL_ORG_ID = your_org_id
VERCEL_PROJECT_ID = your_project_id
```

### Step 3: Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions", select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**

### Step 4: Test the Workflow

1. Make a small change to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test CI/CD workflow"
   git push origin main
   ```
3. Go to **Actions** tab on GitHub
4. Watch the workflow run! 🎉

---

## 🎯 How It Works

### On Push to Main:

```
Push to GitHub
    ↓
CI Workflow Runs
    ├─ Install dependencies
    ├─ Run linter
    ├─ Build project
    └─ Upload artifacts
    ↓
CD Workflow Runs
    ├─ Build project
    └─ Deploy to Vercel
    ↓
✅ Your app is live!
```

### On Pull Request:

```
Create PR
    ↓
PR Check Workflow Runs
    ├─ Run linter
    ├─ Build project
    ├─ Check build size
    └─ Comment on PR
    ↓
✅ Ready to merge!
```

---

## 📊 Viewing Workflow Status

### On GitHub:
1. Go to your repository
2. Click **Actions** tab
3. See all workflow runs and their status

### Add Status Badge to README:

Add this to your README.md:

```markdown
![CI](https://github.com/maroonnnn/Mahara-/workflows/CI%20-%20Test%20and%20Lint/badge.svg)
![Deploy](https://github.com/maroonnnn/Mahara-/workflows/Deploy%20to%20Vercel/badge.svg)
```

---

## 🔐 Environment Variables

If your app needs environment variables:

1. **For GitHub Actions:**
   - Add them in workflow files under `env:`
   - Or use GitHub Secrets

2. **For Vercel:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add your variables there

---

## 🛠️ Customizing Workflows

### Add Tests:

If you add tests later, update `ci.yml`:

```yaml
- name: Run tests
  run: npm test
```

### Add More Checks:

```yaml
- name: Type check (if using TypeScript)
  run: npm run type-check

- name: Run E2E tests
  run: npm run test:e2e
```

### Deploy to Multiple Environments:

```yaml
# Deploy to staging
- name: Deploy to Staging
  if: github.ref == 'refs/heads/develop'
  run: vercel --prod=false

# Deploy to production
- name: Deploy to Production
  if: github.ref == 'refs/heads/main'
  run: vercel --prod
```

---

## 🚨 Troubleshooting

### Workflow Fails on Lint:

**Solution:** Fix linting errors or update workflow:
```yaml
- name: Run ESLint
  run: npm run lint
  continue-on-error: true  # Don't fail on lint errors
```

### Vercel Deployment Fails:

**Check:**
1. ✅ Secrets are set correctly
2. ✅ Vercel project exists
3. ✅ Token has correct permissions
4. ✅ Build succeeds locally

### Build Fails:

**Check:**
1. ✅ All dependencies in `package.json`
2. ✅ Node version matches (20.x)
3. ✅ Environment variables set
4. ✅ No syntax errors

---

## 📈 Workflow Status

You can check workflow status:

- **Green ✅** = All checks passed
- **Yellow 🟡** = In progress
- **Red ❌** = Failed (check logs)

---

## 🎯 Best Practices

1. **Always test locally first:**
   ```bash
   npm run lint
   npm run build
   ```

2. **Use meaningful commit messages:**
   ```bash
   git commit -m "feat: Add new feature"
   git commit -m "fix: Fix bug in header"
   ```

3. **Keep workflows fast:**
   - Cache dependencies
   - Run only necessary checks
   - Use parallel jobs when possible

4. **Monitor workflow runs:**
   - Check Actions tab regularly
   - Fix failing workflows quickly
   - Review security reports

---

## 🔗 Useful Links

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Vercel Docs:** https://vercel.com/docs
- **Your Workflows:** https://github.com/maroonnnn/Mahara-/actions

---

## ✅ Quick Checklist

- [ ] Vercel secrets added to GitHub
- [ ] GitHub Actions enabled
- [ ] Tested with a push
- [ ] Workflow badges added to README (optional)
- [ ] Environment variables configured
- [ ] Team notified about CI/CD setup

---

## 🎉 You're All Set!

Your CI/CD pipeline is now active. Every push will:
- ✅ Run tests and linting
- ✅ Build your project
- ✅ Deploy to Vercel (if configured)
- ✅ Check for security issues

**Happy deploying! 🚀**

---

**Last Updated:** December 2024  
**Version:** 1.0

