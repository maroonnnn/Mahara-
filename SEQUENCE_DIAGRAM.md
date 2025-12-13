# 🔄 Sequence Diagrams - منصة الفريلانسر المتكاملة

## مخططات التسلسل (Sequence Diagrams)

توضح هذه المخططات التدفق التفصيلي للتفاعلات بين مختلف مكونات النظام خلال العمليات الرئيسية.

---

## 1. 📝 التسجيل وإنشاء الحساب (Registration & Account Creation)

```mermaid
sequenceDiagram
    actor User as 👤 المستخدم
    participant UI as واجهة المستخدم<br/>(Frontend)
    participant API as API Controller<br/>(Laravel)
    participant Auth as Auth Service
    participant DB as قاعدة البيانات<br/>(MySQL)
    participant Wallet as Wallet Service

    User->>UI: أدخل بيانات التسجيل<br/>(اسم، بريد، كلمة مرور، نوع الحساب)
    UI->>API: POST /api/register
    API->>Auth: register(userData)
    Auth->>DB: التحقق من البريد (unique)
    DB-->>Auth: البريد متاح ✓
    Auth->>DB: إنشاء حساب جديد في users
    DB-->>Auth: User created (id: 123)
    Auth->>Wallet: createWallet(user_id: 123)
    Wallet->>DB: إنشاء محفظة برصيد 0.00
    DB-->>Wallet: Wallet created
    Wallet-->>Auth: Wallet created successfully
    Auth-->>API: User + Wallet created
    API->>DB: إنشاء ملف FreelancerProfile<br/>(إذا كان نوع الحساب = مستقل)
    DB-->>API: Profile created
    API-->>UI: Success Response<br/>{user, token, wallet}
    UI->>UI: حفظ Token في Context
    UI->>UI: توجيه إلى Dashboard
    UI-->>User: تم التسجيل بنجاح ✨
```

---

## 2. 🚀 العميل ينشر مشروعًا جديدًا (Client Creates Project)

```mermaid
sequenceDiagram
    actor Client as 👤 العميل
    participant UI as واجهة المستخدم
    participant API as ProjectController
    participant Auth as Auth Middleware
    participant DB as قاعدة البيانات
    participant Notify as Notification Service

    Client->>UI: اضغط "إضافة مشروع جديد"
    UI->>UI: عرض نموذج إنشاء المشروع
    Client->>UI: إدخال البيانات<br/>(عنوان، فئة، وصف، ميزانية، مدة)
    UI->>UI: التحقق من صحة البيانات
    UI->>API: POST /api/projects<br/>{title, category_id, description, budget, duration}
    API->>Auth: التحقق من المصادقة
    Auth-->>API: User authenticated (client_id: 123)
    API->>DB: التحقق من وجود الفئة
    DB-->>API: Category exists ✓
    API->>DB: INSERT INTO projects<br/>(client_id, category_id, title, ...)<br/>status = 'open'
    DB-->>API: Project created (id: 456)
    API->>Notify: إشعار المستقلين<br/>(مشروع جديد في فئتهم)
    Notify-->>API: Notifications sent
    API-->>UI: Success Response<br/>{project_id, message}
    UI->>UI: إعادة توجيه إلى صفحة المشروع
    UI-->>Client: تم نشر المشروع بنجاح ✓
```

---

## 3. 💼 المستقل يتصفح ويقدم عرضًا (Freelancer Browses & Submits Offer)

