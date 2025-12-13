# Components Structure Guide

This document provides a comprehensive guide to all components in the FreelanceHub application.

## 📁 Component Directory Structure

```
components/
├── layout/
│   ├── Header.js              - Main navigation header
│   ├── Footer.js              - Footer with links and social media
│   ├── Sidebar.js             - Dashboard sidebar navigation
│   ├── PublicLayout.js        - Layout wrapper for public pages
│   └── DashboardLayout.js     - Layout wrapper for dashboard pages
│
├── common/
│   ├── Button.js              - Reusable button component
│   ├── Input.js               - Text input field
│   ├── TextArea.js            - Textarea field
│   ├── Select.js              - Dropdown select
│   ├── Card.js                - Card container
│   ├── Modal.js               - Modal dialog
│   ├── Alert.js               - Alert/notification component
│   ├── Loading.js             - Loading spinner
│   ├── Pagination.js          - Pagination component
│   ├── Badge.js               - Status badge
│   ├── Avatar.js              - User avatar
│   ├── FileUpload.js          - File upload component
│   ├── SearchBar.js           - Search input
│   └── FilterBar.js           - Filter controls
│
├── projects/
│   ├── ProjectCard.js         - Project preview card
│   ├── ProjectList.js         - List of projects
│   ├── ProjectForm.js         - Create/edit project form
│   ├── ProjectFilters.js      - Project filtering controls
│   └── ProjectStats.js        - Project statistics display
│
├── offers/
│   ├── OfferCard.js           - Single offer display
│   ├── OfferList.js           - List of offers
│   ├── OfferForm.js           - Submit offer form
│   └── OfferComparison.js     - Compare multiple offers
│
├── chat/
│   ├── ChatWindow.js          - Main chat interface
│   ├── MessageList.js         - Messages display
│   ├── MessageInput.js        - Send message form
│   └── ChatHeader.js          - Chat header with user info
│
├── wallet/
│   ├── WalletBalance.js       - Balance display
│   ├── TransactionList.js     - Transaction history
│   ├── TransactionItem.js     - Single transaction
│   ├── DepositForm.js         - Deposit funds form
│   └── WithdrawForm.js        - Withdraw funds form
│
├── reviews/
│   ├── ReviewCard.js          - Single review display
│   ├── ReviewList.js          - List of reviews
│   ├── ReviewForm.js          - Submit review form
│   └── RatingStars.js         - Star rating component
│
└── user/
    ├── UserCard.js            - User profile card
    ├── UserStats.js           - User statistics
    ├── ProfileForm.js         - Edit profile form
    └── SkillsInput.js         - Manage skills (freelancers)
```

---

## 🎨 Layout Components

### PublicLayout
Wrapper for public pages (home, login, register, etc.)
- Includes Header and Footer
- Full-width content area

**Usage:**
```javascript
import PublicLayout from '../components/layout/PublicLayout';

export default function MyPage() {
  return (
    <PublicLayout>
      <div>Your content here</div>
    </PublicLayout>
  );
}
```

### DashboardLayout
Wrapper for authenticated dashboard pages
- Includes Header and Sidebar
- Protected route check
- Role-based access control

**Props:**
- `requiredRole` (string): 'client', 'freelancer', or 'admin'

**Usage:**
```javascript
import DashboardLayout from '../components/layout/DashboardLayout';

export default function ClientDashboard() {
  return (
    <DashboardLayout requiredRole="client">
      <div>Dashboard content</div>
    </DashboardLayout>
  );
}
```

### Header
Main navigation header
- Logo and navigation links
- User menu (when authenticated)
- Mobile responsive menu

### Sidebar
Dashboard navigation sidebar
- Dynamic menu based on user role
- Active link highlighting
- Icons for each menu item

### Footer
Footer with links and information
- Quick links
- Categories
- Social media icons
- Copyright notice

---

## 🔧 Common Components

### Button
Reusable button component with multiple variants

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'danger'
- `type`: 'button' | 'submit' | 'reset'
- `disabled`: boolean
- `fullWidth`: boolean
- `onClick`: function
- `className`: string

**Usage:**
```javascript
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

### Input
Text input field with label and error handling

**Props:**
- `label`: string
- `type`: 'text' | 'email' | 'password' | 'number'
- `name`: string
- `value`: string
- `onChange`: function
- `placeholder`: string
- `required`: boolean
- `error`: string

**Usage:**
```javascript
<Input
  label="الاسم"
  name="name"
  value={formData.name}
  onChange={handleChange}
  required
  error={errors.name}
/>
```

### TextArea
Multi-line text input

**Props:** Similar to Input + `rows` (number)

### Select
Dropdown select component

**Props:**
- All Input props plus:
- `options`: Array of {value, label}

**Usage:**
```javascript
<Select
  label="الفئة"
  name="category"
  value={formData.category}
  onChange={handleChange}
  options={categoryOptions}
  required
/>
```

### Card
Container with shadow and rounded corners

**Props:**
- `hover`: boolean (adds hover effect)
- `className`: string

**Usage:**
```javascript
<Card hover>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

### Modal
Modal dialog overlay

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl'

