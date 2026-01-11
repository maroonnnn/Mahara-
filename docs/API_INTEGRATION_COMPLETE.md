# 🔗 API Integration Complete - Frontend ↔ Backend

## ✅ **تم ربط Frontend بـ Backend بنجاح!**

تم تحديث جميع Services وربطها بالكامل مع Laravel Backend API.

---

## 📋 **ما تم إنجازه**

### 1. ✅ **Authentication Service**
- **الملف:** `services/authService.js`
- **التغييرات:**
  - تم تعطيل Mock Authentication (`USE_MOCK_AUTH = false`)
  - الآن يستخدم Laravel API الحقيقي
  - يدعم Laravel Sanctum authentication
  - معالجة كاملة لأخطاء Laravel validation

### 2. ✅ **Admin Service (جديد)**
- **الملف:** `services/adminService.js`
- **الميزات:**
  - إدارة المستخدمين (CRUD)
  - إدارة المشاريع
  - إدارة التصنيفات
  - إدارة المعاملات المالية
  - التقارير والإحصائيات
  - Revenue Dashboard
  - Export functionality

### 3. ✅ **API Configuration**
- **الملف:** `services/api.js`
- **التحسينات:**
  - معالجة أفضل للأخطاء
  - دعم Laravel validation errors (422)
  - معالجة CSRF token mismatch (419)
  - Network error handling
  - Auto-redirect عند 401 Unauthorized
  - Timeout configuration (30 seconds)
  - SSR-safe (يتحقق من `window` قبل استخدام localStorage)

### 4. ✅ **Project Service**
- **الملف:** `services/projectService.js`
- **التحديثات:**
  - `getOpenProjects()` - للمشاريع المفتوحة
  - `getActiveProjects()` - لمشاريع المستقل النشطة
  - جميع endpoints محدثة

### 5. ✅ **Offer Service**
- **الملف:** `services/offerService.js`
- **التحديثات:**
  - `submitOffer(projectId, data)` - دعم project_id في route
  - `getMyOffers()` - استخدام `/freelancer/offers`
  - جميع endpoints محدثة

### 6. ✅ **Wallet Service**
- **الملف:** `services/walletService.js`
- **التحديثات:**
  - `getBalance()` - endpoint جديد للحصول على الرصيد فقط
  - جميع endpoints محدثة

### 7. ✅ **Message Service**
- **الملف:** `services/messageService.js`
- **التحديثات:**
  - `sendMessage(projectId, data)` - دعم project_id في route
  - جميع endpoints محدثة

### 8. ✅ **Seller/Freelancer Service**
- **الملف:** `services/sellerService.js`
- **التحديثات:**
  - دعم endpoints بديلة للتوافق
  - `/freelancer/onboarding` و `/sellers/onboarding`
  - `/freelancer/profile` و `/sellers/profile`

### 9. ✅ **Portfolio Service**
- **الملف:** `services/portfolioService.js`
- **التحديثات:**
  - دعم endpoints بديلة
  - معالجة أخطاء محسنة
  - Fallback للـ endpoints البديلة

---

## 🚀 **كيفية الاستخدام**

### 1. **إنشاء ملف `.env.local`**

في مجلد `Front-end`، أنشئ ملف `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

**ملاحظة:** إذا كان الملف محظوراً، يمكنك إنشاؤه يدوياً.

### 2. **تشغيل Backend**

```bash
cd C:\Users\USER\Desktop\Back-end
php artisan serve
```

يجب أن يعمل على: `http://127.0.0.1:8000`

### 3. **تشغيل Frontend**

```bash
cd C:\Users\USER\Desktop\Front-end
npm run dev
```

يجب أن يعمل على: `http://localhost:3000`

---

## 📡 **API Endpoints Structure**

### **Authentication:**
```
POST   /api/register
POST   /api/login
POST   /api/logout
GET    /api/user
```

### **Projects:**
```
GET    /api/projects/open          # المشاريع المفتوحة
GET    /api/projects               # جميع المشاريع
POST   /api/projects               # إنشاء مشروع
GET    /api/projects/{id}          # تفاصيل مشروع
PUT    /api/projects/{id}          # تحديث مشروع
DELETE /api/projects/{id}          # حذف مشروع
GET    /api/my-projects            # مشاريع العميل
GET    /api/freelancer/active-projects  # مشاريع المستقل النشطة
```

### **Offers:**
```
GET    /api/projects/{id}/offers   # عروض المشروع
POST   /api/projects/{id}/offers   # تقديم عرض
GET    /api/freelancer/offers      # عروض المستقل
PUT    /api/offers/{id}/accept     # قبول عرض
PUT    /api/offers/{id}/reject     # رفض عرض
PUT    /api/offers/{id}            # تحديث عرض
DELETE /api/offers/{id}            # حذف عرض
```

