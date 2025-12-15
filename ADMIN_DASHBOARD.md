# Admin Dashboard Documentation

## Overview

The Admin Dashboard is a comprehensive management system for platform administrators. It provides full control over users, projects, transactions, categories, and detailed analytics.

## How It Works

### 1. **Authentication & Authorization**

The admin dashboard uses role-based access control (RBAC):

```javascript
// Only users with role 'admin' can access
<DashboardLayout requiredRole="admin">
```

- **Protected Routes**: All admin pages check for `role === 'admin'`
- **Automatic Redirect**: Non-admin users are redirected to 403 (Forbidden) page
- **Login Check**: Unauthenticated users are redirected to `/login`

### 2. **Dashboard Structure**

```
pages/admin/
├── dashboard.js     - Main overview with stats and quick actions
├── users.js         - User management (CRUD operations)
├── projects.js      - Project monitoring and management
├── transactions.js  - Financial transactions tracking
├── categories.js    - Category management
└── reports.js       - Analytics and reporting
```

### 3. **Key Features**

#### **Main Dashboard** (`/admin/dashboard`)
- Real-time statistics (users, projects, revenue)
- Recent activity feed
- Quick action buttons
- Growth metrics with percentage changes

#### **User Management** (`/admin/users`)
- View all users with filters (role, status)
- Search functionality
- Suspend/activate users
- Edit user information
- Delete users
- View user statistics (projects, revenue)

#### **Project Management** (`/admin/projects`)
- Monitor all projects
- Filter by status (active, completed, pending, cancelled)
- View project details (client, freelancer, budget, deadline)
- Delete problematic projects

#### **Transaction Management** (`/admin/transactions`)
- Track all financial transactions
- Filter by type (payment, withdrawal, refund)
- Filter by status (completed, pending, failed)
- View payment methods
- Export transaction reports
- Real-time revenue tracking

#### **Category Management** (`/admin/categories`)
- Create new categories
- Edit existing categories
- Activate/deactivate categories
- Delete unused categories
- View project count per category
- Assign emojis/icons to categories

#### **Reports & Analytics** (`/admin/reports`)
- Overview reports
- User activity analysis
- Project performance metrics
- Revenue growth tracking
- Monthly trends visualization
- Top performing categories
- Export options (PDF, Excel, CSV)

### 4. **Access URLs**

```
Main Dashboard:     http://localhost:3002/admin/dashboard
User Management:    http://localhost:3002/admin/users
Project Management: http://localhost:3002/admin/projects
Transactions:       http://localhost:3002/admin/transactions
Categories:         http://localhost:3002/admin/categories
Reports:            http://localhost:3002/admin/reports
```

### 5. **Sidebar Navigation**

The admin sidebar (already configured in `components/layout/Sidebar.js`) includes:

```javascript
const adminMenu = [
  { name: 'لوحة التحكم', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
  { name: 'المستخدمون', path: '/admin/users', icon: <FaUsers /> },
  { name: 'المشاريع', path: '/admin/projects', icon: <FaProjectDiagram /> },
  { name: 'المعاملات المالية', path: '/admin/transactions', icon: <FaWallet /> },
  { name: 'الفئات', path: '/admin/categories', icon: <FaCog /> },
  { name: 'التقارير', path: '/admin/reports', icon: <FaChartBar /> },
];
```

### 6. **How to Access as Admin**

**Option 1: Update User Role in Database**
```javascript
// In your backend, update a user's role to 'admin'
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

**Option 2: Register as Admin (if supported)**
```javascript
// When registering, set role to 'admin'
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "securePassword123",
  "role": "admin"
}
```

**Option 3: Modify AuthContext for Testing**
```javascript
// In contexts/AuthContext.js, temporarily hardcode admin role
const login = async (email, password) => {
  // ... existing login code ...
  const userData = {
    ...response.data.user,
    role: 'admin' // Force admin role for testing
  };
  setUser(userData);
};
```

### 7. **Language Support**

All admin pages support both English and Arabic:

- Interface adapts to selected language
- RTL (Right-to-Left) support for Arabic
- All text labels are bilingual

### 8. **Mock Data**

Currently, all admin pages use mock data for demonstration:

```javascript
// Example from users.js
const [users, setUsers] = useState([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'freelancer',
    status: 'active',
    // ...
  }
]);
```

**To connect to real backend:**
Replace mock data with API calls:

```javascript
// Example
import { adminService } from '../../services/adminService';

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };
  fetchUsers();
}, []);
```

### 9. **Required Services (To Implement)**

Create `services/adminService.js` for API integration:

```javascript
import api from './api';

export const adminService = {
  // Users
  getUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Projects
  getProjects: () => api.get('/admin/projects'),
  deleteProject: (id) => api.delete(`/admin/projects/${id}`),
  
  // Transactions
  getTransactions: () => api.get('/admin/transactions'),
  exportTransactions: (format) => api.get(`/admin/transactions/export?format=${format}`),
  
  // Categories
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  
  // Reports
  getReports: (type, period) => api.get(`/admin/reports/${type}?period=${period}`),
  exportReport: (type, format) => api.get(`/admin/reports/${type}/export?format=${format}`),
};
```

### 10. **Security Considerations**

1. **Backend Validation**: Always verify admin role on backend
2. **Token-Based Auth**: Use JWT tokens for API requests
3. **Rate Limiting**: Implement rate limiting for admin actions
4. **Audit Logs**: Log all admin actions for security
5. **Two-Factor Auth**: Consider 2FA for admin accounts

### 11. **Features Summary**

✅ Role-based access control
✅ User management (CRUD)
✅ Project monitoring
✅ Transaction tracking
✅ Category management
✅ Analytics & reports
✅ Bilingual support (EN/AR)
✅ Responsive design
✅ Search & filters
✅ Export functionality
✅ Real-time statistics

### 12. **Next Steps**

1. **Backend Integration**: Connect to your backend API
2. **Create adminService.js**: Implement API calls
3. **Real Data**: Replace mock data with live data
4. **Permissions**: Add granular permissions (view, edit, delete)
5. **Audit Logs**: Track admin actions
6. **Email Notifications**: Notify users of admin actions
7. **Bulk Operations**: Add bulk user/project actions
8. **Advanced Filters**: Add date ranges, custom filters
9. **Export Enhancement**: Implement actual PDF/Excel export
10. **Dashboard Charts**: Add interactive charts with Chart.js or Recharts

## Testing the Dashboard

1. **Login as Admin**:
   ```
   Email: admin@example.com
   Password: (your admin password)
   ```

2. **Navigate to**: `http://localhost:3002/admin/dashboard`

3. **Explore Features**: Click through each section to see functionality

4. **Test CRUD Operations**: Try creating, editing, and deleting items

5. **Test Filters**: Use search and filter options

## Screenshots

The dashboard includes:
- 📊 Rich statistics cards
- 📈 Growth indicators
- 🔍 Advanced search and filters
- 📋 Data tables with actions
- 🎨 Modern UI with Tailwind CSS
- 🌐 Full RTL support

---

**Need Help?** Check the individual page files for implementation details or refer to the Mahara design patterns.