```mermaid
sequenceDiagram
    actor Freelancer as 👤 المستقل
    participant UI as واجهة المستخدم
    participant API as OfferController
    participant Auth as Auth Middleware
    participant DB as قاعدة البيانات
    participant ProjectService as Project Service

    Freelancer->>UI: تصفح المشاريع المفتوحة
    UI->>API: GET /api/projects?status=open
    API->>Auth: التحقق من المصادقة
    Auth-->>API: User authenticated
    API->>ProjectService: getOpenProjects(filters)
    ProjectService->>DB: SELECT * FROM projects<br/>WHERE status = 'open'
    DB-->>ProjectService: List of projects
    ProjectService-->>API: Projects data
    API-->>UI: Projects list
    UI-->>Freelancer: عرض قائمة المشاريع
    
    Freelancer->>UI: اختر مشروع → عرض التفاصيل
    UI->>API: GET /api/projects/456
    API->>DB: SELECT project + category + client info
    DB-->>API: Project details
    API-->>UI: Project full details
    UI-->>Freelancer: عرض تفاصيل المشروع
    
    Freelancer->>UI: اضغط "تقديم عرض"
    UI->>UI: عرض نموذج العرض
    Freelancer->>UI: إدخال البيانات<br/>(مبلغ، مدة، رسالة)
    UI->>API: POST /api/offers<br/>{project_id: 456, amount, duration, message}
    API->>Auth: التحقق من المصادقة
    Auth-->>API: User authenticated (freelancer_id: 789)
    API->>DB: التحقق من حالة المشروع
    DB-->>API: Project status = 'open' ✓
    API->>DB: التحقق من عدم تقديم عرض سابق<br/>من نفس المستقل
    DB-->>API: No previous offer ✓
    API->>DB: INSERT INTO offers<br/>(project_id, freelancer_id, amount, ...)<br/>status = 'pending'
    DB-->>API: Offer created (id: 101)
    API->>Notify: إشعار العميل<br/>(تم استلام عرض جديد)
    API-->>UI: Success Response<br/>{offer_id, message}
    UI-->>Freelancer: تم تقديم العرض بنجاح ✓
```

---

## 4. ✅ العميل يقبل عرضًا ويتم الدفع (Client Accepts Offer & Payment)

```mermaid
sequenceDiagram
    actor Client as 👤 العميل
    participant UI as واجهة المستخدم
    participant API as OfferController
    participant WalletAPI as WalletController
    participant Auth as Auth Middleware
    participant DB as قاعدة البيانات
    participant WalletService as Wallet Service
    participant TransactionService as Transaction Service

    Client->>UI: عرض عروض المشروع
    UI->>API: GET /api/projects/456/offers
    API->>Auth: التحقق من المصادقة
    Auth-->>API: User authenticated (client_id: 123)
    API->>DB: SELECT offers + freelancer info<br/>WHERE project_id = 456
    DB-->>API: Offers list
    API-->>UI: Offers data
    UI-->>Client: عرض جميع العروض
    
    Client->>UI: اختر عرض → اضغط "قبول العرض"
    UI->>UI: تأكيد قبول العرض
    Client->>UI: تأكيد ✓
    UI->>API: PUT /api/offers/101/accept
    
    API->>Auth: التحقق من المصادقة
    Auth-->>API: User authenticated (client_id: 123)
    API->>DB: SELECT offer + project
    DB-->>API: Offer details (amount: 500)
    API->>WalletAPI: GET /api/wallet/balance
    WalletAPI->>WalletService: getBalance(user_id: 123)
    WalletService->>DB: SELECT balance FROM wallets<br/>WHERE user_id = 123
    DB-->>WalletService: Balance = 300
    WalletService-->>WalletAPI: Insufficient balance ✗
    WalletAPI-->>API: Balance check failed
    API-->>UI: Error: رصيد غير كافٍ<br/>يرجى إيداع رصيد أولاً
    UI-->>Client: تنبيه: رصيد غير كافٍ ⚠️
    
    Note over Client,UI: العميل يقوم بالإيداع أولاً
    
    Client->>UI: إيداع رصيد
    UI->>WalletAPI: POST /api/wallet/deposit<br/>{amount: 500}
    WalletAPI->>WalletService: deposit(user_id: 123, amount: 500)
    WalletService->>DB: UPDATE wallets<br/>SET balance = balance + 500
    DB-->>WalletService: Balance updated = 800
    WalletService->>TransactionService: createTransaction<br/>(type: 'deposit', amount: 500)
    TransactionService->>DB: INSERT INTO transactions
    DB-->>TransactionService: Transaction logged
    TransactionService-->>WalletService: Transaction created
    WalletService-->>WalletAPI: Deposit successful
    WalletAPI-->>UI: Success: رصيد محدث ✓
    
    Note over Client,UI: العميل يحاول قبول العرض مرة أخرى
    
    UI->>API: PUT /api/offers/101/accept
    API->>WalletAPI: GET /api/wallet/balance
    WalletAPI->>WalletService: getBalance(user_id: 123)
    WalletService->>DB: SELECT balance
    DB-->>WalletService: Balance = 800 ✓
    WalletService-->>WalletAPI: Sufficient balance
    WalletAPI-->>API: Balance check passed ✓
    
    API->>WalletService: deduct(user_id: 123, amount: 500)
    WalletService->>DB: UPDATE wallets<br/>SET balance = balance - 500<br/>WHERE user_id = 123
    DB-->>WalletService: Balance updated = 300
    WalletService->>TransactionService: createTransaction<br/>(type: 'payment', amount: 500, project_id: 456)
    TransactionService->>DB: INSERT INTO transactions<br/>(type: 'payment', status: 'completed')
    DB-->>TransactionService: Transaction logged
    
    API->>DB: UPDATE offers<br/>SET status = 'accepted'<br/>WHERE id = 101
    DB-->>API: Offer updated
    API->>DB: UPDATE projects<br/>SET status = 'in_progress'<br/>accepted_offer_id = 101
    DB-->>API: Project updated
    API->>Notify: إشعار المستقل<br/>(تم قبول عرضك)
    
    API-->>UI: Success Response<br/>{message: "تم قبول العرض"}
    UI-->>Client: تم قبول العرض وخصم المبلغ ✓
```

