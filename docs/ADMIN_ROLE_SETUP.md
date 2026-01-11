# 👨‍💼 Admin Role Setup Guide

## 📋 Overview

This guide explains how to set up and use the Admin role in your Mahara project. The admin role allows full access to manage users, projects, transactions, categories, and view analytics.

---

## ✅ What's Already Set Up

### **Backend:**
- ✅ `role` field in `users` table (supports: 'client', 'freelancer', 'admin')
- ✅ `RoleMiddleware` for protecting routes
- ✅ User model supports admin role

### **Frontend:**
- ✅ Admin pages in `pages/admin/`
- ✅ `AuthContext` with `isAdmin` check
- ✅ `DashboardLayout` with `requiredRole` protection
- ✅ Admin sidebar menu
- ✅ Admin service (`services/adminService.js`)

---

## 🔧 How to Add Admin Routes in Backend

### **Step 1: Add Admin Routes to `routes/api.php`**

Add this section to your `Back-end/routes/api.php` file:

```php
// --- Admin Routes (Admin Only) ---
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Users Management
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::get('/users/{id}', [AdminController::class, 'getUser']);
    Route::put('/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
    
    // Projects Management
    Route::get('/projects', [AdminController::class, 'getProjects']);
    Route::get('/projects/{id}', [AdminController::class, 'getProject']);
    Route::delete('/projects/{id}', [AdminController::class, 'deleteProject']);
    
    // Categories Management
    Route::get('/categories', [AdminController::class, 'getCategories']);
    Route::post('/categories', [AdminController::class, 'createCategory']);
    Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
    Route::delete('/categories/{id}', [AdminController::class, 'deleteCategory']);
    
    // Transactions Management
    Route::get('/transactions', [AdminController::class, 'getTransactions']);
    Route::get('/transactions/{id}', [AdminController::class, 'getTransaction']);
    Route::get('/transactions/export', [AdminController::class, 'exportTransactions']);
    
    // Revenue & Statistics
    Route::get('/revenue', [AdminController::class, 'getRevenue']);
    Route::get('/statistics', [AdminController::class, 'getStatistics']);
    Route::get('/dashboard', [AdminController::class, 'getDashboardData']);
    
    // Reports
    Route::get('/reports/{type}', [AdminController::class, 'getReports']);
    Route::get('/reports/{type}/export', [AdminController::class, 'exportReport']);
});
```

### **Step 2: Create AdminController**

Create `Back-end/app/Http/Controllers/Api/AdminController.php`:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Project;
use App\Models\Category;
use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get all users
     */
    public function getUsers(Request $request)
    {
        $query = User::with(['wallet', 'projectsAsClient', 'freelancerProfile']);
        
        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }
        
        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        $users = $query->paginate(15);
        
        return response()->json([
            'data' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'total' => $users->total(),
                'per_page' => $users->perPage(),
            ]
        ]);
    }
    
    /**
     * Get single user
     */
    public function getUser($id)
    {
        $user = User::with(['wallet', 'projectsAsClient', 'freelancerProfile'])->findOrFail($id);
        return response()->json(['data' => $user]);
    }
    
    /**
     * Update user
     */
    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:191',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|in:client,freelancer,admin',
        ]);
        
        $user->update($validated);
        
        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user
        ]);
    }
    
    /**
     * Delete user
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        
        return response()->json(['message' => 'User deleted successfully']);
    }
    
    /**
     * Get all projects
     */
    public function getProjects(Request $request)
    {
        $query = Project::with(['client', 'acceptedOffer.freelancer']);
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $projects = $query->paginate(15);
        
        return response()->json([
            'data' => $projects->items(),
            'pagination' => [
                'current_page' => $projects->currentPage(),
                'total' => $projects->total(),
            ]
        ]);
    }
    
    /**
     * Get single project
     */
    public function getProject($id)
    {
        $project = Project::with(['client', 'offers.freelancer'])->findOrFail($id);
        return response()->json(['data' => $project]);
    }
    
    /**
     * Delete project
     */
    public function deleteProject($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        
        return response()->json(['message' => 'Project deleted successfully']);
    }
    
    /**
     * Get all categories
     */
    public function getCategories()
    {
        $categories = Category::all();
        return response()->json(['data' => $categories]);
    }
    
    /**
     * Create category
     */
    public function createCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:191',
            'slug' => 'required|string|unique:categories',
            'description' => 'nullable|string',
        ]);
        
        $category = Category::create($validated);
        
        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }
    
    /**
     * Update category
     */
    public function updateCategory(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:191',
            'slug' => 'sometimes|string|unique:categories,slug,' . $id,
            'description' => 'nullable|string',
        ]);
        
        $category->update($validated);
        
        return response()->json([
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    }
    
    /**
     * Delete category
     */
    public function deleteCategory($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        
        return response()->json(['message' => 'Category deleted successfully']);
    }
    
    /**
     * Get all transactions
     */
    public function getTransactions(Request $request)
    {
        $query = Transaction::with('user');
        
        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        $transactions = $query->orderBy('created_at', 'desc')->paginate(15);
        
        return response()->json([
            'data' => $transactions->items(),
            'pagination' => [
                'current_page' => $transactions->currentPage(),
                'total' => $transactions->total(),
            ]
        ]);
    }
    
    /**
     * Get revenue statistics
     */
    public function getRevenue(Request $request)
    {
        $period = $request->get('period', 'month'); // month, week, year
        
        $revenue = DB::table('transactions')
            ->where('type', 'commission')
            ->where('status', 'completed')
            ->selectRaw('SUM(amount) as total, DATE(created_at) as date')
            ->groupBy('date')
            ->get();
        
        return response()->json(['data' => $revenue]);
    }
    
    /**
     * Get dashboard statistics
     */
    public function getDashboardData()
    {
        $stats = [
            'total_users' => User::count(),
            'total_clients' => User::where('role', 'client')->count(),
            'total_freelancers' => User::where('role', 'freelancer')->count(),
            'total_projects' => Project::count(),
            'active_projects' => Project::where('status', 'in_progress')->count(),
            'completed_projects' => Project::where('status', 'completed')->count(),
            'total_revenue' => Transaction::where('type', 'commission')
                ->where('status', 'completed')
                ->sum('amount'),
        ];
        
        return response()->json(['data' => $stats]);
    }
    
    /**
     * Get statistics
     */
    public function getStatistics()
    {
        // Add your statistics logic here
        return response()->json(['data' => []]);
    }
    
    /**
     * Get reports
     */
    public function getReports($type, Request $request)
    {
        // Add your reports logic here
        return response()->json(['data' => []]);
    }
    
    /**
     * Export transactions
     */
    public function exportTransactions(Request $request)
    {
        // Add export logic here
        return response()->json(['message' => 'Export functionality coming soon']);
    }
    
    /**
     * Export report
     */
    public function exportReport($type, Request $request)
    {
        // Add export logic here
        return response()->json(['message' => 'Export functionality coming soon']);
    }
}
```

---

## 👤 How to Create an Admin User

### **Method 1: Update Existing User in Database**

```sql
-- Using MySQL/phpMyAdmin
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### **Method 2: Using Laravel Tinker**

