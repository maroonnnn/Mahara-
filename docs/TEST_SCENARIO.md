# Complete Test Scenario - Fiverr Clone Platform

## Scenario Overview
**Project Title:** "تصميم شعار احترافي لشركة تكنولوجيا"  
**Budget:** $500  
**Timeline:** 7 days  
**Category:** Graphics & Design → Logo Design

---

## 👥 Characters

### 1. **Abdalrhmn Bobes** (Client/العميل)
- Role: Client
- Company: Tech Solutions Inc.
- Need: Professional logo design for his technology company
- Budget: $500
- Email: abdalrhmn@example.com

### 2. **Ahmed Designer** (Freelancer/المستقل)
- Role: Freelancer
- Specialization: Logo Design & Branding
- Experience: 5 years
- Portfolio: 127 completed projects
- Rating: 4.9 ⭐
- Email: ahmed@example.com

---

## 📋 Complete Workflow (Step by Step)

### Phase 1: Client Registration & Project Posting

#### Step 1.1: Client Registration
1. Navigate to `http://localhost:3000`
2. Click **"Join"** or **"Sign Up"**
3. Fill registration form:
   - Name: `Abdalrhmn Bobes`
   - Email: `abdalrhmn@example.com`
   - Password: `Test@1234`
   - Role: Select **"Client (عميل)"**
4. Click **"Create Account"**
5. ✅ Redirected to dashboard (`/dashboard`)
6. ✅ Wallet created with balance: $0.00

**Expected Result:**
- User logged in as Client
- Dashboard shows welcome message
- Sidebar shows client menu items

---

#### Step 1.2: Client Posts a New Project
1. From sidebar, click **"مشروع جديد"** (New Project)
2. Navigate to `/client/projects/new`

**Step 1 - Project Details:**
- **Title:** `تصميم شعار احترافي لشركة تكنولوجيا`
- **Category:** Select `Graphics & Design`
- **Subcategory:** Select `Logo Design`
- **Description:**
  ```
  أحتاج إلى تصميم شعار احترافي يعكس هوية شركتي في مجال التكنولوجيا.
  
  المتطلبات:
  - شعار عصري وبسيط
  - يمكن استخدامه في مختلف الوسائط (موقع، بطاقات، مواد تسويقية)
  - يعكس الابتكار والتكنولوجيا
  - ملفات بصيغ متعددة (AI, PNG, SVG)
  
  الألوان المفضلة: أزرق، رمادي، أو حسب اقتراح المصمم
  ```
- **Skills Required:** Add `Photoshop`, `Illustrator`, `Logo Design`
- **Attachments:** Upload company info (optional)
- Click **"Next"**

**Step 2 - Budget & Timeline:**
- **Budget Type:** Select `Fixed Price`
- **Budget Amount:** `500`
- **Delivery Time:** `7` days
- **Additional Info:** `أرجو تقديم 3 مفاهيم مختلفة للاختيار`
- Click **"Next"**

**Step 3 - Review & Submit:**
- Review all details
- Click **"نشر المشروع"** (Publish Project)

**Expected Result:**
- ✅ Success message: "تم إرسال المشروع بنجاح!"
- ✅ Redirected to `/client/projects`
- ✅ Project appears with status: "Active (نشط)"
- ✅ Project visible to all freelancers

---

### Phase 2: Freelancer Registration & Browsing

#### Step 2.1: Freelancer Registration
1. **Logout** from client account (click avatar → Logout)
2. Navigate to `http://localhost:3000`
3. Click **"Join"** or **"Sign Up"**
4. Fill registration form:
   - Name: `Ahmed Designer`
   - Email: `ahmed@example.com`
   - Password: `Test@1234`
   - Role: Select **"Freelancer (مستقل)"**
5. Click **"Create Account"**
6. ✅ Redirected to `/freelancer/dashboard`

**Expected Result:**
- User logged in as Freelancer
- Dashboard shows available projects
- Sidebar shows freelancer menu items

---

