# 🌐 نظام دعم اللغتين (Bilingual Support)

## 📋 **نظرة عامة**

تم إضافة نظام دعم كامل للغتين العربية والإنجليزية في منصة Mahara، مع دعم تام لـ RTL/LTR وتبديل سريع بين اللغات.

---

## ✨ **المميزات**

- ✅ دعم كامل للعربية والإنجليزية
- ✅ تبديل فوري بين اللغات
- ✅ دعم RTL/LTR تلقائي
- ✅ حفظ اللغة المختارة في localStorage
- ✅ ترجمات منظمة في ملف واحد
- ✅ سهولة إضافة لغات جديدة
- ✅ زر تبديل اللغة في Header
- ✅ أيقونات الأعلام للغات

---

## 📁 **الملفات الأساسية**

### **1. locales/translations.js**
**الوظيفة:** يحتوي على جميع الترجمات

```javascript
export const translations = {
  ar: {
    common: {
      search: 'ابحث',
      login: 'تسجيل الدخول',
      // ... more
    },
    landing: {
      heroTitle: 'المستقلون لدينا',
      // ... more
    }
  },
  en: {
    common: {
      search: 'Search',
      login: 'Sign In',
      // ... more
    },
    landing: {
      heroTitle: 'Our freelancers',
      // ... more
    }
  }
};
```

### **2. contexts/LanguageContext.js**
**الوظيفة:** إدارة حالة اللغة

```javascript
const { language, isRTL, changeLanguage, t } = useLanguage();

// تبديل اللغة
changeLanguage('ar'); // أو 'en'

// استخدام الترجمة
const text = t('common.search'); // "ابحث" أو "Search"
```

### **3. components/layout/Header.js**
**الوظيفة:** زر تبديل اللغة

- قائمة منسدلة مع أعلام الدول
- عرض اللغة الحالية
- تبديل فوري

---

## 🚀 **كيفية الاستخدام**

### **في أي Component:**

```javascript
import { useLanguage } from '../contexts/LanguageContext';

export default function MyComponent() {
  const { t, language, isRTL, changeLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('landing.heroTitle')}</h1>
      <p>{t('landing.heroSubtitle')}</p>
      
      {/* تبديل اللغة */}
      <button onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')}>
        {language === 'ar' ? 'English' : 'العربية'}
      </button>
    </div>
  );
}
```

---

## 📚 **الأقسام المترجمة**

### **1. Common (العامة)**
- البحث، تسجيل الدخول، الأزرار الأساسية

### **2. Navigation (التنقل)**
- القائمة الرئيسية، الروابط

### **3. Landing Page**
- Hero Section
- الفئات
- الخدمات الشائعة
- كيف تعمل Mahara
- التوصيات
- أزرار CTA

### **4. Auth (المصادقة)**
- تسجيل الدخول
- إنشاء حساب

### **5. Dashboard (لوحة التحكم)**
- الإحصائيات
- الروابط السريعة

### **6. Projects (المشاريع)**
- تفاصيل المشروع
- الحالات

### **7. Footer (التذييل)**
- جميع الروابط والأقسام

---

## ➕ **إضافة ترجمات جديدة**

### **الخطوة 1: إضافة المفتاح في translations.js**

```javascript
export const translations = {
  ar: {
    // ... existing translations
    newSection: {
      title: 'عنوان جديد',
      description: 'وصف جديد',
    }
  },
  en: {
    // ... existing translations
    newSection: {
      title: 'New Title',
      description: 'New Description',
    }
  }
};
```

### **الخطوة 2: استخدامه في Component**

```javascript
const { t } = useLanguage();

<h1>{t('newSection.title')}</h1>
<p>{t('newSection.description')}</p>
```

---

## 🎨 **دعم RTL/LTR**

### **التبديل التلقائي:**

```javascript
// في LanguageContext.js
document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
document.documentElement.setAttribute('lang', lang);
```

### **في Tailwind CSS:**

```javascript
// يعمل تلقائياً مع dir="rtl"
className="mr-4" // يصبح ml-4 في RTL
className="text-left" // يصبح text-right في RTL
```

### **استخدام isRTL:**

```javascript
const { isRTL } = useLanguage();

<div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
  {/* محتوى */}
</div>
```

---

## 🔄 **سير العمل (Workflow)**

### **1. المستخدم يفتح الموقع:**
```
تحميل اللغة من localStorage (الافتراضي: العربية)
    ↓
تطبيق dir="rtl" أو "ltr"
    ↓
عرض المحتوى بالترجمة المناسبة
```

### **2. المستخدم يغير اللغة:**
```
الضغط على زر اللغة في Header
    ↓
changeLanguage('en' أو 'ar')
    ↓
حفظ في localStorage
    ↓
تحديث HTML dir و lang
    ↓
إعادة render جميع Components
    ↓
عرض المحتوى بالترجمة الجديدة ✅
```

---