```bash
cd Back-end
php artisan tinker
```

Then in tinker:
```php
$user = User::where('email', 'your-email@example.com')->first();
$user->role = 'admin';
$user->save();
```

### **Method 3: Create Admin User via Seeder**

Create `Back-end/database/seeders/AdminSeeder.php`:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@mahara.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );
        
        // Create wallet for admin
        if (!$admin->wallet) {
            Wallet::create(['user_id' => $admin->id]);
        }
        
        $this->command->info('Admin user created: admin@mahara.com / admin123');
    }
}
```

Run seeder:
```bash
php artisan db:seed --class=AdminSeeder
```

### **Method 4: Allow Admin Registration (Not Recommended for Production)**

Modify `AuthController.php` to allow admin registration (only for development):

```php
// In register method, add this validation
'role' => 'required|in:client,freelancer,admin', // Allow admin registration
```

---

## 🔒 How Admin Protection Works

### **Backend Protection:**

```php
// Routes protected with role middleware
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Only admin can access these routes
});
```

### **Frontend Protection:**

```jsx
// In admin pages
<DashboardLayout requiredRole="admin">
  {/* Only admin can see this content */}
</DashboardLayout>
```

**What happens:**
- ✅ If user is admin → Page loads normally
- ❌ If user is not admin → Redirected to `/403` (Forbidden)
- ❌ If user is not authenticated → Redirected to `/login`

---

## 📁 Admin Pages Structure

```
pages/admin/
├── dashboard.js      - Main admin dashboard
├── users.js          - User management
├── projects.js       - Project management
├── transactions.js   - Transaction tracking
├── categories.js     - Category management
├── reports.js        - Reports & analytics
└── revenue.js        - Revenue dashboard
```

---

## 🎯 Admin Responsibilities

Based on your backend setup, Admin can:

1. **User Management:**
   - View all users
   - Update user information
   - Delete users
   - Change user roles

2. **Project Management:**
   - View all projects
   - Monitor project status
   - Delete projects if needed

3. **Category Management:**
   - Create new categories
   - Update categories
   - Delete categories

4. **Transaction Management:**
   - View all transactions
   - Track revenue
   - Export transaction data

5. **Analytics & Reports:**
   - View platform statistics
   - Generate reports
   - Monitor revenue

---

## ✅ Checklist

- [ ] Add admin routes to `routes/api.php`
- [ ] Create `AdminController.php`
- [ ] Create admin user (using one of the methods above)
- [ ] Test admin login
- [ ] Verify admin can access `/admin/dashboard`
- [ ] Test that non-admin users cannot access admin pages

---

## 🧪 Testing Admin Access

1. **Login as Admin:**
   - Use admin credentials
   - Should redirect to `/admin/dashboard`

2. **Test Protection:**
   - Try accessing `/admin/dashboard` as non-admin
   - Should redirect to `/403`

3. **Test API:**
   ```bash
   # Get admin token first, then:
   curl -H "Authorization: Bearer {token}" http://127.0.0.1:8000/api/admin/users
   ```

---

**Last Updated:** December 2024

