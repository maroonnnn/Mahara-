# Customer Service Request Workflow Guide

## Overview
This guide explains how customers can request services and how sellers (freelancers) can view and respond to these requests with offers.

---

## 🔄 Complete Workflow

### Step 1: Customer Creates a Service Request (Project)

**As a Customer:**

1. **Navigate to Project Creation**
   - Go to your dashboard at `/client/dashboard`
   - Click on **"New Project"** button
   - Or go directly to `/client/projects/new`

2. **Fill Out the Service Request Form** (3 Steps)
   
   **Step 1: Project Details**
   - **Title**: Enter a clear title (e.g., "Design a professional logo for my company")
   - **Category**: Choose the service category (e.g., Graphics & Design)
   - **Subcategory**: Select the specific service (e.g., Logo Design)
   - **Description**: Provide detailed requirements, goals, and expectations
   - **Skills**: Add required skills (e.g., Photoshop, Illustrator)
   - **Attachments**: Optionally upload reference files
   
   **Step 2: Budget & Timeline**
   - **Budget Type**: Fixed price or Hourly rate
   - **Budget Amount**: Set your budget in USD
   - **Delivery Time**: Specify expected completion time
   - **Additional Info**: Any extra details
   
   **Step 3: Review & Publish**
   - Review all information
   - Click **"Publish Project"**
   - Your project is now **LIVE** and visible to all freelancers!

3. **After Publishing**
   - Your project appears in the freelancer marketplace immediately
   - Status: **"Open"** - Ready to receive offers
   - Freelancers can now view your project and submit offers

---

### Step 2: Seller (Freelancer) Discovers Service Request

**As a Freelancer/Seller:**

1. **Browse Available Projects**
   - Go to `/freelancer/projects` or `/freelancer/dashboard`
   - You'll see all **open projects** posted by customers
   - Use search and filters to find relevant projects

2. **View Project Details**
   - Click on any project to see full details at `/freelancer/projects/[id]`
   - Review:
     - Project description and requirements
     - Budget and timeline
     - Required skills
     - Customer information and rating

3. **Submit an Offer**
   - Click **"Submit Offer"** button
   - Fill out the offer form:
     - **Proposed Amount**: Your price for the service
     - **Delivery Duration**: How long it will take you
     - **Offer Message**: Explain why you're the best fit
   - Click **"Send Offer"**
   - Customer receives notification about your offer!

---

### Step 3: Customer Reviews Offers

**As a Customer:**

1. **View Your Project**
   - Go to `/client/projects`
   - Click on your project to open details at `/client/projects/[id]`

2. **Review Received Offers**
   - Click on **"Offers"** tab
   - You'll see all offers from freelancers including:
     - Freelancer name, rating, and completed projects
     - Proposed price and delivery time
     - Offer message explaining their qualifications
   
3. **Choose the Best Offer**
   - **Accept**: Click "Accept Offer" to hire the freelancer
   - **Message**: Click "Message" to ask questions first
   - **Reject**: Click "Reject" if the offer doesn't fit

4. **After Accepting**
   - Project status changes to **"In Progress"**
   - Freelancer is notified and can start work
   - Payment is held in escrow
   - You can communicate via the messaging system

---

## 📊 Complete Flow Diagram

```
CUSTOMER                           SYSTEM                        SELLER
   │                                 │                             │
   │ 1. Create Project               │                             │
   ├────────────────────────────────>│                             │
   │                                 │                             │
   │                                 │ 2. Project appears          │
   │                                 │ in marketplace              │
   │                                 ├────────────────────────────>│
   │                                 │                             │
   │                                 │                             │ 3. Browse projects
   │                                 │                             │ View details
   │                                 │                             │
   │                                 │ 4. Submit offer             │
   │                                 │<────────────────────────────┤
   │                                 │                             │
   │ 5. Receive notification         │                             │
   │<────────────────────────────────┤                             │
   │                                 │                             │
   │ 6. Review offers                │                             │
   │ Accept best offer               │                             │
   ├────────────────────────────────>│                             │
   │                                 │                             │
   │                                 │ 7. Notify seller            │
   │                                 ├────────────────────────────>│
   │                                 │                             │
   │                                 │                             │ 8. Start work
   │ 9. Communicate & collaborate    │<───────────────────────────>│
   │<───────────────────────────────────────────────────────────>│
   │                                 │                             │
```

