# Wallet/Budget Pages Guide

## Overview
Both customers and sellers have dedicated wallet pages to manage their finances, with features tailored to their specific needs.

---

## 🔗 Wallet Page URLs

### Customer Wallet
- **URL**: `/client/wallet`
- **Route**: `pages/client/wallet.js`
- **Purpose**: Add funds, make payments, view spending

### Seller Wallet  
- **URL**: `/freelancer/wallet`
- **Route**: `pages/freelancer/wallet.js`
- **Purpose**: View earnings, withdraw money, track income

---

## 💰 Customer Wallet Features

### Main Features:
1. **Balance Display**
   - Current balance in large card
   - Visual gradient design

2. **Quick Actions**
   - Add funds button
   - Withdraw button

3. **Transaction History**
   - List of all transactions
   - Payment indicators (red arrows down)
   - Refund indicators (green arrows up)
   - Transaction status badges

### Transaction Types for Customers:
- **Payment** (-): Money spent on projects
- **Refund** (+): Money returned from cancelled projects
- **Deposit** (+): Money added to wallet

---

## 💼 Seller Wallet Features

### Main Features:

#### 1. **Triple Balance Display**
```
┌─────────────────────────────────────────┐
│ Available Balance: $2,850               │
│ (Can withdraw now)                      │
├─────────────────────────────────────────┤
│ Pending Balance: $450                   │
│ (From ongoing projects)                 │
├─────────────────────────────────────────┤
│ Total Balance: $3,300                   │
│ (Available + Pending)                   │
└─────────────────────────────────────────┘
```

#### 2. **Earnings Statistics**
- Total earnings (all time)
- Earnings this month
- Projects completed
- Average earning per project

#### 3. **Withdrawal System**
- **Withdraw Modal** with form
- Multiple withdrawal methods:
  - Bank Transfer
  - PayPal
  - Payoneer
- Automatic fee calculation (2%)
- Real-time withdrawal amount preview
- Minimum withdrawal: $50

#### 4. **Transaction History**
Shows different transaction types:
- **Earnings** (+): Money earned from projects
- **Withdrawals** (-): Money withdrawn to bank/PayPal
- **Pending** (⏱): Money waiting from active projects

#### 5. **Withdrawal Information Panel**
- Minimum withdrawal amount
- Fees structure
- Processing time
- Available withdrawal methods
- Daily withdrawal limits

---

## 🎯 Key Differences

| Feature | Customer | Seller |
|---------|:--------:|:------:|
| Single Balance Card | ✅ | ❌ |
| Triple Balance (Available/Pending/Total) | ❌ | ✅ |
| Add Funds | ✅ | ❌ |
| Withdraw Funds | ✅ | ✅ |
| Earnings Stats | ❌ | ✅ |
| Project Earnings Tracking | ❌ | ✅ |
| Withdrawal Methods Selection | ❌ | ✅ |
| Fee Calculator | ❌ | ✅ |
| Transaction History | ✅ | ✅ |

---

## 💵 Seller Withdrawal Process

### Step-by-Step:

1. **Check Available Balance**
   - Must have at least $50 available

2. **Click "سحب الرصيد" (Withdraw) Button**
   - Opens withdrawal modal

3. **Enter Withdrawal Amount**
   - Type amount in USD
   - Must be ≥ $50
   - Cannot exceed available balance

4. **Select Withdrawal Method**
   - Bank Transfer
   - PayPal
   - Payoneer

5. **Review Calculation**
   ```
   Amount:            $500.00
   Fee (2%):          -$10.00
   ─────────────────────────
   You'll Receive:    $490.00
   ```

6. **Confirm Withdrawal**
   - Click "تأكيد السحب" button
   - Success message appears
   - Processing takes 3-5 business days

---

## 📊 Seller Balance Types

### 1. Available Balance (Green Card)
- Money you can withdraw **right now**
- From completed projects where payment has cleared
- Can be used immediately

### 2. Pending Balance (Yellow Card)
- Money from **ongoing projects**
- Will become available when:
  - Project is completed
  - Client marks project as done
  - Escrow releases payment
- Usually takes 7-14 days after project completion

### 3. Total Balance (Blue Card)
- Sum of Available + Pending
- Shows your total earnings waiting

---

## 🎨 Visual Design

### Customer Wallet:
- **Primary Color**: Green gradient
- **Layout**: Simple, clean
- **Focus**: Easy payments