#### Step 2.2: Build Portfolio
1. From sidebar, click **"الحافظة"** (Portfolio)
2. Navigate to `/freelancer/portfolio`
3. Click **"إضافة عمل"** (Add Work)
4. Fill form:
   - **Title:** `تصميم شعار لشركة تقنية`
   - **Description:** `شعار حديث وعصري يعكس الابتكار في مجال التقنية`
   - **Category:** `Graphics & Design`
   - **Link:** `https://behance.net/ahmed-portfolio`
5. Click **"حفظ"** (Save)

**Expected Result:**
- ✅ Portfolio item added
- ✅ Displays in portfolio grid

---

#### Step 2.3: Browse Available Projects
1. From sidebar, click **"المشاريع المتاحة"** (Available Projects)
2. Navigate to `/freelancer/projects`
3. See list of open projects
4. Use search: Type `شعار` or `logo`
5. Find the project: "تصميم شعار احترافي لشركة تكنولوجيا"
6. Click **"عرض التفاصيل"** (View Details)

**Expected Result:**
- ✅ Project details page loaded
- ✅ Shows project description, budget, timeline
- ✅ Shows client info (Abdalrhmn Bobes, rating)
- ✅ "Submit Offer" button visible

---

### Phase 3: Freelancer Submits Offer

#### Step 3.1: Submit Offer
1. On project details page `/freelancer/projects/1`
2. Click **"تقديم عرض"** (Submit Offer)
3. Fill offer form:
   - **Proposed Amount:** `450` (offering $50 discount)
   - **Duration:** `5` days
   - **Duration Unit:** Select `days`
   - **Cover Message:**
     ```
     مرحباً،
     
     أنا مصمم جرافيك متخصص في تصميم الشعارات مع خبرة 5 سنوات.
     
     ما سأقدمه:
     - 3 مفاهيم مختلفة للشعار
     - مراجعات غير محدودة حتى رضاك الكامل
     - ملفات بجميع الصيغ (AI, EPS, PNG, SVG, PDF)
     - دليل استخدام الشعار
     
     يمكنك مراجعة أعمالي السابقة في الحافظة.
     
     في انتظار ردك،
     Ahmed Designer
     ```
4. Click **"إرسال العرض"** (Send Offer)

**Expected Result:**
- ✅ Success message: "تم تقديم العرض بنجاح!"
- ✅ "Send Message" button appears
- ✅ Client receives notification (in real app)

---

### Phase 4: Client Reviews & Accepts Offer

#### Step 4.1: Switch Back to Client
**For Testing:**
1. Go to `http://localhost:3000/switch-role`
2. Select **"Client (عميل)"**
3. Click **"Switch to Client"**

**OR Logout and Login:**
1. Logout from freelancer account
2. Login with client credentials:
   - Email: `abdalrhmn@example.com`
   - Password: `Test@1234`

---

#### Step 4.2: Review Offers
1. From sidebar, click **"مشاريعي"** (My Projects)
2. Navigate to `/client/projects`
3. See project with "12 عروض" (12 offers)
4. Click **"العروض (12)"** button
5. Navigate to `/client/projects/1/proposals`
6. See list of offers from different freelancers
7. Find Ahmed Designer's offer:
   - Amount: $450
   - Duration: 5 days
   - Rating: 4.9 ⭐
   - Message showing experience and deliverables

**Expected Result:**
- ✅ All offers displayed
- ✅ Can compare offers by price, duration, ratings
- ✅ Each offer has "Accept" and "Decline" buttons

---

#### Step 4.3: Accept Offer
1. On Ahmed Designer's offer, click **"قبول العرض"** (Accept Offer)
2. System checks wallet balance
3. If insufficient funds, shows message: "الرجاء إضافة رصيد"
4. Navigate to `/client/wallet`
5. Click **"إضافة رصيد"** (Add Funds)
6. Add $500 to wallet
7. Return to offers page
8. Click **"قبول العرض"** again
9. Confirm acceptance

**Expected Result:**
- ✅ $450 deducted from wallet
- ✅ Project status changed to "In Progress (قيد التنفيذ)"
- ✅ Conversation created with freelancer
- ✅ Other offers rejected automatically
- ✅ Freelancer receives notification

