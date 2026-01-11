# 🔐 Laravel Sanctum Authentication Guide

## ✅ **نظام المصادقة المستخدم: Laravel Sanctum**

مشروعك يستخدم **Laravel Sanctum** للمصادقة، وهو نظام مصادقة مدمج في Laravel ومصمم خصيصاً لـ SPAs (Single Page Applications).

---

## 🔑 **كيف يعمل Sanctum**

### **1. Token-Based Authentication**

Sanctum يستخدم **Simple Token Authentication** (ليست JWT):
- Token يتم إنشاؤه عند تسجيل الدخول أو التسجيل
- Token يُخزن في قاعدة البيانات (`personal_access_tokens` table)
- Token يُرسل في Header: `Authorization: Bearer {token}`

### **2. Token Creation**

```php
// في Backend (AuthController.php)
$token = $user->createToken('auth_token')->plainTextToken;
```

### **3. Token Usage**

```javascript
// في Frontend (services/api.js)
config.headers.Authorization = `Bearer ${token}`;
```

---

## 📋 **الإعدادات الحالية**

### **Backend Configuration:**

✅ **Sanctum Installed:** `laravel/sanctum: ^4.0`  
✅ **Middleware:** `auth:sanctum`  
✅ **Stateful Domains:** `localhost, localhost:3000, 127.0.0.1`  
✅ **Token Storage:** Database (`personal_access_tokens` table)

### **Frontend Configuration:**

✅ **API Base URL:** `http://127.0.0.1:8000/api`  
✅ **Token Storage:** `localStorage`  
✅ **Auto Token Injection:** في `api.js` interceptor

---

## 🔄 **Authentication Flow**

### **1. Registration:**
```
User fills form → POST /api/register
→ Backend creates user + wallet + profile
→ Backend creates token
→ Returns: { user, access_token }
→ Frontend saves token to localStorage
```

### **2. Login:**
```
User enters credentials → POST /api/login
→ Backend validates credentials
→ Backend creates token
→ Returns: { user, access_token }
→ Frontend saves token to localStorage
```

### **3. Authenticated Requests:**
```
Frontend makes request → api.js interceptor
→ Reads token from localStorage
→ Adds: Authorization: Bearer {token}
→ Backend validates token
→ Returns data
```

### **4. Logout:**
```
User clicks logout → POST /api/logout
→ Backend deletes token from database
→ Frontend removes token from localStorage
```

---

## 🛡️ **Security Features**

### **1. Token Expiration:**
- Default: No expiration (can be configured)
- Configurable in `config/sanctum.php`

### **2. Token Revocation:**
- Tokens can be revoked individually
- All tokens deleted on logout

### **3. CSRF Protection:**
- Sanctum handles CSRF for stateful requests
- Token-based requests don't need CSRF

### **4. Rate Limiting:**
- Built-in throttling for API routes
- Configurable in `routes/api.php`

---

## 📝 **Token Management**

### **Create Token:**
```php
$token = $user->createToken('token-name')->plainTextToken;
```

### **Revoke Token:**
```php
$user->currentAccessToken()->delete(); // Current token
$user->tokens()->delete(); // All tokens
```

### **Check Token:**
```php
// Automatic via middleware
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
```

---

## 🔧 **Configuration Files**

### **Backend:**
- `config/sanctum.php` - Sanctum configuration
- `routes/api.php` - API routes with `auth:sanctum` middleware
- `app/Http/Controllers/Api/AuthController.php` - Auth logic

### **Frontend:**
- `services/api.js` - Axios instance with token interceptor
- `contexts/AuthContext.js` - Auth state management
- `services/authService.js` - Auth API calls

---

## ✅ **Advantages of Sanctum**

1. **Simple Setup:** No complex JWT configuration
2. **Database Tracking:** All tokens stored and trackable
3. **Easy Revocation:** Can revoke tokens instantly
4. **Laravel Native:** Built-in, no external packages
5. **SPA Optimized:** Designed for Single Page Applications
6. **Stateful Support:** Can use cookies for same-domain requests

---

## 🚀 **Best Practices**

### **1. Token Storage:**
- ✅ Store in `localStorage` (current implementation)
- ✅ Never expose tokens in URLs
- ✅ Clear tokens on logout

### **2. Token Security:**
- ✅ Use HTTPS in production
- ✅ Set token expiration if needed
- ✅ Revoke tokens on logout

### **3. Error Handling:**
- ✅ Handle 401 (Unauthorized) - redirect to login
- ✅ Handle token expiration
- ✅ Handle network errors

---

## 📊 **Current Implementation Status**

✅ **Backend:**
- Sanctum installed and configured
- Auth routes working
- Token creation working
- Token validation working

✅ **Frontend:**
- Token storage in localStorage
- Auto token injection in requests
- Error handling for 401
- Auto redirect on unauthorized

---

## 🔍 **Troubleshooting**

### **Token Not Working?**
1. Check if token is saved in localStorage
2. Check if token is sent in Authorization header
3. Check backend logs for errors
4. Verify `auth:sanctum` middleware is applied

### **401 Unauthorized?**
1. Token might be expired (if expiration set)
2. Token might be revoked
3. Token format might be wrong
4. Check CORS settings

### **CORS Issues?**
1. Verify `SANCTUM_STATEFUL_DOMAINS` includes frontend URL
2. Check `config/cors.php` settings
3. Ensure frontend URL matches configured domains

---

## 📚 **Resources**

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Sanctum GitHub](https://github.com/laravel/sanctum)

---

**Status:** ✅ **Fully Configured and Working**

**Last Updated:** December 2024

