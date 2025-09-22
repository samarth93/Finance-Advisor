# Application Architecture Documentation

## Overview
The Expense Tracker is a full-stack web application built with Spring Boot (Backend) and Next.js (Frontend), using MongoDB as the database. The application follows a modern microservices-inspired architecture with clear separation of concerns.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Next.js App   │  │   React Hooks   │  │   TailwindCSS   │  │
│  │   (Port 3000)   │  │   State Mgmt    │  │   Styling       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/REST API
                                │
┌─────────────────────────────────────────────────────────────────┐
│                        Backend Layer                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Spring Boot    │  │   REST APIs     │  │   Validation    │  │
│  │  (Port 8080)    │  │   Controllers   │  │   & Security    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Services      │  │   Repositories  │  │   DTOs & Models │  │
│  │   (Business)    │  │   (Data Access) │  │   (Data Layer)  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ MongoDB Driver
                                │
┌─────────────────────────────────────────────────────────────────┐
│                        Database Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │    MongoDB      │  │   Collections   │  │   Indexes &     │  │
│  │   (Atlas Cloud) │  │   (Users,       │  │   Aggregations  │  │
│  │                 │  │   Categories,   │  │                 │  │
│  │                 │  │   Expenses)     │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture (Next.js)

### Technology Stack
- **Framework**: Next.js 14.2.32 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Heroicons
- **Animations**: Framer Motion

### Project Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout component
│   │   ├── page.tsx           # Main dashboard page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── forms/            # Form components
│   │   │   └── AddExpenseForm.tsx
│   │   ├── expenses/         # Expense-related components
│   │   │   └── ExpenseList.tsx
│   │   ├── categories/       # Category management
│   │   │   └── CategoryManager.tsx
│   │   └── analytics/        # Analytics components
│   │       └── Analytics.tsx
│   ├── lib/                  # Utility libraries
│   │   └── api.ts           # API client configuration
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   └── styles/              # Styling files
│       └── globals.css
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

### Component Architecture

#### 1. Page Components
- **HomePage** (`app/page.tsx`): Main dashboard with navigation and content routing
- **Layout** (`app/layout.tsx`): Root layout with metadata and global providers

#### 2. Feature Components
- **AddExpenseForm**: Modal form for creating new expenses
- **ExpenseList**: Table view with search, filter, and CRUD operations
- **CategoryManager**: Category management with color/icon customization
- **Analytics**: Data visualization with charts and insights

#### 3. Shared Components
- **API Client**: Centralized HTTP client with interceptors
- **Type Definitions**: TypeScript interfaces for type safety
- **Utility Functions**: Helper functions for formatting and validation

### State Management
- **Local State**: React hooks for component-level state
- **Global State**: Context API for user authentication (future)
- **Server State**: React Query for API data caching (future)

### Routing Strategy
- **App Router**: Next.js 14 App Router for file-based routing
- **Client-Side Navigation**: React Router for SPA-like experience
- **Tab-Based Navigation**: Custom navigation between features

## Backend Architecture (Spring Boot)

### Technology Stack
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 21
- **Database**: MongoDB with Spring Data MongoDB
- **Build Tool**: Maven
- **Validation**: Jakarta Validation
- **Documentation**: Spring Boot Actuator
- **Testing**: JUnit 5, MockMVC

### Project Structure
```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/expensetracker/
│   │   │   ├── ExpenseTrackerApplication.java  # Main application class
│   │   │   ├── controller/                    # REST Controllers
│   │   │   │   ├── ExpenseController.java
│   │   │   │   ├── CategoryController.java
│   │   │   │   └── UserController.java
│   │   │   ├── service/                      # Business Logic Layer
│   │   │   │   ├── ExpenseService.java
│   │   │   │   ├── CategoryService.java
│   │   │   │   └── UserService.java
│   │   │   ├── repository/                   # Data Access Layer
│   │   │   │   ├── ExpenseRepository.java
│   │   │   │   ├── CategoryRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   ├── model/                        # Data Models
│   │   │   │   ├── User.java
│   │   │   │   ├── Category.java
│   │   │   │   └── Expense.java
│   │   │   ├── dto/                         # Data Transfer Objects
│   │   │   │   ├── ExpenseRequestDto.java
│   │   │   │   ├── ExpenseSummaryDto.java
│   │   │   │   └── CategoryRequestDto.java
│   │   │   └── exception/                   # Exception Handling
│   │   │       └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       └── application.yml              # Configuration
│   └── test/                               # Test Classes
│       ├── java/com/expensetracker/
│       │   ├── controller/                 # Controller Tests
│       │   ├── integration/               # Integration Tests
│       │   └── TestDataUtil.java          # Test Utilities
│       └── resources/
│           └── application-test.yml       # Test Configuration
├── pom.xml                                # Maven Dependencies
└── README.md                             # Backend Documentation
```

### Layered Architecture

