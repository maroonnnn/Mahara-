# FreelanceHub - Project Planning Document

## 📋 Project Overview

FreelanceHub is a comprehensive freelance marketplace platform similar to Mahara, connecting service providers (freelancers) with clients seeking digital services.

### Core Services Categories:
1. **Programming & Technology** - Software development, web development, mobile apps
2. **Graphic Design** - Logos, branding, illustrations, UI/UX
3. **Data Analysis** - Data science, business intelligence, reporting
4. **Digital Marketing** - SEO, social media, content marketing
5. **Technical Support** - IT support, troubleshooting, maintenance
6. **Video & Animation** - Video editing, motion graphics, 3D animation

---

## 👥 User Types & Roles

### 1. Client (العميل)
**Responsibilities:**
- Create and publish projects
- Receive and review offers from freelancers
- Accept suitable offers
- Fund projects through wallet
- Communicate with freelancer during execution
- Complete projects and release payments
- Rate and review freelancers

### 2. Freelancer (المستقل)
**Responsibilities:**
- Browse open projects
- Submit offers with pricing and timeline
- Execute accepted projects
- Communicate with clients
- Receive payments to wallet
- Withdraw earnings

### 3. Admin (المدير)
**Responsibilities:**
- Monitor users and projects
- Review financial transactions
- Manage system settings
- Handle disputes
- View analytics and reports

---

## 🔄 Complete User Journey & Workflow

### Phase 1: Registration & Authentication
```
User → Registration Page → Select Role (Client/Freelancer) → Create Account
     → Wallet Created (Balance: 0.00) → Dashboard
```

### Phase 2: Client Posts Project
```
Client Dashboard → "New Project" Button → Fill Form:
  - Title
  - Category (dropdown)
  - Detailed Description
  - Estimated Budget
  - Required Duration
  - Attachments (optional)
→ Submit → Project Status: "open"
```

### Phase 3: Freelancer Browses & Submits Offer
```
Freelancer Dashboard → "Open Projects" → Filter by Category/Budget
→ Select Project → View Details → "Submit Offer" Button → Fill Form:
  - Proposed Amount
  - Expected Duration
  - Cover Message
→ Submit → Offer Status: "pending"
```

### Phase 4: Client Reviews & Accepts Offer
```
Client → My Projects → Select Project → View Offers
→ Compare (price, duration, ratings) → "Accept Offer"
→ Wallet Balance Check:
  - Insufficient? → Alert: "Please deposit funds"
  - Sufficient? → Deduct Amount → Transaction: "payment"
→ Project Status: "in_progress"
```

### Phase 5: Communication During Execution
```
Both Parties → Project Chat → Send Messages (text, files)
→ Real-time updates (Socket.io)
→ Message History stored in database
```

### Phase 6: Project Completion & Payment Release
```
Freelancer → Submit Deliverables → Notify Client
Client → Review Work → "Complete Project"
→ System Actions:
  - Update Project Status: "completed"
  - Transfer Amount to Freelancer Wallet
  - Transaction: "deposit"
  - Trigger Review Form
```

### Phase 7: Rating & Review
```
Client → Review Form → Rate (1-5 stars) + Comment
→ Submit → Store in Reviews Table
→ Update Freelancer's Average Rating
```

### Phase 8: Cancellation & Refund (Optional)
```
Client → "Cancel Project" (before work starts)
→ System Actions:
  - Refund Amount to Client Wallet
  - Transaction: "refund"
  - Project Status: "cancelled"
```

---

## 💰 Wallet System Architecture

### Wallet Components:
1. **Balance Display** - Current available funds
2. **Transaction History** - Detailed log of all operations
3. **Deposit Function** - Add funds (integration with payment gateway)
4. **Withdraw Function** - Transfer earnings (for freelancers)

### Transaction Types:
| Type | Description | User Type | Balance Effect |
|------|-------------|-----------|----------------|
| `deposit` | Add funds to wallet | Client/Freelancer | Increase (+) |
| `payment` | Pay for accepted offer | Client | Decrease (-) |
| `refund` | Return funds on cancellation | Client | Increase (+) |
| `withdraw` | Cash out earnings | Freelancer | Decrease (-) |
| `earning` | Receive payment for completed work | Freelancer | Increase (+) |

### Wallet Pages:
- **Wallet Overview** (`/wallet`) - Balance + recent transactions
- **Deposit** (`/wallet/deposit`) - Add funds form
- **Withdraw** (`/wallet/withdraw`) - Cash out form
- **Transaction History** (`/wallet/transactions`) - Full history with filters

