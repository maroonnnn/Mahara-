# FreelanceHub - Frontend

A comprehensive freelance marketplace platform built with **Next.js** (without TypeScript), similar to Fiverr, connecting service providers (freelancers) with clients seeking digital services.

## 📋 Project Overview

FreelanceHub is a full-featured platform that enables:
- **Clients** to post projects and hire freelancers
- **Freelancers** to browse projects and submit offers
- **Secure wallet system** for payments
- **Real-time chat** for communication
- **Review & rating system** for quality assurance
- **Admin dashboard** for platform management

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Laravel backend API running (see backend repository)
- MySQL database configured

### Installation

1. **Clone the repository**
```bash
cd Front-end
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory:
```env
API_BASE_URL=http://localhost:8000/api
SOCKET_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=FreelanceHub
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Front-end/
├── components/           # Reusable React components
│   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   ├── common/          # Common UI components (Button, Input, Modal)
│   ├── projects/        # Project-related components
│   ├── offers/          # Offer-related components
│   ├── chat/            # Chat components
│   ├── wallet/          # Wallet components
│   ├── reviews/         # Review components
│   └── user/            # User components
│
├── contexts/            # React Context providers
│   └── AuthContext.js   # Authentication context
│
├── pages/               # Next.js pages (routes)
│   ├── _app.js         # App wrapper
│   ├── _document.js    # Document wrapper
│   ├── index.js        # Home page
│   ├── login.js        # Login page
│   ├── register.js     # Register page
│   ├── client/         # Client dashboard pages
│   ├── freelancer/     # Freelancer dashboard pages
│   └── admin/          # Admin dashboard pages
│
├── services/            # API service layer
│   ├── api.js          # Axios instance
│   ├── authService.js  # Authentication API
│   ├── projectService.js   # Projects API
│   ├── offerService.js     # Offers API
│   ├── walletService.js    # Wallet API
│   ├── messageService.js   # Messages API
│   └── reviewService.js    # Reviews API
│
├── styles/              # Global styles
│   └── globals.css     # Global CSS with Tailwind
│
├── public/              # Static files
│
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── package.json         # Dependencies
├── PROJECT_PLAN.md      # Comprehensive project planning document
└── COMPONENTS_GUIDE.md  # Component documentation
```

## 🎯 Core Features

### 1. User Authentication
- Registration with role selection (Client/Freelancer)
- Login/Logout functionality
- JWT token-based authentication
- Protected routes based on user roles

### 2. Client Features
- Create and manage projects
- Receive and review offers from freelancers
- Accept offers and fund projects
- Real-time chat with freelancers
- Complete projects and release payments
- Rate and review freelancers
- Wallet management (deposit, transactions)

### 3. Freelancer Features
- Browse open projects with filters
- Submit offers with custom pricing
- Track submitted offers
- Work on accepted projects
- Real-time chat with clients
- Receive payments to wallet
- Withdraw earnings
- Build profile and portfolio

### 4. Wallet System
- View balance and transaction history
- Deposit funds (clients)
- Withdraw earnings (freelancers)
- Secure transaction tracking
- Transaction types: deposit, payment, refund, withdraw, earning

### 5. Communication
- Real-time chat using Socket.io
- Message history
- File sharing (coming soon)
- Notifications

### 6. Reviews & Ratings
- 5-star rating system
- Written reviews
- Average rating calculation
- Display on user profiles

### 7. Admin Dashboard
- User management
- Project monitoring
- Transaction tracking
- System analytics
- Category management

## 🎨 Technology Stack

### Frontend
- **Next.js 14** - React framework with SSR
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Socket.io Client** - Real-time communication
- **React Icons** - Icon library
- **React Toastify** - Notification system
- **date-fns** - Date formatting

### Backend (Separate Repository)
- **Laravel 10** - PHP framework
- **MySQL** - Database
- **Laravel Sanctum** - API authentication
- **Laravel Broadcasting** - Real-time features

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend returns JWT token + user data
3. Token stored in localStorage
4. AuthContext provides user state globally
5. Axios interceptor adds token to all requests
6. Protected routes check authentication

## 🌐 API Integration

All API calls are centralized in the `services/` directory:

```javascript
// Example: Create a project
import projectService from '../services/projectService';

const createProject = async (data) => {
  const response = await projectService.createProject(data);
  return response.data;
};
```

## 📱 Responsive Design

The application is fully responsive with mobile-first approach:
- Desktop: Full sidebar navigation
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation + hamburger menu

## 🚧 Development Roadmap

### ✅ Phase 1: Foundation (Completed)
- [x] Project setup
- [x] Folder structure
- [x] Authentication system
- [x] Layout components
- [x] API service layer

### 🔄 Phase 2: Core Features (In Progress)
- [ ] Project CRUD operations
- [ ] Offer submission and management
- [ ] Wallet integration
- [ ] Chat implementation

### 📅 Phase 3: Advanced Features (Planned)
- [ ] Real-time notifications
- [ ] File uploads
- [ ] Advanced search and filters
- [ ] Email notifications
- [ ] Payment gateway integration

### 🎨 Phase 4: Polish (Planned)
- [ ] Animations and transitions
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Unit testing

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_BASE_URL` | Backend API URL | `http://localhost:8000/api` |
| `SOCKET_URL` | Socket.io server URL | `http://localhost:8000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `FreelanceHub` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `http://localhost:3000` |

## 📚 Documentation

- [PROJECT_PLAN.md](./PROJECT_PLAN.md) - Comprehensive project planning and architecture
- [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md) - Component structure and usage guide

## 🤝 Contributing

This is a learning/portfolio project. Contributions, issues, and feature requests are welcome!

## 📄 License

This project is for educational purposes.

## 👨‍💻 Developer Notes

### Code Standards
- Use functional components with hooks
- Follow component naming conventions
- Keep components small and reusable
- Write meaningful commit messages
- Comment complex logic

### State Management
- Use React Context for global state (auth, user)
- Use local state for component-specific data
- Consider Redux for more complex state needs (future)

### Styling
- Use Tailwind utility classes
- Follow the design system in globals.css
- Maintain consistent spacing and colors
- Use CSS modules for component-specific styles if needed

### API Calls
- Always use service files for API calls
- Handle loading and error states
- Show user-friendly error messages
- Use try-catch blocks

## 📞 Support

For questions or issues, please open an issue in the repository.

---

**Built with ❤️ using Next.js and React**

