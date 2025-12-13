# Profile Pages Guide

## Overview
Both customers and sellers now have their own profile pages where they can manage their personal and professional information.

---

## 🔗 Profile Page URLs

### Customer Profile
- **URL**: `/client/profile`
- **Route**: `pages/client/profile.js`
- **Access**: Only for clients/customers

### Seller Profile  
- **URL**: `/freelancer/profile`
- **Route**: `pages/freelancer/profile.js`
- **Access**: Only for freelancers/sellers

---

## 📋 Customer Profile Features

### Sections:
1. **Profile Picture**
   - Upload/change profile photo
   - Display name and member since date

2. **Personal Information**
   - Full name
   - Email address
   - Phone number
   - Location
   - Bio/About you

3. **Company Information** (Optional)
   - Company name
   - Website URL

### Fields Available:
```javascript
{
  name: string,
  email: string,
  phone: string,
  location: string,
  bio: string,
  company: string,
  website: string
}
```

---

## 🛠️ Seller Profile Features

### Sections:
1. **Profile Picture**
   - Upload/change profile photo
   - Display name, title, and member since date

2. **Personal Information**
   - Full name
   - Email address
   - Phone number
   - Location
   - Professional title (e.g., "Full Stack Developer")
   - Bio/About you

3. **Professional Information**
   - Hourly rate (USD)
   - Years of experience

4. **Skills**
   - Add/remove skills dynamically
   - Skills displayed as tags
   - Examples: React, Node.js, UI/UX Design

5. **Social Links & Portfolio**
   - Portfolio website URL
   - LinkedIn profile
   - GitHub profile

### Fields Available:
```javascript
{
  name: string,
  email: string,
  phone: string,
  location: string,
  bio: string,
  title: string,           // Professional title
  hourlyRate: number,      // USD per hour
  yearsOfExperience: number,
  skills: array,           // Array of skill strings
  portfolioUrl: string,
  linkedinUrl: string,
  githubUrl: string
}
```

---

## 🎯 Key Differences

| Feature | Customer | Seller |
|---------|----------|--------|
| Profile Picture | ✅ | ✅ |
| Personal Info | ✅ | ✅ |
| Professional Title | ❌ | ✅ |
| Hourly Rate | ❌ | ✅ |
| Years of Experience | ❌ | ✅ |
| Skills Management | ❌ | ✅ |
| Company Info | ✅ | ❌ |
| Portfolio Link | ❌ | ✅ |
| Social Links | ❌ | ✅ |

---

## 🚀 How to Access

### As a Customer:
1. Login as a client
2. Click **"الملف الشخصي"** (Profile) in the sidebar
3. Or navigate to: `http://localhost:3000/client/profile`

### As a Seller:
1. Login as a freelancer
2. Click **"الملف الشخصي"** (Profile) in the sidebar
3. Or navigate to: `http://localhost:3000/freelancer/profile`

---

## 💾 How to Save Changes

1. Edit any field in the profile form
2. Click **"حفظ التغييرات"** (Save Changes) button at the bottom
3. Success message will appear: "تم تحديث الملف الشخصي بنجاح!"

---

## 🎨 Seller Profile - Skills Management

### Adding Skills:
1. Type skill name in the input field
2. Press **Enter** or click **"إضافة"** button
3. Skill appears as a tag

### Removing Skills:
1. Click the **×** icon on any skill tag
2. Skill is removed immediately

### Example Skills:
- Programming: JavaScript, Python, React, Node.js
- Design: Photoshop, Illustrator, Figma, UI/UX
- Marketing: SEO, Social Media, Content Writing

---

## 🔐 Security Features

✅ **Role-based access control**: 
- Customers can only access `/client/profile`
- Sellers can only access `/freelancer/profile`
- Accessing wrong profile URL redirects to correct page

✅ **Authentication required**:
- Must be logged in to access profile
- Redirects to login if not authenticated

---

## 📱 Responsive Design

Both profile pages are fully responsive:
- ✅ Desktop view: Side-by-side fields
- ✅ Tablet view: Optimized layout
- ✅ Mobile view: Stacked fields

---

## 🔄 Integration with AuthContext

Profile pages use the authentication context:

```javascript
const { user, isClient, isFreelancer, loading } = useAuth();
```

- **user**: Current user data
- **isClient**: Boolean - Is user a customer?
- **isFreelancer**: Boolean - Is user a seller?
- **loading**: Boolean - Is auth still loading?

---

## 🎯 Future Enhancements

### Planned Features:
1. **Profile Completion Percentage**
   - Show % of profile completed
   - Guide users to fill missing fields

2. **Profile Visibility Settings**
   - Public/Private profile toggle
   - Control what clients/sellers can see

3. **Profile Preview**
   - See how profile appears to others
   - Preview public profile page

4. **Certifications & Education**
   - Add certificates
   - List education background

5. **Languages Proficiency**
   - Add multiple languages
   - Set proficiency level (Beginner, Intermediate, Expert)

6. **Profile Verification**
   - Email verification
   - Phone verification
   - ID verification for sellers

7. **Portfolio Integration**
   - Upload work samples
   - Link to completed projects
   - Display best work

---

## 🐛 Troubleshooting

### Issue: 404 Error on Profile Page
**Solution**: Make sure you're accessing the correct URL for your role:
- Customer: `/client/profile` ✅
- Seller: `/freelancer/profile` ✅

### Issue: Can't Save Changes
**Solution**: 
1. Check browser console for errors
2. Verify all required fields are filled
3. Make sure you're logged in

### Issue: Profile Picture Not Uploading
**Current Status**: Image upload not yet connected to backend
**Workaround**: Profile displays first letter of your name as avatar

---

## 📝 Code Example

### Accessing Profile Page:

```jsx
// In any component
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { isClient, isFreelancer } = useAuth();
  
  const profileUrl = isClient 
    ? '/client/profile' 
    : isFreelancer 
      ? '/freelancer/profile' 
      : '/';
  
  return (
    <Link href={profileUrl}>
      Go to Profile
    </Link>
  );
}
```

---

**Last Updated**: December 2024
**Version**: 1.0