## 💾 **حفظ اللغة**

```javascript
// الحفظ
localStorage.setItem('language', 'ar');

// القراءة
const savedLang = localStorage.getItem('language') || 'ar';
```

---

## 🎯 **مثال كامل: صفحة Landing**

```javascript
import { useLanguage } from '../contexts/LanguageContext';

export default function LandingPage() {
  const { t, language } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <h1>{t('landing.heroTitle')}</h1>
      <h2>{t('landing.heroSubtitle')}</h2>
      
      {/* Search */}
      <input 
        placeholder={t('landing.searchPlaceholder')} 
      />
      
      {/* Categories */}
      {categories.map(cat => (
        <div key={cat.key}>
          <h3>{t(`categories.${cat.key}`)}</h3>
        </div>
      ))}
      
      {/* Buttons */}
      <button>{t('landing.createAccount')}</button>
      <button>{t('landing.signIn')}</button>
    </div>
  );
}
```

---

## 🌍 **إضافة لغة ثالثة (مثال: الفرنسية)**

### **1. إضافة الترجمات:**

```javascript
export const translations = {
  ar: { /* ... */ },
  en: { /* ... */ },
  fr: {
    common: {
      search: 'Rechercher',
      login: 'Se connecter',
    },
    landing: {
      heroTitle: 'Nos freelances',
      heroSubtitle: 'prendront le relais',
    }
  }
};
```

### **2. تحديث Header.js:**

```javascript
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }, // جديد
];
```

### **3. تحديث RTL logic (إذا لزم):**

```javascript
const isRTL = ['ar', 'he', 'fa'].includes(lang); // العربية، العبرية، الفارسية
```

---

## 🧪 **الاختبار**

### **Test 1: تبديل اللغة**
1. افتح الموقع (اللغة الافتراضية: العربية)
2. اضغط على زر اللغة في Header
3. اختر "English"
4. **تحقق:** جميع النصوص تتحول للإنجليزية ✅
5. **تحقق:** الاتجاه يتحول من RTL إلى LTR ✅

### **Test 2: حفظ اللغة**
1. غيّر اللغة إلى الإنجليزية
2. أعد تحميل الصفحة (F5)
3. **تحقق:** اللغة تبقى إنجليزية ✅

### **Test 3: التنقل بين الصفحات**
1. غيّر اللغة في الصفحة الرئيسية
2. انتقل إلى صفحة أخرى
3. **تحقق:** اللغة تبقى كما هي ✅

---

## 📊 **الإحصائيات**

- **عدد المفاتيح:** 100+ مفتاح ترجمة
- **اللغات المدعومة:** 2 (عربي، إنجليزي)
- **الصفحات المترجمة:** Landing Page (جاهزة)
- **الصفحات التالية:** Dashboard, Projects, Auth (قريباً)

---

## 🔜 **الخطوات التالية (Optional)**

### **1. ترجمة باقي الصفحات:**
- [ ] صفحات Auth (login, register)
- [ ] صفحات Dashboard (client, freelancer, admin)
- [ ] صفحات Projects
- [ ] صفحات Profile و Wallet

### **2. تحسينات:**
- [ ] Lazy loading للترجمات
- [ ] Code splitting حسب اللغة
- [ ] استخدام مكتبة i18n مثل `react-i18next` (اختياري)

### **3. SEO:**
- [ ] روابط مختلفة لكل لغة (`/ar`, `/en`)
- [ ] Hreflang tags
- [ ] Sitemap متعدد اللغات

---

## ✅ **الحالة الحالية**

- ✅ **نظام الترجمة:** يعمل بشكل كامل
- ✅ **زر تبديل اللغة:** موجود في Header
- ✅ **Landing Page:** مترجمة بالكامل
- ✅ **RTL/LTR:** يعمل تلقائياً
- ✅ **حفظ اللغة:** localStorage
- ✅ **سهولة الاستخدام:** hook واحد `useLanguage()`

---

## 🎓 **أمثلة إضافية**

### **ترجمة مع متغيرات:**

```javascript
// في translations.js
welcome: 'مرحباً {{name}}', // العربية
welcome: 'Welcome {{name}}', // English

// في Component
const name = 'أحمد';
const text = t('common.welcome').replace('{{name}}', name);
// "مرحباً أحمد"
```

### **ترجمة حسب العدد (Plurals):**

```javascript
// في translations.js
projectsCount: {
  zero: 'لا توجد مشاريع',
  one: 'مشروع واحد',
  two: 'مشروعان',
  few: '{{count}} مشاريع',
  many: '{{count}} مشروعاً',
  other: '{{count}} مشروع'
}

// في Component
const count = 5;
const text = t(`common.projectsCount.${getArabicPlural(count)}`)
  .replace('{{count}}', count);
```

---

**🌟 نظام الترجمة جاهز للاستخدام!**

**للاستخدام:** `const { t } = useLanguage(); t('key.path')`