---

## 5. 💬 التواصل أثناء التنفيذ (Communication During Execution)

```mermaid
sequenceDiagram
    actor Client as 👤 العميل
    actor Freelancer as 👤 المستقل
    participant UI1 as واجهة العميل
    participant UI2 as واجهة المستقل
    participant API as MessageController
    participant Socket as Socket.IO Server
    participant DB as قاعدة البيانات

    Note over Client,Freelancer: المشروع في حالة in_progress
    
    Client->>UI1: افتح صفحة المحادثة
    UI1->>API: GET /api/projects/456/messages
    API->>DB: SELECT messages<br/>WHERE project_id = 456<br/>ORDER BY created_at
    DB-->>API: Messages history
    API-->>UI1: Messages list
    UI1-->>Client: عرض تاريخ المحادثة
    
    Client->>UI1: كتابة رسالة جديدة
    Client->>UI1: إرسال الرسالة
    UI1->>Socket: emit('sendMessage', {project_id, message})
    Socket->>API: POST /api/messages<br/>{project_id: 456, message, sender_id, receiver_id}
    API->>DB: INSERT INTO messages<br/>(project_id, sender_id, receiver_id, message)
    DB-->>API: Message saved (id: 789)
    API->>Socket: Broadcast message
    Socket->>UI2: emit('newMessage', messageData)
    Socket-->>UI1: emit('messageSent', messageData)
    UI1-->>Client: تم إرسال الرسالة ✓
    UI2-->>Freelancer: رسالة جديدة 📩
    
    Freelancer->>UI2: قراءة الرسالة
    Freelancer->>UI2: الرد على الرسالة
    UI2->>Socket: emit('sendMessage', {project_id, message})
    Socket->>API: POST /api/messages
    API->>DB: INSERT INTO messages
    DB-->>API: Message saved
    API->>Socket: Broadcast message
    Socket->>UI1: emit('newMessage', messageData)
    UI1-->>Client: رسالة جديدة من المستقل 📩
```

---

## 6. ✅ إنهاء المشروع وتحويل الأموال (Complete Project & Transfer Funds)