#### 1. Controller Layer
- **Purpose**: Handle HTTP requests and responses
- **Responsibilities**:
  - Request validation and mapping
  - Response formatting
  - Error handling
  - CORS configuration

#### 2. Service Layer
- **Purpose**: Implement business logic
- **Responsibilities**:
  - Business rule validation
  - Data transformation
  - Transaction management
  - External service integration

#### 3. Repository Layer
- **Purpose**: Data access abstraction
- **Responsibilities**:
  - Database operations
  - Query optimization
  - Data mapping
  - Caching (future)

#### 4. Model Layer
- **Purpose**: Data representation
- **Responsibilities**:
  - Entity mapping
  - Data validation
  - Serialization/Deserialization

### API Design

#### RESTful Endpoints
```
Users:
  POST   /api/users                    # Create user
  GET    /api/users/{userId}          # Get user by ID
  PUT    /api/users/{userId}          # Update user
  DELETE /api/users/{userId}          # Delete user
  GET    /api/users/active            # Get active users

Categories:
  POST   /api/categories              # Create category
  GET    /api/categories/{userId}     # Get user categories
  PUT    /api/categories/{id}         # Update category
  DELETE /api/categories/{id}         # Delete category
  POST   /api/categories/{userId}/initialize-defaults  # Initialize defaults

Expenses:
  POST   /api/expenses                # Create expense
  GET    /api/expenses/{userId}       # Get user expenses
  GET    /api/expenses/{userId}/summary  # Get expense summary
  PUT    /api/expenses/{id}           # Update expense
  DELETE /api/expenses/{id}           # Delete expense
```

#### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-09-22T19:54:58.475"
}
```

#### Error Handling
```json
{
  "timestamp": "2025-09-22T19:54:58.475",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "details": { ... }
}
```

## Database Architecture (MongoDB)

### Connection Strategy
- **Cloud Database**: MongoDB Atlas
- **Connection Pool**: Spring Data MongoDB
- **Driver**: MongoDB Java Driver 4.11.1

### Data Modeling
- **Document-Based**: NoSQL document storage
- **Embedded Documents**: Related data in single documents
- **References**: Foreign key relationships via ObjectId
- **Indexing**: Optimized for common query patterns

### Collections Design
1. **Users**: User account information
2. **Categories**: Expense categories with customization
3. **Expenses**: Individual expense records

## Security Architecture

### Authentication (Future)
- **JWT Tokens**: Stateless authentication
- **Role-Based Access**: User permissions
- **Session Management**: Secure session handling

### Data Security
- **Input Validation**: Server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CORS Configuration**: Cross-origin request control

### Network Security
- **HTTPS**: Encrypted communication
- **TLS/SSL**: Transport layer security
- **Firewall**: Network access control

## Deployment Architecture

### Development Environment
```
Developer Machine
├── Frontend (Next.js)     → localhost:3000
├── Backend (Spring Boot)  → localhost:8080
└── Database (MongoDB)     → MongoDB Atlas Cloud
```

### Production Environment (Future)
```
Load Balancer
├── Frontend (Vercel/Netlify)
├── Backend (AWS/DigitalOcean)
└── Database (MongoDB Atlas)
```

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Next.js image optimization
- **Caching**: Browser caching strategies
- **Bundle Size**: Tree shaking and minification

### Backend Optimization
- **Connection Pooling**: Database connection management
- **Caching**: Redis for frequently accessed data
- **Async Processing**: Non-blocking operations
- **Query Optimization**: Efficient database queries

### Database Optimization
- **Indexing**: Strategic index placement
- **Aggregation**: Optimized aggregation pipelines
- **Sharding**: Horizontal scaling (future)
- **Replication**: Read replicas for scaling

## Monitoring and Logging

### Application Monitoring
- **Health Checks**: Spring Boot Actuator
- **Metrics**: Application performance metrics
- **Logging**: Structured logging with Logback
- **Error Tracking**: Exception monitoring

### Database Monitoring
- **Query Performance**: Slow query analysis
- **Index Usage**: Index utilization tracking
- **Storage**: Disk usage monitoring
- **Connections**: Connection pool monitoring

## Scalability Considerations

### Horizontal Scaling
- **Stateless Design**: No server-side sessions
- **Load Balancing**: Multiple backend instances
- **Database Sharding**: Horizontal data partitioning
- **CDN**: Content delivery network for static assets

### Vertical Scaling
- **Resource Optimization**: CPU and memory tuning
- **Database Optimization**: Query and index optimization
- **Caching**: Multi-level caching strategy
- **Connection Pooling**: Efficient resource utilization

## Future Enhancements

### Planned Features
- **User Authentication**: JWT-based authentication
- **Real-time Updates**: WebSocket integration
- **Mobile App**: React Native application
- **Advanced Analytics**: Machine learning insights
- **Export/Import**: Data portability features
- **Multi-currency**: International expense tracking
- **Recurring Expenses**: Automated recurring transactions
- **Budget Management**: Spending limits and alerts