---

## 🗄️ Database Schema (MySQL Backend)

### Tables Overview:

#### 1. users
```sql
- id (PK)
- name
- email (unique)
- password (hashed)
- role (enum: 'client', 'freelancer', 'admin')
- avatar
- bio
- skills (JSON for freelancers)
- rating (average rating)
- created_at
- updated_at
```

#### 2. categories
```sql
- id (PK)
- name (e.g., "Programming", "Design")
- slug
- description
- icon
- created_at
```

#### 3. projects
```sql
- id (PK)
- client_id (FK → users.id)
- category_id (FK → categories.id)
- title
- description
- budget
- duration (in days)
- status (enum: 'open', 'in_progress', 'completed', 'cancelled')
- accepted_offer_id (FK → offers.id, nullable)
- created_at
- updated_at
- completed_at
```

#### 4. offers
```sql
- id (PK)
- project_id (FK → projects.id)
- freelancer_id (FK → users.id)
- amount
- duration (in days)
- message
- status (enum: 'pending', 'accepted', 'rejected')
- created_at
- updated_at
```

#### 5. messages
```sql
- id (PK)
- project_id (FK → projects.id)
- sender_id (FK → users.id)
- receiver_id (FK → users.id)
- message
- attachment_url
- is_read (boolean)
- created_at
```

#### 6. reviews
```sql
- id (PK)
- project_id (FK → projects.id)
- client_id (FK → users.id)
- freelancer_id (FK → users.id)
- rating (1-5)
- comment
- created_at
```

#### 7. wallets
```sql
- id (PK)
- user_id (FK → users.id, unique)
- balance (decimal)
- created_at
- updated_at
```

#### 8. transactions
```sql
- id (PK)
- wallet_id (FK → wallets.id)
- type (enum: 'deposit', 'payment', 'refund', 'withdraw', 'earning')
- amount
- description
- project_id (FK → projects.id, nullable)
- status (enum: 'pending', 'completed', 'failed')
- created_at
```

---

## 📱 Frontend Pages Structure (Next.js)

### Public Pages (No Authentication Required)
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Landing page with hero, categories, how it works |
| `/login` | LoginPage | Login form |
| `/register` | RegisterPage | Registration with role selection |
| `/projects` | ProjectsPage | Browse all open projects (public view) |
| `/projects/[id]` | ProjectDetailsPage | View project details |
| `/freelancers` | FreelancersPage | Browse freelancer profiles |
| `/freelancers/[id]` | FreelancerProfile | View freelancer portfolio |
| `/about` | AboutPage | About the platform |
| `/contact` | ContactPage | Contact form |

### Client Dashboard Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/client/dashboard` | ClientDashboard | Overview, stats, recent projects |
| `/client/projects` | MyProjects | List of client's projects |
| `/client/projects/new` | AddProject | Create new project form |
| `/client/projects/[id]` | ProjectDetails | View project with offers |
| `/client/projects/[id]/offers` | OffersPage | List and compare offers |
| `/client/projects/[id]/chat` | ChatPage | Chat with freelancer |
| `/client/wallet` | WalletPage | Wallet overview |
| `/client/wallet/deposit` | DepositPage | Add funds |
| `/client/profile` | ClientProfile | Edit profile settings |

### Freelancer Dashboard Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/freelancer/dashboard` | FreelancerDashboard | Overview, earnings, active projects |
| `/freelancer/projects` | OpenProjects | Browse available projects |
| `/freelancer/projects/[id]` | ProjectDetails | View and submit offer |
| `/freelancer/my-offers` | MyOffers | Track submitted offers |
| `/freelancer/active-projects` | ActiveProjects | Projects in progress |
| `/freelancer/completed` | CompletedProjects | Finished projects with reviews |
| `/freelancer/projects/[id]/chat` | ChatPage | Chat with client |
| `/freelancer/wallet` | WalletPage | Wallet overview |
| `/freelancer/wallet/withdraw` | WithdrawPage | Cash out earnings |
| `/freelancer/profile` | FreelancerProfile | Edit profile, skills, portfolio |

### Admin Dashboard Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/admin/dashboard` | AdminDashboard | System statistics and analytics |
| `/admin/users` | UsersPage | Manage all users |
| `/admin/projects` | ProjectsPage | Monitor all projects |
| `/admin/transactions` | TransactionsPage | Financial transactions log |
| `/admin/categories` | CategoriesPage | Manage service categories |
| `/admin/reports` | ReportsPage | Dispute resolution |