### **Wallet:**
```
GET    /api/wallet                 # معلومات المحفظة
GET    /api/wallet/balance         # الرصيد فقط
POST   /api/wallet/deposit         # إيداع
POST   /api/wallet/withdraw        # سحب
GET    /api/wallet/transactions    # سجل المعاملات
GET    /api/wallet/transactions/{id}  # تفاصيل معاملة
```

### **Messages:**
```
GET    /api/messages/conversations        # المحادثات
GET    /api/projects/{id}/messages        # رسائل المشروع
POST   /api/projects/{id}/messages        # إرسال رسالة
GET    /api/messages/conversations/{id}   # رسائل محادثة
PUT    /api/messages/{id}/read           # قراءة رسالة
PUT    /api/projects/{id}/messages/read-all  # قراءة الكل
GET    /api/messages/unread-count        # عدد الرسائل غير المقروءة
```

### **Freelancer/Seller:**
```
GET    /api/freelancer/profile            # الملف الشخصي
PUT    /api/freelancer/profile            # تحديث الملف
POST   /api/freelancer/onboarding        # إكمال التسجيل
GET    /api/freelancer/portfolio         # معرض الأعمال
POST   /api/freelancer/portfolio        # إضافة عمل
GET    /api/freelancer/{username}/profile  # ملف بائع
```

### **Admin:**
```
GET    /api/admin/users                  # المستخدمين
GET    /api/admin/users/{id}             # مستخدم
PUT    /api/admin/users/{id}              # تحديث مستخدم
DELETE /api/admin/users/{id}              # حذف مستخدم
GET    /api/admin/projects                # المشاريع
GET    /api/admin/categories              # التصنيفات
POST   /api/admin/categories              # إنشاء تصنيف
PUT    /api/admin/categories/{id}         # تحديث تصنيف
DELETE /api/admin/categories/{id}         # حذف تصنيف
GET    /api/admin/transactions            # المعاملات
GET    /api/admin/revenue                 # الإيرادات
GET    /api/admin/statistics              # الإحصائيات
GET    /api/admin/dashboard               # لوحة التحكم
```

---

## 🔐 **Authentication Flow**

### **1. Register:**
```javascript
import authService from '../services/authService';

const result = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'client' // or 'freelancer'
});
```

### **2. Login:**
```javascript
const result = await authService.login({
  email: 'john@example.com',
  password: 'password123'
});

// Token يتم حفظه تلقائياً في localStorage
// User يتم حفظه تلقائياً في localStorage
```

### **3. Using Authenticated Requests:**
```javascript
import api from '../services/api';

// Token يتم إضافته تلقائياً من localStorage
const response = await api.get('/my-projects');
```

---

## ⚠️ **Error Handling**

### **Laravel Validation Errors (422):**
```javascript
try {
  await authService.register(data);
} catch (error) {
  if (error.response?.status === 422) {
    const errors = error.response.data.errors;
    // errors = { email: ['البريد موجود'], password: ['كلمة المرور قصيرة'] }
  }
}
```

### **Network Errors:**
```javascript
try {
  await api.get('/projects');
} catch (error) {
  if (error.response?.status === 0) {
    // Network error - backend not reachable
    console.error('Cannot connect to backend');
  }
}
```

### **401 Unauthorized:**
```javascript
// يتم التعامل معه تلقائياً:
// - حذف token من localStorage
// - حذف user من localStorage
// - إعادة توجيه إلى /login
```

---

## 🧪 **Testing the Connection**

### **1. Test from Browser Console:**

افتح Developer Tools (F12) واكتب:

```javascript
fetch('http://127.0.0.1:8000/api/categories')
  .then(res => res.json())
  .then(data => console.log('✅ API Works!', data))
  .catch(err => console.error('❌ Error:', err));
```

### **2. Test from Frontend:**

```javascript
import categoryService from '../services/categoryService';

try {
  const response = await categoryService.getCategories();
  console.log('✅ Categories:', response.data);
} catch (error) {
  console.error('❌ Error:', error);
}
```

---

## 📝 **Notes**

1. **CORS:** تأكد أن Laravel يسمح بطلبات من `http://localhost:3000`
2. **Token Storage:** يتم حفظ Token في `localStorage` (للمتصفح فقط)
3. **SSR Safe:** API interceptor يتحقق من `window` قبل استخدام localStorage
4. **Timeout:** 30 seconds timeout للطلبات
5. **Error Messages:** جميع رسائل الأخطاء بالعربية

---

## ✅ **Status**

**الحالة:** ✅ **مكتمل وجاهز للاستخدام!**

جميع Services محدثة ومربوطة بالكامل مع Laravel Backend.

---

**آخر تحديث:** ديسمبر 2024  
**المطور:** Auto (Cursor AI)