---

### Phase 5: Communication & Collaboration

#### Step 5.1: Client Sends First Message
1. From sidebar, click **"الرسائل"** (Messages)
2. Navigate to `/client/messages`
3. See conversation with Ahmed Designer
4. Click on conversation to open chat
5. Navigate to `/client/messages/1`
6. Type message:
   ```
   مرحباً Ahmed،
   
   شكراً لقبولك المشروع!
   
   هل يمكنك البدء بإرسال المفاهيم الأولية خلال يومين؟
   
   بالتوفيق
   ```
7. Press **Enter** or click **Send**

**Expected Result:**
- ✅ Message sent and displayed
- ✅ Shows timestamp
- ✅ Auto-scrolls to latest message

---

#### Step 5.2: Freelancer Responds
**Switch to Freelancer:**
1. Go to `http://localhost:3000/switch-role`
2. Select **"Freelancer (مستقل)"**
3. Click **"Switch to Freelancer"**

**Send Response:**
1. From sidebar, click **"الرسائل"** (Messages)
2. Navigate to `/freelancer/messages`
3. See conversation with Abdalrhmn (with unread badge)
4. Click on conversation
5. Navigate to `/freelancer/messages/1`
6. Type message:
   ```
   مرحباً Abdalrhmn،
   
   بالتأكيد! سأبدأ العمل فوراً.
   
   سأرسل لك 3 مفاهيم أولية خلال 48 ساعة.
   
   هل لديك أي ألوان أو أنماط مفضلة؟
   ```
7. Press **Enter** or click **Send**

**Expected Result:**
- ✅ Message sent
- ✅ Appears in conversation
- ✅ Client receives notification (in real app)

---

#### Step 5.3: Share Files
1. Click **📎** (Attachment icon)
2. Select file: `logo_concepts_v1.pdf`
3. Type message:
   ```
   تفضل المفاهيم الأولية للشعار.
   
   يرجى إخباري برأيك وأي تعديلات تريدها.
   ```
4. Click **Send**

**Expected Result:**
- ✅ File uploaded and sent
- ✅ Shows file name with download link
- ✅ Message with attachment displayed

---

#### Step 5.4: Client Reviews & Provides Feedback
**Switch to Client:**
1. Switch role to Client
2. Open conversation
3. Download attached file
4. Review concepts
5. Send feedback:
   ```
   شكراً Ahmed!
   
   أعجبني المفهوم الثاني كثيراً.
   
   هل يمكنك تطويره مع التعديلات التالية:
   - استخدام اللون الأزرق الداكن
   - جعل الخط أكثر جرأة
   - إضافة نسخة بخلفية بيضاء
   
   شكراً
   ```

**Expected Result:**
- ✅ Back-and-forth conversation
- ✅ Messages display in chronological order
- ✅ Can scroll up to read history

---

### Phase 6: Active Project Management

#### Step 6.1: Freelancer Views Active Projects
**As Freelancer:**
1. From sidebar, click **"المشاريع النشطة"** (Active Projects)
2. Navigate to `/freelancer/active-projects`
3. See project with progress bar (60% complete)
4. View deadline countdown
5. Click **"فتح المحادثة"** (Open Chat) to continue discussion

**Expected Result:**
- ✅ Active projects listed
- ✅ Progress tracking visible
- ✅ Quick access to chat

---

#### Step 6.2: Client Views Project Status
**As Client:**
1. From sidebar, click **"مشاريعي"** (My Projects)
2. Navigate to `/client/projects`
3. Filter: Select **"قيد التنفيذ"** (In Progress)
4. See project with:
   - Status: In Progress
   - Selected Freelancer: Ahmed Designer
   - Budget: $450
   - Deadline: 5 days

**Expected Result:**
- ✅ Project status updated
- ✅ Can track progress
- ✅ Can open chat with freelancer

---

### Phase 7: Project Completion