---

## 🎨 Component Architecture

### Layout Components
```
/components/layout/
  - Header.js (navigation, user menu)
  - Footer.js
  - Sidebar.js (dashboard sidebar)
  - DashboardLayout.js (wrapper for dashboard pages)
  - PublicLayout.js (wrapper for public pages)
```

### Common Components
```
/components/common/
  - Button.js
  - Input.js
  - TextArea.js
  - Select.js
  - Card.js
  - Modal.js
  - Alert.js
  - Loading.js
  - Pagination.js
  - Badge.js
  - Avatar.js
  - FileUpload.js
  - SearchBar.js
  - FilterBar.js
```

### Feature Components
```
/components/projects/
  - ProjectCard.js (project preview card)
  - ProjectList.js (list of projects)
  - ProjectForm.js (create/edit project)
  - ProjectFilters.js (filter projects)
  - ProjectStats.js (project statistics)

/components/offers/
  - OfferCard.js (single offer display)
  - OfferList.js (list of offers)
  - OfferForm.js (submit offer form)
  - OfferComparison.js (compare multiple offers)

/components/chat/
  - ChatWindow.js (main chat interface)
  - MessageList.js (messages display)
  - MessageInput.js (send message form)
  - ChatHeader.js (chat header with user info)

/components/wallet/
  - WalletBalance.js (balance display)
  - TransactionList.js (transaction history)
  - TransactionItem.js (single transaction)
  - DepositForm.js (deposit funds)
  - WithdrawForm.js (withdraw funds)

/components/reviews/
  - ReviewCard.js (single review)
  - ReviewList.js (list of reviews)
  - ReviewForm.js (submit review)
  - RatingStars.js (star rating component)

/components/user/
  - UserCard.js (user profile card)
  - UserStats.js (user statistics)
  - ProfileForm.js (edit profile)
  - SkillsInput.js (manage skills for freelancers)
```

---

## 🔐 Authentication & Authorization

### Authentication Flow:
1. **Login/Register** → Send credentials to Laravel API
2. **API Response** → JWT token + user data
3. **Store Token** → LocalStorage + Context API
4. **Protected Routes** → HOC or middleware checks auth
5. **API Requests** → Axios interceptor adds token to headers

### Context Structure:
```javascript
// contexts/AuthContext.js
AuthContext provides:
  - user (current user object)
  - token (JWT token)
  - login(credentials)
  - register(data)
  - logout()
  - updateProfile(data)
  - isAuthenticated
  - isClient
  - isFreelancer
  - isAdmin
```

### Protected Routes:
```javascript
// components/ProtectedRoute.js
- Check if user is authenticated
- Check user role matches required role
- Redirect to login if not authenticated
- Redirect to 403 if wrong role
```

---

## 🌐 API Integration (Services Layer)

### Service Files Structure:
```
/services/
  - api.js (axios instance with base config)
  - authService.js (login, register, logout)
  - projectService.js (CRUD projects)
  - offerService.js (CRUD offers)
  - messageService.js (chat operations)
  - walletService.js (wallet operations)
  - reviewService.js (reviews)
  - categoryService.js (categories)
  - userService.js (user operations)
```

### Example API Endpoints:
```javascript
// Authentication
POST /api/register
POST /api/login
POST /api/logout
GET /api/user

// Projects
GET /api/projects (list all open projects)
POST /api/projects (create project)
GET /api/projects/{id}
PUT /api/projects/{id}
DELETE /api/projects/{id}
GET /api/my-projects (client's projects)

// Offers
GET /api/projects/{id}/offers (offers for a project)
POST /api/offers (submit offer)
PUT /api/offers/{id}/accept (accept offer)
PUT /api/offers/{id}/reject
GET /api/my-offers (freelancer's offers)

// Messages
GET /api/projects/{id}/messages
POST /api/messages
PUT /api/messages/{id}/read

// Wallet
GET /api/wallet
POST /api/wallet/deposit
POST /api/wallet/withdraw
GET /api/wallet/transactions

// Reviews
POST /api/reviews
GET /api/users/{id}/reviews

// Categories
GET /api/categories
```

---

## 🎨 Design System & Styling