```mermaid
sequenceDiagram
    actor Client as 👤 العميل
    participant UI as واجهة المستخدم
    participant API as ProjectController
    participant WalletAPI as WalletController
    participant Auth as Auth Middleware
    participant DB as قاعدة البيانات
    participant WalletService as Wallet Service
    participant TransactionService as Transaction Service
    participant FreelancerWallet as Freelancer Wallet Service

    Client->>UI: عرض تفاصيل المشروع
    UI->>API: GET /api/projects/456
    API->>DB: SELECT project + accepted_offer
    DB-->>API: Project data (offer amount: 500)
    API-->>UI: Project details
    UI-->>Client: عرض حالة المشروع (in_progress)
    
    Client->>UI: اضغط "إنهاء المشروع"
    UI->>UI: تأكيد الإنهاء
    Client->>UI: تأكيد ✓
    UI->>API: PUT /api/projects/456/complete
    
    API->>Auth: التحقق من المصادقة
    Auth-->>API: User authenticated (client_id: 123)
    API->>DB: SELECT project + accepted_offer
    DB-->>API: Project data<br/>(freelancer_id: 789, amount: 500)
    
    API->>WalletService: getFreelancerWallet(freelancer_id: 789)
    WalletService->>DB: SELECT wallet FROM wallets<br/>WHERE user_id = 789
    DB-->>WalletService: Freelancer wallet (balance: 100)
    
    API->>WalletService: transferToFreelancer<br/>(freelancer_id: 789, amount: 500)
    WalletService->>DB: UPDATE wallets<br/>SET balance = balance + 500<br/>WHERE user_id = 789
    DB-->>WalletService: Freelancer balance = 600
    
    WalletService->>TransactionService: createTransaction<br/>(wallet_id: freelancer_wallet,<br/>type: 'earning', amount: 500,<br/>project_id: 456)
    TransactionService->>DB: INSERT INTO transactions<br/>(type: 'earning', status: 'completed')
    DB-->>TransactionService: Transaction logged
    
    API->>DB: UPDATE projects<br/>SET status = 'completed'<br/>completed_at = NOW()<br/>WHERE id = 456
    DB-->>API: Project updated
    
    API->>Notify: إشعار المستقل<br/>(تم إنهاء المشروع)
    API->>Notify: تفعيل نموذج التقييم للعميل
    
    API-->>UI: Success Response<br/>{message: "تم إنهاء المشروع"}
    UI->>UI: عرض نموذج التقييم
    UI-->>Client: تم إنهاء المشروع وتحويل الأموال ✓<br/>يرجى تقييم المستقل
```

---

## 7. ⭐ التقييم بعد الإنهاء (Rating After Completion)

```mermaid
sequenceDiagram
    actor Client as 👤 العميل
    participant UI as واجهة المستخدم
    participant API as ReviewController
    participant Auth as Auth Middleware
    participant DB as قاعدة البيانات
    participant ReviewService as Review Service
    participant UserService as User Service

    Client->>UI: عرض نموذج التقييم
    UI->>UI: تعبئة التقييم<br/>(نجوم 1-5 + تعليق)
    Client->>UI: إرسال التقييم
    UI->>API: POST /api/reviews<br/>{project_id: 456, rating: 5, comment}
    
    API->>Auth: التحقق من المصادقة
    Auth-->>API: User authenticated (client_id: 123)
    API->>DB: التحقق من حالة المشروع
    DB-->>API: Project status = 'completed' ✓
    API->>DB: التحقق من عدم وجود تقييم سابق<br/>لنفس المشروع
    DB-->>API: No existing review ✓
    
    API->>ReviewService: createReview<br/>(project_id, client_id, freelancer_id, rating, comment)
    ReviewService->>DB: INSERT INTO reviews<br/>(project_id, client_id, freelancer_id, rating, comment)
    DB-->>ReviewService: Review created (id: 202)
    
    ReviewService->>UserService: updateFreelancerRating<br/>(freelancer_id: 789)
    UserService->>DB: SELECT AVG(rating) FROM reviews<br/>WHERE freelancer_id = 789
    DB-->>UserService: Average rating = 4.75
    UserService->>DB: UPDATE users<br/>SET rating = 4.75<br/>WHERE id = 789
    DB-->>UserService: Rating updated
    
    API->>Notify: إشعار المستقل<br/>(تلقيت تقييمًا جديدًا)
    
    ReviewService-->>API: Review created + Rating updated
    API-->>UI: Success Response<br/>{review_id, new_rating: 4.75}
    UI->>UI: عرض رسالة النجاح
    UI-->>Client: تم إرسال التقييم بنجاح ⭐
```

---

## 8. ❌ إلغاء المشروع واسترجاع الأموال (Cancel Project & Refund)