#### Step 7.1: Freelancer Delivers Final Work
**As Freelancer:**
1. Open conversation with client
2. Click **📎** to attach final files
3. Upload: `final_logo_package.zip`
4. Send message:
   ```
   تفضل الملفات النهائية!
   
   الحزمة تحتوي على:
   ✅ ملفات المصدر (AI, EPS)
   ✅ PNG بخلفية شفافة
   ✅ SVG للويب
   ✅ PDF عالي الجودة للطباعة
   ✅ دليل استخدام الشعار
   
   آمل أن ينال إعجابك!
   ```
5. Click **"تسليم المشروع"** (Deliver Project) button
   - Note: This button would be in the active projects page

**Expected Result:**
- ✅ Files uploaded
- ✅ Client notified of delivery
- ✅ Project status: Awaiting Review

---

#### Step 7.2: Client Reviews & Approves
**As Client:**
1. Receive notification: "تم تسليم المشروع"
2. Navigate to `/client/projects/1`
3. Download final files
4. Review all deliverables
5. Click **"إكمال المشروع"** (Complete Project)
6. Confirm completion

**System Actions:**
- Transfers $450 to freelancer's wallet
- Changes project status to "Completed"
- Creates transaction records:
  - Client wallet: -$450 (payment)
  - Freelancer wallet: +$450 (deposit)
- Prompts for review

**Expected Result:**
- ✅ Funds transferred
- ✅ Project marked as complete
- ✅ Review form displayed

---

### Phase 8: Rating & Review

#### Step 8.1: Client Leaves Review
1. On completion, review form appears
2. Fill review:
   - **Rating:** 5 stars ⭐⭐⭐⭐⭐
   - **Comment:**
     ```
     تجربة ممتازة! Ahmed مصمم محترف ومبدع.
     
     ✅ تسليم في الوقت المحدد
     ✅ جودة عمل استثنائية
     ✅ تواصل سريع واحترافي
     ✅ فهم عميق للمتطلبات
     
     أنصح بالتعامل معه بشدة!
     ```
3. Click **"إرسال التقييم"** (Submit Review)

**Expected Result:**
- ✅ Review saved
- ✅ Freelancer's average rating updated
- ✅ Review appears on freelancer's profile
- ✅ Completed projects count incremented

---

#### Step 8.2: Freelancer Views Review
**As Freelancer:**
1. Navigate to `/freelancer/profile`
2. View new review
3. See updated stats:
   - Rating: 4.9 → 5.0
   - Completed Projects: 127 → 128
   - Total Earnings: +$450

**Expected Result:**
- ✅ Review visible on profile
- ✅ Stats updated
- ✅ Earnings reflected in wallet

---

### Phase 9: Wallet & Withdrawals

#### Step 9.1: Freelancer Checks Wallet
**As Freelancer:**
1. From sidebar, click **"المحفظة"** (Wallet)
2. Navigate to `/freelancer/wallet`
3. View balance: $450
4. View transaction history:
   - **Date:** 2024-01-22
   - **Type:** Deposit
   - **Amount:** +$450
   - **Description:** "دفع من المشروع #1234"
   - **Status:** Completed

**Expected Result:**
- ✅ Balance displayed correctly
- ✅ Transaction history visible
- ✅ Can filter by date/type

---

#### Step 9.2: Freelancer Withdraws Funds
1. Click **"سحب الرصيد"** (Withdraw Funds)
2. Fill withdrawal form:
   - **Amount:** $400
   - **Method:** Bank Transfer
   - **Bank Account:** IBAN details
3. Click **"طلب السحب"** (Request Withdrawal)

**Expected Result:**
- ✅ Withdrawal request submitted
- ✅ Status: Pending (awaiting admin approval)
- ✅ New transaction record created

---

### Phase 10: Client Posts Another Project

#### Step 10.1: Hire the Same Freelancer
**As Client:**
1. Navigate to `/client/messages`
2. Click on Ahmed Designer conversation
3. Send message:
   ```
   مرحباً Ahmed،
   
   أنا سعيد جداً بعملك!
   
   لدي مشروع آخر (تصميم بطاقات أعمال).
   هل أنت متاح؟
   ```
4. Freelancer responds with offer
5. Client creates new project or agrees on direct hire

