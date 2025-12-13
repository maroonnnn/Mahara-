# Seller Onboarding & Portfolio Integration

This document explains how the seller onboarding process is integrated with the portfolio and profile system.

## 🚀 Flow Overview

### 1. **User Clicks "Become a Seller"**
   - **Where**: Header → "Become a Seller" link
   - **Goes To**: `/become-seller` (Marketing Page)
   - **Purpose**: Show the benefits of becoming a seller

### 2. **Marketing Page**
   - **Location**: `/become-seller`
   - **Content**:
     - Hero section with "Work Your Way"
     - Statistics (Gigs bought every 4 SEC, 50M+ transactions)
     - How it works (3 steps)
     - Freelance community showcase
     - Buyer stories
   - **Action**: Click "Become a Seller" button

### 3. **Onboarding Process**
   - **Location**: `/seller/onboarding`
   - **3 Steps**:
     
     #### **Step 1: Personal Info**
     - Full Name
     - Display Name (publicly visible)
     - Profile Picture Upload (with preview)
     - Description (with 600 character limit)
     - Languages (dynamic, with proficiency levels)
     
     #### **Step 2: Professional Info**
     - Occupation (dropdown)
     - Skills (multi-select checkboxes)
     - Education (dynamic entries)
     - Certifications (dynamic entries)
     - Personal Website URL
     
     #### **Step 3: Account Security**
     - Email Verification
     - Phone Number Verification

### 4. **Data Storage**
   When the onboarding is completed:
   - All data is saved to `localStorage` under the key `sellerProfile`
   - User role is updated to `'seller'`
   - Data structure:
     ```javascript
     {
       personalInfo: {
         fullName: string,
         displayName: string,
         profilePicture: string (URL or base64),
         description: string,
         languages: [{ language: string, level: string }]
       },
       professionalInfo: {
         occupation: string,
         skills: string[],
         education: [{ country: string, college: string, title: string, year: number }],
         certification: [{ certificate: string, from: string, year: number }],
         personalWebsite: string
       },
       accountSecurity: {
         emailVerified: boolean,
         phoneVerified: boolean,
         phone: string
       }
     }
     ```

### 5. **Portfolio Page**
   - **Location**: `/seller/portfolio`
   - **What Happens**:
     - Checks for `sellerProfile` in localStorage
     - If found, displays a **Welcome Banner** with:
       - Personalized greeting using display name
       - Profile summary (occupation, skills, languages, account status)
       - Quick actions: "Create Your First Gig" and "Edit Profile"
     - Shows portfolio management interface
     - User can add/edit/delete portfolio items

### 6. **Public Seller Profile**
   - **Location**: `/seller/[username]`
   - **Integration**:
     - Automatically loads seller profile data from `sellerProfile` in localStorage
     - Displays:
       - Name, title, bio from onboarding
       - Skills and languages
       - Education and certifications
       - Personal website link
     - Shows portfolio items

## 📊 Data Flow Diagram

```
┌─────────────────────┐
│   Marketing Page    │
│  /become-seller     │
└──────────┬──────────┘
           │ Click "Become a Seller"
           ▼
┌─────────────────────┐
│  Onboarding Page    │
│ /seller/onboarding  │
│                     │
│  Step 1: Personal   │
│  Step 2: Professional│
│  Step 3: Security   │
└──────────┬──────────┘
           │ Submit
           ▼
┌─────────────────────┐
│   localStorage      │
│  "sellerProfile"    │
└─────────┬───────────┘
          │
          ├─────────────────────┐
          │                     │
          ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│ Portfolio Page   │  │ Public Profile   │
│ /seller/portfolio│  │ /seller/username │
│                  │  │                  │
│ - Welcome Banner │  │ - Display Info   │
│ - Profile Summary│  │ - Portfolio Grid │
│ - Add Projects   │  │ - Skills         │
└──────────────────┘  └──────────────────┘
```

## 🔄 Integration Points

### 1. **Onboarding → Portfolio**
   - **File**: `pages/seller/onboarding.js`
   - **Function**: `handleSubmit()`
   - **Action**: Saves data to localStorage and redirects to `/seller/portfolio`

### 2. **Portfolio → Display Profile**
   - **File**: `pages/seller/portfolio/index.js`
   - **useEffect**: Loads `sellerProfile` from localStorage
   - **State**: `sellerProfile`, `showWelcome`

### 3. **Public Profile → Display Data**
   - **File**: `pages/seller/[username].js`
   - **Function**: `fetchSellerData()`
   - **Action**: Merges localStorage data with default data

## 🛠️ Services

### **sellerService.js** (New)
   Located at: `services/sellerService.js`
   
   Functions:
   - `completeOnboarding(data)` - Submit onboarding data to API
   - `getProfile(username)` - Get seller profile by username
   - `updateProfile(data)` - Update seller profile
   - `getMyProfile()` - Get current user's seller profile

## 🌐 API Integration (Future)

Currently, all data is stored in localStorage for demonstration. To connect to a real backend:

1. **Update `handleSubmit()` in onboarding**:
   ```javascript
   const response = await sellerService.completeOnboarding(onboardingData);
   // Store only necessary data in localStorage
   // Most data should come from API
   ```

2. **Update portfolio page**:
   ```javascript
   const profile = await sellerService.getMyProfile();
   setSellerProfile(profile);
   ```

3. **Update public profile**:
   ```javascript
   const seller = await sellerService.getProfile(username);
   setSeller(seller);
   ```

## ✅ Features

- ✅ 3-step onboarding process
- ✅ Form validation
- ✅ Profile picture upload with preview
- ✅ Dynamic fields (languages, education, certifications)
- ✅ Data persistence (localStorage)
- ✅ Welcome banner on portfolio page
- ✅ Profile summary display
- ✅ Integration with public profile
- ✅ Bilingual support (English/Arabic)
- ✅ RTL support

## 🔐 Access Control

- **Onboarding Page**: No authentication required (for testing)
  - Change `allowUnauthenticated={true}` to `{false}` in production
- **Portfolio Page**: Currently allows unauthenticated access
  - Should be protected in production
- **Public Profile**: Accessible by anyone

## 📝 Next Steps

1. **Connect to Backend API**
   - Implement actual API endpoints
   - Replace localStorage with API calls
   - Add proper authentication

2. **Add Profile Editing**
   - Create `/seller/profile/edit` page
   - Allow sellers to update their information
   - Sync with portfolio and public profile

3. **Create Gig Functionality**
   - Implement `/seller/create-gig` page
   - Use seller profile data for gig creation
   - Link gigs to portfolio

4. **Verification Process**
   - Implement real email verification
   - Implement real phone verification
   - Add document verification for professional sellers

## 📱 Testing

To test the complete flow:

1. Visit: `http://localhost:3002`
2. Click **"Become a Seller"** in header
3. On marketing page, click **"Become a Seller"** button
4. Complete all 3 steps of onboarding:
   - Fill in personal information
   - Select occupation and skills
   - Verify email and phone (mock)
5. Click **"Complete Profile"**
6. You'll be redirected to `/seller/portfolio`
7. See the welcome banner with your profile summary
8. Add portfolio items
9. Visit `/seller/your-username` to see your public profile

---

**Created**: November 2025  
**Last Updated**: November 2025  
**Version**: 1.0