### Color Scheme:
- **Primary Color**: Green (#22c55e) - Success, action buttons
- **Secondary Color**: Gray (#78716c) - Text, borders
- **Accent Colors**:
  - Success: Green (#10b981)
  - Warning: Yellow (#f59e0b)
  - Error: Red (#ef4444)
  - Info: Blue (#3b82f6)

### Typography:
- **Font Family**: Inter, system-ui, sans-serif
- **Headings**: Bold, larger sizes
- **Body**: Regular weight, readable line height

### Components Styling Approach:
- **Tailwind CSS** for utility classes
- **CSS Modules** for component-specific styles
- **Responsive Design** - Mobile-first approach

---

## 🚀 Development Phases

### Phase 1: Setup & Foundation (Week 1)
- [x] Initialize Next.js project
- [ ] Set up Tailwind CSS
- [ ] Create folder structure
- [ ] Configure API connection
- [ ] Set up authentication context

### Phase 2: Authentication & User Management (Week 2)
- [ ] Build login/register pages
- [ ] Implement authentication flow
- [ ] Create protected routes
- [ ] Build user profile pages

### Phase 3: Core Features - Projects (Week 3-4)
- [ ] Build project listing page
- [ ] Create project form
- [ ] Implement project details page
- [ ] Add project filters and search

### Phase 4: Core Features - Offers (Week 5)
- [ ] Build offer submission form
- [ ] Create offers list component
- [ ] Implement offer acceptance flow
- [ ] Add offer comparison feature

### Phase 5: Wallet System (Week 6)
- [ ] Build wallet overview page
- [ ] Implement deposit functionality
- [ ] Create withdraw feature
- [ ] Build transaction history

### Phase 6: Communication (Week 7)
- [ ] Build chat interface
- [ ] Integrate Socket.io for real-time messages
- [ ] Implement message notifications
- [ ] Add file sharing in chat

### Phase 7: Reviews & Ratings (Week 8)
- [ ] Create review form
- [ ] Build reviews display
- [ ] Implement rating calculation
- [ ] Show ratings on profiles

### Phase 8: Admin Panel (Week 9)
- [ ] Build admin dashboard
- [ ] Create user management interface
- [ ] Implement transaction monitoring
- [ ] Add analytics and reports

### Phase 9: Polish & Testing (Week 10)
- [ ] Responsive design testing
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Bug fixes and refinements

---

## 📦 Key Features Checklist

### Must-Have Features (MVP):
- [x] User authentication (login/register)
- [ ] Role-based access (client/freelancer/admin)
- [ ] Project creation and management
- [ ] Offer submission and acceptance
- [ ] Basic wallet system (deposit/withdraw)
- [ ] Project chat
- [ ] Review and rating system
- [ ] User profiles

### Nice-to-Have Features (Future):
- [ ] Email notifications
- [ ] Advanced search with filters
- [ ] Freelancer portfolio showcase
- [ ] Saved projects/favorites
- [ ] Dispute resolution system
- [ ] Multi-currency support
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] File preview in chat
- [ ] Project milestones
- [ ] Automated escrow system
- [ ] Mobile app (React Native)

---

## 🔧 Technical Stack Summary

**Frontend:**
- Next.js 14 (without TypeScript)
- React 18
- Tailwind CSS
- Axios for API calls
- Socket.io-client for real-time chat
- React Icons
- React Toastify for notifications
- date-fns for date formatting

**Backend (Separate Laravel Project):**
- Laravel 10
- MySQL Database
- Laravel Sanctum for API authentication
- Laravel Broadcasting for real-time features
- Laravel Queue for background jobs

---

## 📝 Notes & Best Practices

1. **State Management**: Use React Context API for global state (auth, user data)
2. **Form Validation**: Client-side validation + backend validation
3. **Error Handling**: Consistent error messages, user-friendly alerts
4. **Loading States**: Show loading indicators during API calls
5. **SEO**: Use Next.js Head component for meta tags
6. **Security**: Never store sensitive data in localStorage, use httpOnly cookies if possible
7. **Responsive Design**: Test on mobile, tablet, desktop
8. **Accessibility**: Use semantic HTML, ARIA labels
9. **Code Organization**: Keep components small and reusable
10. **API Calls**: Centralize in service files, use interceptors for auth

---

## 🎯 Success Metrics

- User registration and retention rate
- Number of projects posted
- Offer acceptance rate
- Average project completion time
- User satisfaction ratings
- Transaction volume
- Platform revenue (commission on transactions)

---

This comprehensive plan provides a solid foundation for building your FreelanceHub platform. Let's start implementing! 🚀

