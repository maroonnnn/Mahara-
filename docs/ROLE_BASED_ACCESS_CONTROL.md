# Role-Based Access Control (RBAC)

## Overview
The platform now has strict role-based access control to ensure users can only access pages and features appropriate to their account type.

---

## 🎭 User Roles

### 1. **Customer (Client)** 👤
- **Can Do:**
  - ✅ Create new service requests (projects)
  - ✅ View their projects
  - ✅ Review offers from sellers
  - ✅ Accept/reject offers
  - ✅ Message sellers
  - ✅ Manage wallet and payments

- **Cannot Do:**
  - ❌ Browse seller project marketplace
  - ❌ Submit offers to projects
  - ❌ Access freelancer dashboard

### 2. **Seller (Freelancer)** 🛠️
- **Can Do:**
  - ✅ Browse available projects
  - ✅ View project details
  - ✅ Submit offers to projects
  - ✅ Message clients
  - ✅ Manage active projects
  - ✅ Withdraw earnings

- **Cannot Do:**
  - ❌ Create new projects
  - ❌ Access client project management
  - ❌ View client's offer review page

### 3. **Admin** 👨‍💼
- Full access to all areas

---

## 🔒 Protected Routes

### Client-Only Routes (Customer Only)
```
/client/projects/new          → Create new project
/client/projects              → My projects list
/client/projects/[id]         → View project & offers
/client/dashboard             → Client dashboard
/client/wallet                → Wallet management
/client/profile               → Client profile
```

**What happens if seller tries to access:**
- Blocked with alert message
- Redirected to `/freelancer/projects`

### Freelancer-Only Routes (Seller Only)
```
/freelancer/projects          → Browse available projects
/freelancer/projects/[id]     → View project & submit offer
/freelancer/dashboard         → Freelancer dashboard
/freelancer/active-projects   → Active projects
/freelancer/portfolio         → Portfolio management
```

**What happens if client tries to access:**
- Blocked with alert message
- Redirected to `/client/projects`

---

## 🚦 How It Works

### Example 1: Seller Tries to Create Project

```javascript
// User is logged in as "Freelancer"
// Tries to access: /client/projects/new

→ System checks: isFreelancer = true
→ Alert: "❌ عذراً! لا يمكن للمستقلين إنشاء مشاريع"
→ Redirect: /freelancer/projects
```

### Example 2: Customer Tries to Submit Offer

```javascript
// User is logged in as "Client"
// Tries to access: /freelancer/projects/123

→ System checks: isClient = true
→ Alert: "❌ هذه الصفحة للمستقلين فقط"
→ Redirect: /client/projects
```

### Example 3: Not Logged In

```javascript
// User not authenticated
// Tries to access: /client/projects/new

→ System checks: isAuthenticated = false
→ Alert: "يجب تسجيل الدخول أولاً"
→ Redirect: /login
```

---

## 🔐 Implementation Details

### Using Auth Context

```javascript
import { useAuth } from '../../../contexts/AuthContext';

const { user, isClient, isFreelancer, isAuthenticated } = useAuth();

useEffect(() => {
  // Check authentication
  if (!isAuthenticated) {
    alert('يجب تسجيل الدخول أولاً');
    router.push('/login');
    return;
  }

  // Check role
  if (isFreelancer) {
    alert('هذه الصفحة للعملاء فقط');
    router.push('/freelancer/projects');
    return;
  }

  if (!isClient) {
    alert('غير مصرح لك بالوصول');
    router.push('/');
    return;
  }

  // User has access, load content
  loadContent();
}, [isAuthenticated, isClient, isFreelancer]);
```

---

## 📋 Access Matrix

| Feature | Customer | Seller | Admin |
|---------|----------|--------|-------|
| Create Projects | ✅ | ❌ | ✅ |
| Browse Projects | ❌ | ✅ | ✅ |
| Submit Offers | ❌ | ✅ | ✅ |
| Review Offers | ✅ | ❌ | ✅ |
| Accept Offers | ✅ | ❌ | ✅ |
| Message System | ✅ | ✅ | ✅ |
| Wallet Management | ✅ | ✅ | ✅ |
| Portfolio | ❌ | ✅ | ✅ |

---

## 🎯 User Journey Examples

### Customer Journey
```
Login as Client
    ↓
Dashboard (/client/dashboard)
    ↓
Create Project (/client/projects/new) ✅ ALLOWED
    ↓
View My Projects (/client/projects) ✅ ALLOWED
    ↓
Review Offers (/client/projects/[id]) ✅ ALLOWED
    ↓
Accept Best Offer ✅ ALLOWED
```

### Seller Journey
```
Login as Freelancer
    ↓
Dashboard (/freelancer/dashboard)
    ↓
Browse Projects (/freelancer/projects) ✅ ALLOWED
    ↓
View Project Details (/freelancer/projects/[id]) ✅ ALLOWED
    ↓
Submit Offer ✅ ALLOWED
    ↓
Try to Create Project (/client/projects/new) ❌ BLOCKED
    ↓
"Cannot create projects as seller" → Redirect
```

---

## 💡 Benefits

1. **Security**: Users can only access their designated features
2. **Clear Separation**: Customers and sellers have distinct workflows
3. **Better UX**: No confusion about available actions
4. **Data Protection**: Users can't access others' sensitive data
5. **Workflow Integrity**: Maintains proper business logic

---

## 🔄 Role Management

Each user has a fixed role assigned during registration:
- **Clients** can only create projects and manage offers
- **Freelancers** can only browse projects and submit offers
- **Admins** have full system access

**Note:** To use a different role, you need to register a new account with that role type.

---

## 🆘 Troubleshooting

### "Access Denied" Error?
- Check you're logged in with correct account type
- Verify your role in account settings
- Try logging out and back in

### Wrong Dashboard Loading?
- Clear browser cache
- Check localStorage for stale data
- Contact support if issue persists

---

## 🔧 For Developers

### Adding New Protected Route

```javascript
// In your new page component
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function MyProtectedPage() {
  const { isClient, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!isClient) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, isClient]);

  return (
    // Your protected content
  );
}
```

---

**Last Updated**: December 2024
**Version**: 1.0