**Usage:**
```javascript
<Modal isOpen={isOpen} onClose={handleClose} title="عنوان النافذة">
  <div>Modal content</div>
</Modal>
```

### Loading
Loading spinner with message

**Usage:**
```javascript
<Loading />
```

### Badge
Status badge component

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

**Usage:**
```javascript
<Badge variant="success">مكتمل</Badge>
```

---

## 📊 Project Components

### ProjectCard
Preview card for a single project

**Props:**
- `project`: Project object
- `onClick`: function (optional)

**Usage:**
```javascript
<ProjectCard project={projectData} onClick={handleClick} />
```

### ProjectList
Grid/list of project cards

**Props:**
- `projects`: Array of projects
- `loading`: boolean

### ProjectForm
Form to create or edit a project

**Props:**
- `initialData`: Project object (for editing)
- `onSubmit`: function
- `categories`: Array of categories

### ProjectFilters
Filter controls for project list

**Props:**
- `onFilterChange`: function
- `categories`: Array of categories

---

## 💼 Offer Components

### OfferCard
Display a single offer

**Props:**
- `offer`: Offer object
- `onAccept`: function (for client)
- `onReject`: function (for client)

### OfferList
List of offers for a project

**Props:**
- `offers`: Array of offers
- `onAccept`: function
- `onReject`: function

### OfferForm
Form to submit an offer

**Props:**
- `projectId`: number
- `onSubmit`: function

### OfferComparison
Compare multiple offers side-by-side

**Props:**
- `offers`: Array of offers
- `onSelect`: function

---

## 💬 Chat Components

### ChatWindow
Main chat interface

**Props:**
- `projectId`: number
- `recipientId`: number

### MessageList
Display chat messages

**Props:**
- `messages`: Array of messages
- `currentUserId`: number

### MessageInput
Form to send a message

**Props:**
- `onSend`: function
- `disabled`: boolean

### ChatHeader
Header with recipient info

**Props:**
- `recipient`: User object
- `projectTitle`: string

---

## 💰 Wallet Components

### WalletBalance
Display current wallet balance

**Props:**
- `balance`: number
- `onDeposit`: function
- `onWithdraw`: function

### TransactionList
List of transactions

**Props:**
- `transactions`: Array of transactions
- `loading`: boolean

### TransactionItem
Single transaction row

**Props:**
- `transaction`: Transaction object

### DepositForm
Form to deposit funds

**Props:**
- `onSubmit`: function

### WithdrawForm
Form to withdraw funds

**Props:**
- `onSubmit`: function
- `maxAmount`: number

---

## ⭐ Review Components

### ReviewCard
Display a single review

**Props:**
- `review`: Review object

### ReviewList
List of reviews

**Props:**
- `reviews`: Array of reviews
- `averageRating`: number

### ReviewForm
Form to submit a review

**Props:**
- `projectId`: number
- `freelancerId`: number
- `onSubmit`: function

### RatingStars
Interactive star rating

**Props:**
- `rating`: number (0-5)
- `onChange`: function (optional, for input)
- `size`: 'sm' | 'md' | 'lg'
- `readonly`: boolean

**Usage:**
```javascript
// Display only
<RatingStars rating={4.5} readonly />

// Interactive
<RatingStars rating={rating} onChange={setRating} />
```

---

## 👤 User Components

### UserCard
User profile card

**Props:**
- `user`: User object
- `showActions`: boolean

### UserStats
Display user statistics

**Props:**
- `stats`: Object with statistics

### ProfileForm
Edit profile form

**Props:**
- `user`: User object
- `onSubmit`: function

### SkillsInput
Manage freelancer skills

**Props:**
- `skills`: Array of strings
- `onChange`: function

---

## 🎯 Component Best Practices

1. **Prop Types**: All components should validate props (consider using PropTypes)
2. **Default Props**: Provide sensible defaults
3. **Error Handling**: Handle errors gracefully
4. **Loading States**: Show loading indicators during async operations
5. **Accessibility**: Use semantic HTML and ARIA labels
6. **Responsive Design**: All components should work on mobile
7. **Reusability**: Keep components generic and reusable
8. **Single Responsibility**: Each component should do one thing well
9. **Composition**: Prefer composition over inheritance
10. **Documentation**: Document complex components

---

## 🚀 Next Steps for Implementation

### Phase 1: Core Components (Priority: HIGH)
- [x] Layout components (Header, Footer, Sidebar)
- [x] Common components (Button, Input, Card, Modal)
- [x] Loading component

### Phase 2: Feature Components (Priority: HIGH)
- [ ] Project components (Card, List, Form, Filters)
- [ ] Offer components (Card, List, Form)
- [ ] Wallet components (Balance, Transaction List)

### Phase 3: Advanced Components (Priority: MEDIUM)
- [ ] Chat components (ChatWindow, MessageList)
- [ ] Review components (ReviewForm, RatingStars)
- [ ] User components (UserCard, ProfileForm)

### Phase 4: Polish & Optimization (Priority: LOW)
- [ ] Add animations and transitions
- [ ] Optimize performance
- [ ] Add unit tests
- [ ] Improve accessibility

---

This guide will be updated as new components are added or existing ones are modified.

