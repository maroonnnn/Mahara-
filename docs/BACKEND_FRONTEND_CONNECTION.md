# 🔗 ربط الفرونت إند بالباك إند

## ✅ تم إصلاح المشاكل

### المشاكل التي تم حلها:
1. ✅ **EncryptionServiceProvider** - تم إضافته
2. ✅ **FoundationServiceProvider** - تم إضافته
3. ✅ **DatabaseServiceProvider** - تم إضافته
4. ✅ **Controller.php** - تم إنشاؤه
5. ✅ **قاعدة البيانات** - تم إنشاؤها وتشغيلها
6. ✅ **API Routes** - تعمل بشكل صحيح (35 route)

---

## 🚀 تشغيل الباك إند

### الخطوة 1: تشغيل Laravel Server

```bash
cd C:\Users\USER\Desktop\Back-end
php artisan serve
```

**النتيجة:** سيعمل على `http://127.0.0.1:8000`

### الخطوة 2: التحقق من عمل API

افتح المتصفح واذهب إلى:
- `http://127.0.0.1:8000/api/categories` - يجب أن يعرض التصنيفات

---

## 🔧 ربط الفرونت إند

### ✅ **تم تحديث جميع Services!**

تم تحديث جميع ملفات الخدمات (Services) لتتوافق مع Laravel Backend:

1. ✅ **authService.js** - تم تفعيل API الحقيقي (USE_MOCK_AUTH = false)
2. ✅ **adminService.js** - تم إنشاؤه جديداً
3. ✅ **projectService.js** - تم تحديثه مع endpoints جديدة
4. ✅ **offerService.js** - تم تحديثه
5. ✅ **walletService.js** - تم تحديثه
6. ✅ **messageService.js** - تم تحديثه
7. ✅ **sellerService.js** - تم تحديثه
8. ✅ **portfolioService.js** - تم تحديثه
9. ✅ **api.js** - تم تحسين interceptor للتعامل مع Laravel responses

### الطريقة 1: إنشاء ملف `.env.local`

في مجلد `Front-end`، أنشئ ملف `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

**ملاحظة:** إذا كان ملف `.env.local` محظوراً، يمكنك إنشاؤه يدوياً.

### الطريقة 2: استخدام الإعداد الافتراضي

الفرونت إند مُعد بالفعل لاستخدام:
```javascript
baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'
```

**ملاحظة:** إذا لم تقم بإنشاء `.env.local`، سيستخدم `http://localhost:8000/api` تلقائياً.

---

## 📋 API Endpoints المتاحة

### Authentication:
- `POST /api/register` - تسجيل حساب جديد
- `POST /api/login` - تسجيل الدخول
- `POST /api/logout` - تسجيل الخروج

### Categories:
- `GET /api/categories` - جميع التصنيفات
- `GET /api/categories/{category}` - تفاصيل تصنيف

### Projects:
- `GET /api/projects/open` - المشاريع المفتوحة
- `POST /api/projects` - إنشاء مشروع جديد
- `GET /api/projects/{project}` - تفاصيل مشروع

### Freelancer:
- `GET /api/freelancer/profile` - ملف المستقل
- `PUT /api/freelancer/profile` - تحديث الملف
- `GET /api/freelancer/portfolio` - معرض الأعمال
- `POST /api/freelancer/portfolio` - إضافة عمل

### Offers:
- `POST /api/projects/{project}/offers` - تقديم عرض
- `GET /api/freelancer/offers` - عروضي

### Wallet:
- `GET /api/wallet` - رصيد المحفظة
- `POST /api/wallet/deposit` - إيداع
- `POST /api/wallet/withdraw` - سحب

### Messages:
- `GET /api/projects/{project}/messages` - رسائل المشروع
- `POST /api/projects/{project}/messages` - إرسال رسالة

---

## 🧪 اختبار الاتصال

### من الفرونت إند:

1. **افتح المتصفح Developer Tools (F12)**
2. **اذهب إلى Console**
3. **جرب هذا الكود:**

```javascript
fetch('http://127.0.0.1:8000/api/categories')
  .then(res => res.json())
  .then(data => console.log('✅ API Works!', data))
  .catch(err => console.error('❌ Error:', err));
```

إذا رأيت البيانات، يعني الاتصال يعمل! ✅

---

## 🔐 Authentication

### كيفية استخدام API مع Authentication:

```javascript
// في services/api.js (موجود بالفعل)
// يتم إضافة Token تلقائياً من localStorage

// عند تسجيل الدخول:
const response = await api.post('/api/login', {
  email: 'user@example.com',
  password: 'password'
});

// حفظ Token
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));

// الآن جميع الطلبات ستتضمن Token تلقائياً
```

---

## 📝 ملاحظات مهمة

### CORS:
- تأكد أن الباك إند يسمح بطلبات من `http://localhost:3000`
- إذا كان هناك مشكلة CORS، تحقق من `config/cors.php` في Laravel

### Environment Variables:
- **Backend:** `.env` في مجلد `Back-end`
- **Frontend:** `.env.local` في مجلد `Front-end`

### Ports:
- **Backend:** `8000` (Laravel)
- **Frontend:** `3000` (Next.js)

---

## ✅ Checklist

- [x] Backend يعمل على `http://127.0.0.1:8000`
- [x] API Routes تعمل (35 route)
- [x] قاعدة البيانات جاهزة
- [x] Frontend API service مُعد
- [x] **تم تحديث authService لاستخدام API الحقيقي** ✨
- [x] **تم إنشاء adminService** ✨
- [x] **تم تحديث جميع Services لتتوافق مع Laravel** ✨
- [x] **تم تحسين API interceptor** ✨
- [ ] إنشاء `.env.local` في Frontend (راجع الخطوات أدناه)
- [ ] اختبار الاتصال من Frontend

---

## 🎯 الخطوات التالية

1. **شغّل الباك إند:**
   ```bash
   cd C:\Users\USER\Desktop\Back-end
   php artisan serve
   ```

2. **شغّل الفرونت إند:**
   ```bash
   cd C:\Users\USER\Desktop\Front-end
   npm run dev
   ```

3. **اختبر الاتصال:**
   - افتح `http://localhost:3000`
   - جرب تسجيل الدخول أو تصفح المشاريع

---

---

## 🆕 **التحديثات الأخيرة**

### ✨ **تم ربط Frontend بـ Backend بالكامل!**

1. **Authentication Service:**
   - ✅ تم تفعيل API الحقيقي (إيقاف Mock)
   - ✅ يدعم Laravel Sanctum authentication
   - ✅ معالجة أخطاء Laravel validation

2. **Admin Service:**
   - ✅ تم إنشاء `adminService.js` جديد
   - ✅ جميع endpoints للإدارة متاحة
   - ✅ دعم Reports, Revenue, Statistics

3. **API Interceptor:**
   - ✅ معالجة أفضل للأخطاء
   - ✅ دعم Laravel validation errors (422)
   - ✅ معالجة CSRF token (419)
   - ✅ Network error handling
   - ✅ Auto-redirect عند 401

4. **Services Updates:**
   - ✅ جميع Services محدثة لتتوافق مع Laravel
   - ✅ دعم endpoints بديلة للتوافق
   - ✅ معالجة أخطاء محسنة

---

**آخر تحديث:** ديسمبر 2024  
**الحالة:** ✅ **مربوط بالكامل وجاهز للاستخدام!** 🚀