```mermaid
sequenceDiagram
    actor Client as 👤 العميل
    participant UI as واجهة المستخدم
    participant API as ProjectController
    participant WalletAPI as WalletController
    participant Auth as Auth Middleware
    participant DB as قاعدة البيانات
    participant WalletService as Wallet Service
    participant TransactionService as Transaction Service

    Client->>UI: عرض تفاصيل المشروع
    UI->>API: GET /api/projects/456
    API->>DB: SELECT project details
    DB-->>API: Project (status: 'in_progress', amount: 500)
    API-->>UI: Project details
    UI-->>Client: عرض حالة المشروع
    
    Client->>UI: اضغط "إلغاء المشروع"
    UI->>UI: تأكيد الإلغاء + سبب
    Client->>UI: تأكيد الإلغاء ✓
    UI->>API: PUT /api/projects/456/cancel<br/>{reason}
    
    API->>Auth: التحقق من المصادقة
    Auth-->>API: User authenticated (client_id: 123)
    API->>DB: SELECT project + transaction
    DB-->>API: Project (amount: 500)<br/>Transaction (payment, amount: 500)
    
    API->>WalletAPI: refundToClient<br/>(client_id: 123, amount: 500)
    WalletAPI->>WalletService: refund(user_id: 123, amount: 500)
    WalletService->>DB: UPDATE wallets<br/>SET balance = balance + 500<br/>WHERE user_id = 123
    DB-->>WalletService: Client balance updated
    
    WalletService->>TransactionService: createTransaction<br/>(type: 'refund', amount: 500,<br/>project_id: 456, status: 'completed')
    TransactionService->>DB: INSERT INTO transactions<br/>(type: 'refund')
    DB-->>TransactionService: Transaction logged
    
    API->>DB: UPDATE projects<br/>SET status = 'cancelled'<br/>WHERE id = 456
    DB-->>API: Project cancelled
    
    API->>DB: UPDATE offers<br/>SET status = 'rejected'<br/>WHERE id = 101
    DB-->>API: Offer rejected
    
    API->>Notify: إشعار المستقل<br/>(تم إلغاء المشروع)
    
    WalletService-->>WalletAPI: Refund successful
    API-->>UI: Success Response<br/>{message: "تم الإلغاء واسترجاع الأموال"}
    UI-->>Client: تم إلغاء المشروع واسترجاع 500$ ✓
```

---

## 9. 💰 المستقل يسحب الأرباح (Freelancer Withdraws Earnings)

```mermaid
sequenceDiagram
    actor Freelancer as 👤 المستقل
    participant UI as واجهة المستخدم
    participant API as WalletController
    participant Auth as Auth Middleware
    participant DB as قاعدة البيانات
    participant WalletService as Wallet Service
    participant TransactionService as Transaction Service
    participant PaymentGateway as بوابة الدفع

    Freelancer->>UI: عرض صفحة المحفظة
    UI->>API: GET /api/wallet
    API->>Auth: التحقق من المصادقة
    Auth-->>API: User authenticated (freelancer_id: 789)
    API->>DB: SELECT wallet + transactions<br/>WHERE user_id = 789
    DB-->>API: Wallet (balance: 600)<br/>Transactions list
    API-->>UI: Wallet data
    UI-->>Freelancer: عرض الرصيد (600$)
    
    Freelancer->>UI: اضغط "سحب الأرباح"
    UI->>UI: عرض نموذج السحب<br/>(المبلغ، بيانات البنك)
    Freelancer->>UI: إدخال البيانات<br/>(amount: 400, bank_details)
    UI->>API: POST /api/wallet/withdraw<br/>{amount: 400, bank_details}
    
    API->>Auth: التحقق من المصادقة
    Auth-->>API: User authenticated (freelancer_id: 789)
    API->>DB: SELECT balance FROM wallets<br/>WHERE user_id = 789
    DB-->>API: Balance = 600 ✓
    
    API->>WalletService: withdraw(user_id: 789, amount: 400)
    WalletService->>DB: UPDATE wallets<br/>SET balance = balance - 400<br/>WHERE user_id = 789
    DB-->>WalletService: Balance updated = 200
    
    WalletService->>TransactionService: createTransaction<br/>(type: 'withdraw', amount: 400,<br/>status: 'pending')
    TransactionService->>DB: INSERT INTO transactions<br/>(type: 'withdraw', status: 'pending')
    DB-->>TransactionService: Transaction logged
    
    API->>PaymentGateway: processWithdrawal<br/>(amount: 400, bank_details)
    PaymentGateway-->>API: Withdrawal request submitted<br/>(processing...)
    
    API-->>UI: Success Response<br/>{message: "جاري معالجة طلب السحب"}
    UI-->>Freelancer: تم تقديم طلب السحب ✓<br/>سوف تتم المعالجة خلال 3-5 أيام
    
    Note over PaymentGateway,DB: بعد معالجة البوابة...
    
    PaymentGateway->>API: Webhook: withdrawal completed
    API->>DB: UPDATE transactions<br/>SET status = 'completed'<br/>WHERE id = transaction_id
    DB-->>API: Transaction updated
    API->>Notify: إشعار المستقل<br/>(تم تحويل الأموال)
```

