# Database Schema Documentation

## Overview
This document describes the MongoDB database schema for the Expense Tracker application. The application uses MongoDB as the primary database with Spring Data MongoDB for data persistence.

## Database Configuration
- **Database Type**: MongoDB
- **Connection URI**: `mongodb+srv://samarth:samarth123@cluster0.4b8hq.mongodb.net/expense_tracker?retryWrites=true&w=majority`
- **Database Name**: `expense_tracker`

## Collections

### 1. Users Collection

**Collection Name**: `users`

**Purpose**: Stores user account information and profile data.

**Schema**:
```json
{
  "_id": "ObjectId",
  "userId": "String (Unique Index)",
  "name": "String (Required)",
  "email": "String (Required, Unique Index)",
  "isActive": "Boolean (Default: true)",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

**Indexes**:
- `userId` - Unique index for fast user lookups
- `email` - Unique index for email-based authentication

**Sample Document**:
```json
{
  "_id": "68d15c1473a5051c4e2b3b57",
  "userId": "demo",
  "name": "Demo User",
  "email": "demo@expensetracker.com",
  "isActive": true,
  "createdAt": "2025-09-22T19:36:40.855",
  "updatedAt": "2025-09-22T19:36:40.855"
}
```

### 2. Categories Collection

**Collection Name**: `categories`

**Purpose**: Stores expense categories with customization options.

**Schema**:
```json
{
  "_id": "ObjectId",
  "categoryId": "String (Unique Index)",
  "userId": "String (Indexed)",
  "name": "String (Required)",
  "description": "String (Optional)",
  "color": "String (Hex Color Code)",
  "icon": "String (Emoji)",
  "isDefault": "Boolean (Default: false)",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

**Indexes**:
- `categoryId` - Unique index for category identification
- `userId` - Index for user-specific category queries

**Default Categories**:
- Food (🍽️) - #EF4444
- Shopping (🛒) - #F59E0B
- Travel (✈️) - #10B981
- Bills (📄) - #8B5CF6
- Entertainment (🎬) - #EC4899
- Others (📦) - #6B7280

**Sample Document**:
```json
{
  "_id": "68d15c1473a5051c4e2b3b5e",
  "categoryId": "demo_food",
  "userId": "demo",
  "name": "Food",
  "description": "Food and dining expenses",
  "color": "#EF4444",
  "icon": "🍽️",
  "isDefault": true,
  "createdAt": "2025-09-22T19:54:20.547",
  "updatedAt": "2025-09-22T19:54:20.547"
}
```

### 3. Expenses Collection

**Collection Name**: `expenses`

**Purpose**: Stores individual expense records with detailed information.

**Schema**:
```json
{
  "_id": "ObjectId",
  "expenseId": "String (Unique Index)",
  "userId": "String (Indexed)",
  "amount": "BigDecimal (Required)",
  "category": "String (Required)",
  "categoryId": "String (Indexed)",
  "date": "LocalDate (Required)",
  "time": "LocalTime (Required)",
  "payee": "String (Optional)",
  "description": "String (Optional)",
  "paymentMethod": "String (Optional)",
  "tags": "Set<String> (Optional)",
  "location": "String (Optional)",
  "isRecurring": "Boolean (Default: false)",
  "recurringFrequency": "String (Optional)",
  "notes": "String (Optional)",
  "source": "String (Default: 'MANUAL')",
  "monthYear": "String (Indexed)",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

**Indexes**:
- `expenseId` - Unique index for expense identification
- `userId` - Index for user-specific expense queries
- `categoryId` - Index for category-based filtering
- `monthYear` - Index for monthly trend analysis
- `date` - Index for date range queries

**Payment Methods**:
- CREDIT_CARD
- DEBIT_CARD
- CASH
- UPI
- NET_BANKING
- WALLET

**Sample Document**:
```json
{
  "_id": "68d15c3a73a5051c4e2b3b64",
  "expenseId": "demo_635b7091",
  "userId": "demo",
  "amount": 125.50,
  "category": "Food",
  "categoryId": "demo_food",
  "date": "2025-09-22",
  "time": "14:30:00",
  "payee": "Restaurant ABC",
  "description": "Lunch with friends",
  "paymentMethod": "UPI",
  "isRecurring": false,
  "source": "MANUAL",
  "monthYear": "2025-09",
  "createdAt": "2025-09-22T19:54:58.475",
  "updatedAt": "2025-09-22T19:54:58.475"
}
```

## Data Relationships

### User → Categories (1:Many)
- Each user can have multiple categories
- Categories are user-specific (userId field)
- Default categories are created for new users

### User → Expenses (1:Many)
- Each user can have multiple expenses
- Expenses are user-specific (userId field)

### Category → Expenses (1:Many)
- Each category can have multiple expenses
- Expenses reference categories via categoryId

## Query Patterns

### Common Queries

1. **Get User Expenses**:
```javascript
db.expenses.find({userId: "demo"}).sort({date: -1})
```

2. **Get Monthly Expenses**:
```javascript
db.expenses.find({
  userId: "demo",
  monthYear: "2025-09"
})
```

3. **Get Category Breakdown**:
```javascript
db.expenses.aggregate([
  { $match: { userId: "demo" } },
  { $group: {
    _id: "$categoryId",
    totalAmount: { $sum: "$amount" },
    count: { $sum: 1 }
  }}
])
```

4. **Get User Categories**:
```javascript
db.categories.find({userId: "demo"}).sort({name: 1})
```

## Data Validation

### User Validation
- `name`: Required, not blank
- `email`: Required, valid email format, unique
- `userId`: Required, unique

### Category Validation
- `name`: Required, not blank, max 50 characters
- `description`: Optional, max 200 characters
- `color`: Valid hex color code
- `icon`: Single emoji character

### Expense Validation
- `amount`: Required, greater than 0, max 1,000,000
- `category`: Required, not blank
- `date`: Required, valid date
- `time`: Required, valid time
- `payee`: Optional, max 100 characters
- `description`: Optional, max 500 characters
- `notes`: Optional, max 1000 characters

## Performance Considerations

### Indexing Strategy
- Primary keys on `_id` fields
- Unique indexes on `userId` and `email` in users
- Unique indexes on `categoryId` and `expenseId`
- Compound indexes for common query patterns

### Data Archiving
- Consider archiving old expenses (> 2 years) to separate collection
- Implement data retention policies for inactive users

### Backup Strategy
- Regular automated backups via MongoDB Atlas
- Point-in-time recovery capabilities
- Cross-region replication for disaster recovery

## Security

### Data Protection
- All sensitive data encrypted at rest
- Network encryption via TLS/SSL
- Access control via MongoDB Atlas IAM

### Privacy
- User data isolation via userId filtering
- No cross-user data access
- GDPR compliance considerations

## Migration and Maintenance

### Schema Evolution
- Backward compatible changes only
- Gradual migration for breaking changes
- Version control for schema changes

### Monitoring
- Query performance monitoring
- Index usage analysis
- Storage utilization tracking
- Connection pool monitoring