---

## 🎯 Key Pages & Routes

### Customer Routes
- **Dashboard**: `/client/dashboard`
- **Create New Project**: `/client/projects/new`
- **My Projects**: `/client/projects`
- **Project Details & Offers**: `/client/projects/[id]`
- **Messages**: `/client/messages`
- **Wallet**: `/client/wallet`

### Seller/Freelancer Routes
- **Dashboard**: `/freelancer/dashboard`
- **Browse Projects**: `/freelancer/projects`
- **Project Details**: `/freelancer/projects/[id]`
- **My Offers**: `/freelancer/dashboard` (shows submitted offers)
- **Active Projects**: `/freelancer/active-projects`
- **Messages**: `/freelancer/messages`

---

## 💡 Tips for Success

### For Customers
✅ **Write clear descriptions**: The more details you provide, the better offers you'll receive
✅ **Set realistic budgets**: Research market rates for your service
✅ **Be responsive**: Reply to questions from freelancers quickly
✅ **Review portfolios**: Check freelancer ratings and completed projects
✅ **Communicate clearly**: Use the messaging system to clarify requirements

### For Sellers/Freelancers
✅ **Browse regularly**: New projects are posted daily
✅ **Submit competitive offers**: Price competitively but fairly
✅ **Write compelling messages**: Explain your relevant experience
✅ **Respond quickly**: Be among the first to submit an offer
✅ **Build your profile**: Complete projects to improve your rating

---

## 🔧 Technical Implementation

### API Endpoints Used

**Customer Side:**
```javascript
// Create a project
POST /api/projects
{
  title, category, subcategory, description,
  budget, budgetType, deliveryTime, skills
}

// Get project with offers
GET /api/projects/:id
GET /api/projects/:id/offers
```

**Seller Side:**
```javascript
// Get all open projects
GET /api/projects?status=open

// Submit an offer
POST /api/offers
{
  project_id, amount, duration, message
}
```

### Services Used
- **projectService.js**: Project CRUD operations
- **offerService.js**: Offer submission and management
- **messageService.js**: Communication between parties
- **walletService.js**: Payment handling

---

## 🚀 Getting Started

1. **For Customers**: 
   - Register/Login as a Client
   - Click "New Project" from your dashboard
   - Follow the 3-step form
   - Wait for freelancers to send offers

2. **For Sellers**:
   - Register/Login as a Freelancer
   - Go to "Browse Projects"
   - Find projects matching your skills
   - Submit competitive offers

---

## 📝 Example Scenario

**Customer**: Sarah needs a logo for her startup
1. Sarah creates a project: "Modern Logo Design for Tech Startup"
2. Budget: $500, Timeline: 7 days
3. Publishes the project

**Sellers**: Multiple freelancers see the project
1. Ahmed (Rating 4.9): Offers $450 in 5 days
2. Sara (Rating 5.0): Offers $500 in 7 days
3. Omar (Rating 4.7): Offers $380 in 4 days

**Customer Decision**: Sarah reviews all offers
1. Checks each freelancer's portfolio
2. Messages Sara to discuss design style
3. Accepts Sara's offer
4. Project begins!

---

## ❓ FAQ

**Q: How many offers can I receive?**
A: Unlimited! The more offers, the better your chances of finding the perfect freelancer.

**Q: Can I edit my project after publishing?**
A: Yes, you can update project details from the project page.

**Q: What happens after I accept an offer?**
A: The project status changes to "In Progress" and the freelancer can start working. Funds are held in escrow.

**Q: Can I accept multiple offers for one project?**
A: No, you can only accept one offer per project.

**Q: How do I pay the freelancer?**
A: Payment is processed through the wallet system when you accept an offer.

---

## 🆘 Support

If you need help:
- Check the messaging system for direct communication
- Review project guidelines
- Contact platform support

---

**Last Updated**: December 2024
**Version**: 1.0