---

## 10. 🔍 عرض إحصائيات المدير (Admin Views Analytics)

```mermaid
sequenceDiagram
    actor Admin as 👤 المدير
    participant UI as لوحة التحكم
    participant API as AdminController
    participant Auth as Auth Middleware
    participant DB as قاعدة البيانات
    participant AnalyticsService as Analytics Service

    Admin->>UI: تسجيل الدخول → لوحة التحكم
    UI->>API: GET /api/admin/dashboard
    
    API->>Auth: التحقق من الصلاحيات (Admin)
    Auth-->>API: Admin authenticated ✓
    
    API->>AnalyticsService: getDashboardStats()
    
    par الحصول على الإحصائيات
        AnalyticsService->>DB: SELECT COUNT(*) FROM users
        DB-->>AnalyticsService: Total users: 1500
    and
        AnalyticsService->>DB: SELECT COUNT(*) FROM projects<br/>WHERE status = 'open'
        DB-->>AnalyticsService: Open projects: 45
    and
        AnalyticsService->>DB: SELECT COUNT(*) FROM projects<br/>WHERE status = 'in_progress'
        DB-->>AnalyticsService: Active projects: 120
    and
        AnalyticsService->>DB: SELECT SUM(amount) FROM transactions<br/>WHERE type = 'payment'
        DB-->>AnalyticsService: Total revenue: 50000
    and
        AnalyticsService->>DB: SELECT COUNT(*) FROM transactions<br/>WHERE created_at >= TODAY
        DB-->>AnalyticsService: Today transactions: 25
    end
    
    AnalyticsService-->>API: Dashboard stats
    API-->>UI: Dashboard data<br/>{users, projects, revenue, transactions}
    UI-->>Admin: عرض الإحصائيات 📊
```

---

## 📋 ملخص المخططات

| رقم المخطط | العملية | الوصف |
|-----------|---------|-------|
| 1 | التسجيل | إنشاء حساب جديد ومحفظة |
| 2 | نشر مشروع | العميل ينشر مشروعًا جديدًا |
| 3 | تقديم عرض | المستقل يقدم عرضًا على مشروع |
| 4 | قبول العرض | العميل يقبل عرضًا ويتم الدفع |
| 5 | التواصل | الرسائل بين العميل والمستقل |
| 6 | إنهاء المشروع | إنهاء المشروع وتحويل الأموال |
| 7 | التقييم | تقييم المستقل بعد الإنهاء |
| 8 | الإلغاء | إلغاء المشروع واسترجاع الأموال |
| 9 | سحب الأرباح | المستقل يسحب أرباحه |
| 10 | إحصائيات المدير | عرض إحصائيات النظام |

---

## 💡 ملاحظات مهمة

1. **المصادقة**: جميع الطلبات تتطلب مصادقة أولاً (Auth Middleware)
2. **التحقق**: يتم التحقق من الحالة والصلاحيات قبل كل عملية
3. **المعاملات**: جميع العمليات المالية تسجل في جدول transactions
4. **الإشعارات**: يتم إرسال إشعارات عند الأحداث المهمة
5. **الأمان**: جميع العمليات محمية بطبقات أمان متعددة

---

## 🔗 التكامل بين المخططات

- **المخطط 1 → 2**: بعد التسجيل يمكن للعميل نشر مشروع
- **المخطط 2 → 3**: بعد نشر المشروع يمكن للمستقل تقديم عرض
- **المخطط 3 → 4**: بعد تقديم العرض يمكن للعميل قبوله
- **المخطط 4 → 5**: بعد قبول العرض يبدأ التواصل
- **المخطط 5 → 6**: بعد التواصل يتم إنهاء المشروع
- **المخطط 6 → 7**: بعد الإنهاء يتم التقييم
- **المخطط 9**: يمكن تنفيذه في أي وقت بعد وجود رصيد