**Expected Result:**
- ✅ Repeat collaboration
- ✅ Built trust and relationship
- ✅ Platform facilitates ongoing work

---

## 📊 Complete User Journey Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT JOURNEY                            │
├─────────────────────────────────────────────────────────────┤
│ 1. Register as Client                                        │
│ 2. Create Project (Title, Description, Budget, Timeline)    │
│ 3. Publish Project                                          │
│ 4. Receive Offers from Freelancers                          │
│ 5. Review & Compare Offers                                  │
│ 6. Add Funds to Wallet                                      │
│ 7. Accept Best Offer                                        │
│ 8. Communicate via Messages                                 │
│ 9. Provide Feedback & Revisions                             │
│ 10. Review Deliverables                                     │
│ 11. Complete Project                                        │
│ 12. Leave Rating & Review                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  FREELANCER JOURNEY                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Register as Freelancer                                    │
│ 2. Build Portfolio                                          │
│ 3. Browse Available Projects                                │
│ 4. Filter by Category/Budget                                │
│ 5. View Project Details                                     │
│ 6. Submit Offer (Price, Timeline, Message)                  │
│ 7. Wait for Client Response                                 │
│ 8. Receive Acceptance Notification                          │
│ 9. Communicate via Messages                                 │
│ 10. Work on Project                                         │
│ 11. Share Progress Updates                                  │
│ 12. Deliver Final Work                                      │
│ 13. Receive Payment                                         │
│ 14. View Review & Rating                                    │
│ 15. Withdraw Earnings                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Testing Checklist

### Authentication & Registration
- [ ] Client registration works
- [ ] Freelancer registration works
- [ ] Login works for both roles
- [ ] Logout works
- [ ] Role switching works (for testing)

### Client Features
- [ ] Create new project (all steps)
- [ ] View my projects
- [ ] Filter projects by status
- [ ] View project details
- [ ] View received offers
- [ ] Accept/reject offers
- [ ] Add funds to wallet
- [ ] Send messages
- [ ] Complete project
- [ ] Leave review

### Freelancer Features
- [ ] View available projects
- [ ] Search/filter projects
- [ ] View project details
- [ ] Submit offer
- [ ] Build portfolio
- [ ] View active projects
- [ ] Send messages
- [ ] Deliver project
- [ ] View wallet balance
- [ ] Request withdrawal

### Messaging System
- [ ] Send text messages
- [ ] Send file attachments
- [ ] Real-time updates
- [ ] Unread count badges
- [ ] Message history
- [ ] Scroll functionality
- [ ] Online/offline status

### Wallet System
- [ ] Add funds (client)
- [ ] Deduct on offer acceptance
- [ ] Transfer on project completion
- [ ] View transaction history
- [ ] Request withdrawal (freelancer)

---

## 💡 Additional Scenarios

### Scenario 2: Hourly Project
- Client posts hourly project ($50/hr)
- Freelancer submits offer with estimated hours
- Track hours worked
- Weekly/milestone payments

### Scenario 3: Project Cancellation
- Client cancels before work starts
- Refund to wallet
- Notification to freelancer

### Scenario 4: Dispute Resolution
- Client unhappy with delivery
- Opens dispute
- Admin reviews
- Mediation or refund

### Scenario 5: Multiple Offers
- Client receives 15+ offers
- Compare and shortlist
- Message top candidates
- Negotiate before accepting

---

## 🚀 Quick Test Commands

```bash
# Start development server
npm run dev

# Access role switcher
http://localhost:3000/switch-role

# Client endpoints
/client/dashboard
/client/projects
/client/projects/new
/client/messages
/client/wallet

# Freelancer endpoints
/freelancer/dashboard
/freelancer/projects
/freelancer/portfolio
/freelancer/messages
/freelancer/active-projects
```

---

## 📝 Notes

- All dollar amounts are in USD
- Dates follow ISO format (YYYY-MM-DD)
- Arabic UI text with English content supported
- Mock data used for demonstration
- Replace with actual API calls in production

---

**Created for:** Fiverr Clone Platform Testing  
**Last Updated:** December 2025  
**Version:** 1.0