### Seller Wallet:
- **Three-card layout**: Green, Yellow, Blue
- **Stats dashboard**: 4 stat cards
- **Rich details**: Project references, methods
- **Focus**: Earnings tracking and withdrawals

---

## 🔒 Security & Limits

### Withdrawal Limits:
- **Minimum**: $50 per withdrawal
- **Maximum**: Available balance
- **Frequency**: 1 withdrawal per 24 hours
- **Fee**: 2% (minimum $1)

### Processing Times:
- **Bank Transfer**: 3-5 business days
- **PayPal**: 1-2 business days
- **Payoneer**: 2-3 business days

---

## 📱 Transaction Icons

### In Customer Wallet:
- 🔴 **Red Down Arrow**: Payment (money out)
- 🟢 **Green Up Arrow**: Refund (money in)

### In Seller Wallet:
- 🟢 **Green Up Arrow**: Earnings (money in)
- 🔵 **Blue Down Arrow**: Withdrawal (money out)
- 🟡 **Yellow Clock**: Pending (waiting)

---

## 🚀 How to Access

### As a Customer:
1. Login as a client
2. Click **"المحفظة"** in the sidebar
3. Or navigate to: `http://localhost:3000/client/wallet`

### As a Seller:
1. Login as a freelancer
2. Click **"المحفظة"** in the sidebar
3. Or navigate to: `http://localhost:3000/freelancer/wallet`

---

## 💡 Mock Data

### Customer Wallet Shows:
- Current Balance: $1,200
- 3 sample transactions

### Seller Wallet Shows:
- Available: $2,850
- Pending: $450
- Total: $3,300
- Total Earnings: $12,500
- This Month: $2,850
- 24 Projects Completed
- Average: $520 per project
- 5 sample transactions

---

## 🔧 Future Enhancements

### Planned Features:
1. **Multiple Currencies**
   - Support for SAR, EUR, GBP
   - Auto currency conversion

2. **Payment Methods**
   - Credit/Debit cards
   - Apple Pay / Google Pay
   - Crypto payments

3. **Detailed Reports**
   - Monthly earnings reports
   - Tax documents
   - Downloadable statements
   - Charts and graphs

4. **Automatic Withdrawals**
   - Set minimum threshold
   - Auto-withdraw when reached
   - Scheduled withdrawals

5. **Savings Goals**
   - Set financial goals
   - Track progress
   - Milestone celebrations

6. **Transaction Filters**
   - Filter by date range
   - Filter by type
   - Filter by project
   - Search transactions

7. **Invoice Generation**
   - Generate invoices for clients
   - PDF download
   - Email invoices

---

## 🐛 Troubleshooting

### Issue: 404 Error on Wallet Page
**Solution**: Make sure you're accessing the correct URL:
- Customer: `/client/wallet` ✅
- Seller: `/freelancer/wallet` ✅

### Issue: Can't Withdraw Money
**Possible Causes**:
1. Amount less than $50 minimum
2. Amount exceeds available balance
3. Already withdrew in last 24 hours
4. Payment method not configured

### Issue: Pending Balance Not Updating
**Solution**: 
- Pending balance updates when:
  - Project is marked complete
  - Client approves work
  - Usually takes 7-14 days

---

## 📝 Code Example

### Handling Withdrawal:

```javascript
const handleWithdraw = (e) => {
  e.preventDefault();
  
  // Validate amount
  if (parseFloat(withdrawAmount) > balance.available) {
    alert('❌ الرصيد المتاح غير كافٍ للسحب');
    return;
  }
  
  if (parseFloat(withdrawAmount) < 50) {
    alert('❌ الحد الأدنى للسحب هو 50 دولار');
    return;
  }
  
  // Process withdrawal
  alert('✅ تم طلب السحب بنجاح!');
  setShowWithdrawModal(false);
};
```

---

## 📊 Balance Calculation Example

```javascript
const balance = {
  available: 2850,    // Can withdraw now
  pending: 450,       // From ongoing projects
  total: 3300         // available + pending
};

// Withdrawal with fee
const withdrawAmount = 500;
const fee = withdrawAmount * 0.02;  // 2%
const youReceive = withdrawAmount - fee;

// Result:
// You withdraw: $500
// Fee: -$10 (2%)
// You receive: $490
```

---

**Last Updated**: December 2024
**Version**: 1.0

