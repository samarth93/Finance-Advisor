# 🎨 Expense Tracker Frontend - Next.js Application

This is the frontend application for the Expense Tracker, built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. It provides a modern, responsive, and intuitive user interface for managing personal expenses.

## 🌟 Features

### Core Features
- ✅ **Modern React UI** - Built with Next.js 14 and App Router
- ✅ **TypeScript** - Type-safe development
- ✅ **Responsive Design** - Mobile-first responsive design
- ✅ **Tailwind CSS** - Utility-first CSS framework
- ✅ **Real-time Updates** - Optimistic UI updates
- ✅ **Form Management** - React Hook Form with Zod validation
- ✅ **State Management** - React Query for server state
- ✅ **Animations** - Smooth animations with Framer Motion

### UI/UX Features
- 🎨 **Clean Interface** - Modern and intuitive design
- 📱 **Mobile Optimized** - Responsive across all devices
- 🌙 **Dark Mode Ready** - Infrastructure for dark mode
- ♿ **Accessibility** - WCAG compliant components
- 🚀 **Performance** - Optimized for fast loading
- 💫 **Smooth Animations** - Framer Motion animations
- 🔔 **Toast Notifications** - Real-time user feedback

### Data Visualization
- 📊 **Interactive Charts** - Recharts integration
- 🥧 **Pie Charts** - Spending by category
- 📈 **Trend Analysis** - Monthly spending trends
- 📊 **Bar Charts** - Comparative analysis
- 📉 **Line Charts** - Time-series data visualization

## 🏗️ Architecture

```
frontend/
├── public/                 # Static Assets
│   ├── icons/
│   └── images/
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx     # Root Layout
│   │   ├── page.tsx       # Home Page (Dashboard)
│   │   ├── expenses/      # Expense Pages
│   │   ├── categories/    # Category Pages
│   │   └── globals.css    # Global Styles
│   ├── components/        # Reusable UI Components
│   │   ├── ui/           # Base UI Components
│   │   ├── forms/        # Form Components
│   │   ├── charts/       # Chart Components
│   │   └── layout/       # Layout Components
│   ├── lib/              # Utilities & Config
│   │   ├── api.ts        # API Client
│   │   ├── utils.ts      # Utility Functions
│   │   └── constants.ts  # App Constants
│   ├── types/            # TypeScript Definitions
│   │   └── index.ts      # Type Definitions
│   ├── hooks/            # Custom React Hooks
│   │   ├── useExpenses.ts
│   │   ├── useCategories.ts
│   │   └── useLocalStorage.ts
│   └── styles/           # Styling
│       └── globals.css   # Global CSS with Tailwind
├── tailwind.config.js    # Tailwind Configuration
├── next.config.js        # Next.js Configuration
├── tsconfig.json         # TypeScript Configuration
└── package.json          # Dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8080`

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd expense-tracker/frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

### 5. Build for Production
```bash
npm run build
npm start
```

## 🎨 UI Components

### Base Components
- **Button** - Various button styles and states
- **Input** - Form input components with validation
- **Card** - Content containers
- **Badge** - Status indicators
- **Modal** - Overlay dialogs
- **Dropdown** - Select components
- **Toast** - Notification system

### Form Components
- **ExpenseForm** - Add/edit expense form
- **CategoryForm** - Category management form
- **DatePicker** - Date selection component
- **TagInput** - Multi-tag input field
- **CurrencyInput** - Amount input with formatting

### Chart Components
- **PieChart** - Category-wise spending visualization
- **BarChart** - Comparative expense analysis
- **LineChart** - Time-series trend visualization
- **TrendChart** - Monthly/yearly trends

### Layout Components
- **Header** - Navigation and user menu
- **Sidebar** - Navigation sidebar
- **Footer** - Application footer
- **PageLayout** - Page wrapper with consistent styling

## 📊 State Management

### React Query (TanStack Query)
Used for server state management:

```typescript
// Custom hooks for API calls
const { data: expenses, isLoading, error } = useExpenses(userId);
const { data: categories } = useCategories(userId);
const { data: summary } = useExpenseSummary(userId, period);

// Mutations for create/update/delete
const addExpenseMutation = useAddExpense();
const updateExpenseMutation = useUpdateExpense();
const deleteExpenseMutation = useDeleteExpense();
```

### Local State
- **React useState** - Component-level state
- **useReducer** - Complex state logic
- **Context API** - Global app state (theme, user preferences)

### Form State
```typescript
// React Hook Form with Zod validation
const form = useForm<ExpenseFormData>({
  resolver: zodResolver(expenseSchema),
  defaultValues: {
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    // ... other fields
  }
});
```

## 🎯 Key Features Implementation

### Dashboard
- **Summary Cards** - Total expenses, monthly stats, averages
- **Quick Actions** - Fast access to common tasks
- **Recent Expenses** - Latest expense entries
- **Visual Analytics** - Charts and graphs
- **Responsive Grid** - Adaptive layout for all screens

### Expense Management
- **Add Expense Form** - Comprehensive expense entry
- **Expense List** - Filterable and sortable list
- **Edit/Delete** - In-line editing and deletion
- **Search & Filter** - Advanced filtering options
- **Bulk Actions** - Select and manage multiple expenses

### Category System
- **Default Categories** - Pre-defined expense categories
- **Custom Categories** - User-defined categories
- **Color & Icon System** - Visual category identification
- **Category Analytics** - Spending by category insights

### Data Visualization
- **Interactive Charts** - Click and hover interactions
- **Responsive Charts** - Adaptive to screen size
- **Real-time Updates** - Charts update with data changes
- **Export Options** - Save charts as images

