# Finance Advisor - Routing Documentation

## 🚀 Application Structure

The Finance Advisor application now features a comprehensive routing structure with dedicated pages for different functionalities. The application uses Next.js 14 App Router with proper authentication and navigation.

## 📂 Page Structure

### Authentication Pages (`/app/(auth)/`)
- **`/login`** - User login page with modern UI
- **`/signup`** - User registration page with modern UI

### Dashboard Pages (`/app/(dashboard)/`)
- **`/dashboard`** - Main dashboard with overview and quick actions
- **`/expenses`** - Expense management and tracking
- **`/categories`** - Category management and organization
- **`/analytics`** - Data visualization and insights
- **`/reports`** - Report generation and history
- **`/settings`** - Account and application settings

## 🔐 Authentication & Middleware

### Middleware (`/src/middleware.ts`)
- **Route Protection**: Automatically redirects unauthenticated users to `/login`
- **Auth Check**: Validates JWT tokens stored in cookies/localStorage
- **Auto Redirect**: Logged-in users accessing auth pages are redirected to `/dashboard`
- **Root Redirect**: Root path (`/`) redirects based on authentication status

### Cookie-based Auth
- JWT tokens are now stored in cookies for better security
- Middleware can access cookies for server-side route protection
- Tokens have 7-day expiration

## 🎨 Modern UI Features

### Layouts
- **Auth Layout**: Beautiful animated background with glassmorphism design
- **Dashboard Layout**: Professional sidebar navigation with responsive design
- **Shared Components**: Consistent styling across all pages

### Navigation
- **Responsive Sidebar**: Collapsible navigation for mobile devices
- **Active States**: Visual indicators for current page
- **Quick Actions**: Easy access to frequently used features

## 🛠️ Development Features

### Route Organization
```
/
├── login          → Login page
├── signup         → Registration page
├── dashboard      → Main dashboard
├── expenses       → Expense management
├── categories     → Category management
├── analytics      → Data insights
├── reports        → Report generation
└── settings       → User settings
```

### Component Structure
```
src/
├── app/
│   ├── (auth)/           → Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── layout.tsx
│   ├── (dashboard)/      → Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── expenses/
│   │   ├── categories/
│   │   ├── analytics/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── layout.tsx        → Root layout
│   └── page.tsx          → Root redirect page
├── components/           → Reusable components
├── lib/                  → Utilities and API
└── middleware.ts         → Route protection
```

## 🚀 Getting Started

### 1. Start the Development Server
```bash
cd frontend
npm run dev
```

### 2. Access the Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080

### 3. Navigation Flow
1. Visit http://localhost:3000
2. If not logged in → Redirected to `/login`
3. After login → Redirected to `/dashboard`
4. Use sidebar navigation to access different pages

## 📱 Page Descriptions

### `/login` - Login Page
- Modern glassmorphism design
- Email/password authentication
- Link to signup page
- Animated background elements

### `/signup` - Registration Page
- User registration form
- Password visibility toggle
- Email validation
- Link to login page

### `/dashboard` - Main Dashboard
- Welcome message with user name
- Statistics cards (Total Spent, Total Expenses, Average)
- Quick action buttons
- Category breakdown display
- Add expense modal

### `/expenses` - Expense Management
- Complete expense list with pagination
- Add new expense functionality
- Edit/delete existing expenses
- Filter and search capabilities

### `/categories` - Category Management
- Create custom categories
- Edit category details (name, icon, color)
- Delete unused categories
- Category usage statistics

### `/analytics` - Data Insights
- Monthly/yearly spending trends
- Category-wise expense charts
- Expense patterns and insights
- Interactive data visualizations

### `/reports` - Report Generation
- Generate PDF/CSV/Excel reports
- Custom date range selection
- Scheduled report generation
- Report history and downloads

### `/settings` - User Settings
- Profile management
- Security settings (password change, 2FA)
- Notification preferences
- Data export/import
- Account deletion

## 🔧 Technical Features

### Responsive Design
- Mobile-first approach
- Collapsible sidebar for mobile
- Touch-friendly interactions
- Optimized for all screen sizes

### Performance
- Next.js App Router for optimal performance
- Code splitting by route
- Lazy loading of components
- Optimized bundle sizes

### Security
- JWT-based authentication
- Protected routes with middleware
- Secure cookie storage
- CSRF protection ready

### Future-Ready Architecture
- Modular component structure
- Easy to add new pages/features
- Scalable routing system
- TypeScript support throughout

## 🎯 Next Steps

### Planned Features
1. **Budget Management** - `/budgets` page for budget tracking
2. **Goals & Targets** - `/goals` page for financial goals
3. **Notifications** - `/notifications` page for alerts
4. **Import/Export** - Enhanced data management
5. **Mobile App** - React Native companion app

### Enhancement Opportunities
1. **Real-time Updates** - WebSocket integration
2. **Offline Support** - PWA capabilities
3. **Data Visualization** - Advanced charts and graphs
4. **Automation** - Recurring expense management
5. **Integrations** - Bank account connections

## 📞 Support

For any issues or questions about the routing structure:
1. Check the middleware configuration
2. Verify authentication token storage
3. Review page component implementations
4. Test route protection behavior

The application is now fully structured with proper routing, making it easy to navigate and maintain! 🎉