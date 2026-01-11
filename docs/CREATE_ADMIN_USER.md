# How to Create an Admin User

There are two ways to create an admin user in the Mahara platform:

## Method 1: Using Artisan Command (Recommended)

This is the easiest and most secure way to create an admin user.

### Step 1: Run the command
```bash
cd Back-end
php artisan admin:create
```

### Step 2: Follow the prompts
The command will ask you for:
- **Name**: Admin's full name (e.g., "Admin User")
- **Email**: Admin's email address (must be unique)
- **Password**: Admin's password (minimum 8 characters, entered securely)

### Alternative: Using command options
You can also provide all information directly:
```bash
php artisan admin:create --name="Admin User" --email="admin@mahara.com" --password="your-secure-password"
```

## Method 2: Using Database Seeder

### Step 1: Run the seeder
```bash
cd Back-end
php artisan db:seed --class=AdminSeeder
```

This will create a default admin user with:
- **Email**: `admin@mahara.com`
- **Password**: `admin123`
- **Name**: `Admin`

⚠️ **Important**: Change the password immediately after first login!

### Step 2: Update DatabaseSeeder (Optional)
If you want the admin to be created automatically when running `php artisan db:seed`, uncomment this line in `Back-end/database/seeders/DatabaseSeeder.php`:

```php
$this->call(AdminSeeder::class);
```

## Method 3: Direct Database Update (Not Recommended)

If you need to convert an existing user to admin:

```bash
cd Back-end
php artisan tinker
```

Then run:
```php
$user = \App\Models\User::where('email', 'user@example.com')->first();
$user->role = 'admin';
$user->save();
```

## Verifying Admin Account

After creating the admin user, you can verify it by:

1. **Check in database**:
```bash
php artisan tinker
\App\Models\User::where('role', 'admin')->get(['id', 'name', 'email', 'role']);
```

2. **Login to the application**:
   - Use the admin email and password
   - The user should have admin role and access

## Admin Features

Once you have an admin account, you can:
- Access admin-only routes (when implemented)
- Manage users, projects, and transactions
- Approve/reject withdrawal requests
- View platform statistics
- Manage categories and settings

## Security Notes

1. **Always use strong passwords** for admin accounts
2. **Change default passwords** immediately after creation
3. **Limit admin account creation** to trusted personnel only
4. **Use the artisan command** instead of direct database manipulation when possible