## 🎨 Styling & Design

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* custom color palette */ },
        success: { /* success colors */ },
        warning: { /* warning colors */ },
        danger: { /* error colors */ },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    }
  }
}
```

### Custom CSS Classes
```css
/* Global component classes */
.btn { @apply inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors; }
.btn-primary { @apply bg-primary-600 text-white hover:bg-primary-700; }
.card { @apply bg-white rounded-lg shadow-sm border border-gray-200; }
.input { @apply block w-full rounded-md border-gray-300 focus:border-primary-500; }
```

### Responsive Design
- **Mobile First** - Designed for mobile, enhanced for desktop
- **Breakpoints** - Custom breakpoints for different screen sizes
- **Flexible Grid** - CSS Grid and Flexbox layouts
- **Responsive Typography** - Scalable text sizes

## 🔧 Development Tools

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "es5",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

### ESLint & Prettier
```json
// .eslintrc.js
{
  "extends": ["next/core-web-vitals", "@typescript-eslint/recommended"],
  "rules": {
    "prefer-const": "error",
    "no-unused-vars": "warn"
  }
}
```

### Development Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

## 📱 Responsive Design

### Breakpoint Strategy
- **xs**: 475px+ (Small phones)
- **sm**: 640px+ (Large phones)
- **md**: 768px+ (Tablets)
- **lg**: 1024px+ (Laptops)
- **xl**: 1280px+ (Desktops)
- **2xl**: 1536px+ (Large desktops)

### Mobile-First Components
```tsx
// Responsive grid example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Cards adapt to screen size */}
</div>

// Responsive navigation
<nav className="hidden lg:flex lg:space-x-8">
  {/* Desktop navigation */}
</nav>
<div className="lg:hidden">
  {/* Mobile navigation */}
</div>
```

## 🔄 API Integration

### API Client Setup
```typescript
// lib/api.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request/Response interceptors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error(getErrorMessage(error));
    return Promise.reject(error);
  }
);
```

### Custom Hooks
```typescript
// hooks/useExpenses.ts
export const useExpenses = (userId: string) => {
  return useQuery({
    queryKey: ['expenses', userId],
    queryFn: () => api.expenses.getByUserId(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: ExpenseRequest }) =>
      api.expenses.create(userId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['expenses', variables.userId]);
      toast.success('Expense added successfully!');
    },
  });
};
```

## 🧪 Testing

### Testing Stack
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **MSW** - API mocking
- **Playwright** - E2E testing (future)

### Test Examples
```typescript
// __tests__/components/ExpenseForm.test.tsx
describe('ExpenseForm', () => {
  test('renders form fields correctly', () => {
    render(<ExpenseForm onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(<ExpenseForm onSubmit={mockSubmit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
    });
  });
});
```

## 🚀 Performance Optimization

### Next.js Optimizations
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Automatic route-based splitting
- **Bundle Analysis** - Webpack bundle analyzer
- **Caching** - Static generation and ISR

### React Optimizations
- **Memo Components** - Prevent unnecessary re-renders
- **Virtual Scrolling** - For large lists
- **Lazy Loading** - Component and image lazy loading
- **Debounced Inputs** - Search and filter optimization

### Performance Monitoring
```typescript
// lib/analytics.ts
export const trackPageView = (url: string) => {
  // Google Analytics or other analytics
  gtag('config', GA_TRACKING_ID, {
    page_location: url,
  });
};

export const trackEvent = (action: string, category: string, label?: string) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
  });
};
```

## 🔧 Environment Configuration

### Development (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_ENVIRONMENT=development
```

### Production (.env.production)
```env
NEXT_PUBLIC_API_BASE_URL=https://api.expensetracker.com/api
NEXT_PUBLIC_ENVIRONMENT=production
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Build Optimization
```javascript
// next.config.js
module.exports = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['example.com'],
  },
}
```

## 🛠️ Development Workflow

### Getting Started with New Features
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Component Development**
   - Create component in appropriate directory
   - Add TypeScript types
   - Implement responsive design
   - Add error handling

3. **Testing**
   ```bash
   npm run test
   npm run type-check
   npm run lint
   ```

4. **Code Review & Merge**
   - Create pull request
   - Code review process
   - Merge to main branch

### Component Development Guidelines
```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        loading && 'opacity-50 cursor-not-allowed'
      )}
      disabled={loading}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

## 📚 Dependencies

### Core Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.2.0"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^3.3.0",
  "@headlessui/react": "^1.7.17",
  "@heroicons/react": "^2.0.18",
  "framer-motion": "^10.16.4",
  "clsx": "^2.0.0"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.47.0",
  "@hookform/resolvers": "^3.3.2",
  "zod": "^3.22.4"
}
```

### Data Fetching & State
```json
{
  "@tanstack/react-query": "^5.8.0",
  "axios": "^1.6.0"
}
```

### Utilities
```json
{
  "date-fns": "^2.30.0",
  "react-hot-toast": "^2.4.1",
  "recharts": "^2.8.0"
}
```

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### Type Errors
```bash
# Check TypeScript configuration
npm run type-check
```

#### Styling Issues
```bash
# Rebuild Tailwind CSS
npm run dev
```

#### API Connection Issues
```bash
# Check environment variables
echo $NEXT_PUBLIC_API_BASE_URL
```

## 🤝 Contributing

### Code Style Guidelines
- Use TypeScript for all new code
- Follow ESLint and Prettier rules
- Use semantic commit messages
- Add JSDoc comments for complex functions
- Write tests for new components

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit pull request

---

**Happy Coding! 🎨✨**
