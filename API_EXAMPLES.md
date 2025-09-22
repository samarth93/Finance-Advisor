# 📡 API Examples - Expense Tracker

This document provides comprehensive examples of how to use the Expense Tracker REST API. All examples use `cURL` commands that you can run directly in your terminal.

## 🔧 Base Configuration

**Base URL**: `http://localhost:8080/api`  
**Content-Type**: `application/json`  
**Demo User ID**: `demo_user_123`

## 👤 User Management

### Create a New User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com"
  }'
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "userId": "john.doe",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

### Get User Details
```bash
curl -X GET http://localhost:8080/api/users/john.doe
```

### Update User Information
```bash
curl -X PUT http://localhost:8080/api/users/john.doe \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com"
  }'
```

### Get User Statistics
```bash
curl -X GET http://localhost:8080/api/users/john.doe/stats
```

**Response:**
```json
{
  "userId": "john.doe",
  "name": "John Smith",
  "email": "john.smith@example.com",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00",
  "categoryCount": 8,
  "expenseCount": 25,
  "totalExpenses": 15420.50
}
```

## 🏷️ Category Management

### Initialize Default Categories
```bash
curl -X POST http://localhost:8080/api/categories/john.doe/initialize-defaults
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439012",
    "categoryId": "john.doe_food",
    "userId": "john.doe",
    "name": "Food",
    "description": "Food and dining expenses",
    "color": "#EF4444",
    "icon": "🍽️",
    "isDefault": true,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
  // ... more categories
]
```

### Create Custom Category
```bash
curl -X POST "http://localhost:8080/api/categories?userId=john.doe" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Healthcare",
    "description": "Medical and healthcare expenses",
    "color": "#10B981",
    "icon": "🏥"
  }'
```

### Get All Categories for User
```bash
curl -X GET http://localhost:8080/api/categories/john.doe
```

### Update Category
```bash
curl -X PUT http://localhost:8080/api/categories/john.doe_healthcare \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Medical",
    "description": "Updated medical expenses category",
    "color": "#EF4444",
    "icon": "⚕️"
  }'
```

### Delete Category
```bash
curl -X DELETE http://localhost:8080/api/categories/john.doe_healthcare
```

### Search Categories
```bash
curl -X GET "http://localhost:8080/api/categories/john.doe/search?query=food"
```

## 💰 Expense Management

### Create a New Expense
```bash
curl -X POST "http://localhost:8080/api/expenses?userId=john.doe" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 450.75,
    "category": "Food",
    "categoryId": "john.doe_food",
    "date": "2024-01-15",
    "time": "12:30:00",
    "payee": "Pizza Palace",
    "description": "Team lunch meeting",
    "paymentMethod": "CREDIT_CARD",
    "tags": ["lunch", "work", "team"],
    "location": "Mumbai, India",
    "isRecurring": false,
    "notes": "Monthly team lunch - discuss Q1 goals"
  }'
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "expenseId": "john.doe_a1b2c3d4",
  "userId": "john.doe",
  "amount": 450.75,
  "category": "Food",
  "categoryId": "john.doe_food",
  "date": "2024-01-15",
  "time": "12:30:00",
  "payee": "Pizza Palace",
  "description": "Team lunch meeting",
  "paymentMethod": "CREDIT_CARD",
  "tags": ["lunch", "work", "team"],
  "location": "Mumbai, India",
  "isRecurring": false,
  "notes": "Monthly team lunch - discuss Q1 goals",
  "source": "MANUAL",
  "createdAt": "2024-01-15T14:30:00",
  "updatedAt": "2024-01-15T14:30:00"
}
```

### Get All Expenses for User
```bash
curl -X GET http://localhost:8080/api/expenses/john.doe
```

### Get Paginated Expenses
```bash
curl -X GET "http://localhost:8080/api/expenses/john.doe/paginated?page=0&size=10&sortBy=date&sortDir=desc"
```

**Response:**
```json
{
  "content": [
    {
      "expenseId": "john.doe_a1b2c3d4",
      "amount": 450.75,
      "category": "Food",
      "date": "2024-01-15",
      "payee": "Pizza Palace"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "direction": "DESC",
      "property": "date"
    }
  },
  "totalElements": 25,
  "totalPages": 3,
  "first": true,
  "last": false,
  "numberOfElements": 10
}
```

### Get Expense by ID
```bash
curl -X GET http://localhost:8080/api/expenses/details/john.doe_a1b2c3d4
```

### Update Expense
```bash
curl -X PUT http://localhost:8080/api/expenses/john.doe_a1b2c3d4 \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 525.00,
    "category": "Food",
    "categoryId": "john.doe_food",
    "date": "2024-01-15",
    "time": "12:30:00",
    "payee": "Pizza Palace Premium",
    "description": "Team lunch meeting - upgraded menu",
    "paymentMethod": "UPI",
    "tags": ["lunch", "work", "team", "premium"],
    "location": "Mumbai, India",
    "isRecurring": false,
    "notes": "Monthly team lunch - discuss Q1 goals, ordered premium items"
  }'
```

### Delete Expense
```bash
curl -X DELETE http://localhost:8080/api/expenses/john.doe_a1b2c3d4
```

### Get Expenses by Date Range
```bash
curl -X GET "http://localhost:8080/api/expenses/john.doe/date-range?startDate=2024-01-01&endDate=2024-01-31"
```

### Get Expenses by Category
```bash
curl -X GET http://localhost:8080/api/expenses/john.doe/category/Food
```

### Search Expenses
```bash
curl -X GET "http://localhost:8080/api/expenses/john.doe/search?query=pizza"
```

### Get Recent Expenses
```bash
curl -X GET "http://localhost:8080/api/expenses/john.doe/recent?days=7"
```

## 📊 Expense Summary & Analytics

### Get Monthly Summary
```bash
curl -X GET "http://localhost:8080/api/expenses/john.doe/summary?period=MONTHLY"
```

**Response:**
```json
{
  "userId": "john.doe",
  "period": "MONTHLY",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "totalAmount": 15420.50,
  "totalExpenses": 25,
  "averageExpense": 616.82,
  "categoryBreakdown": [
    {
      "categoryId": "john.doe_food",
      "categoryName": "Food",
      "amount": 5240.25,
      "count": 12,
      "percentage": 33.98,
      "color": "#EF4444",
      "icon": "🍽️"
    },
    {
      "categoryId": "john.doe_shopping",
      "categoryName": "Shopping",
      "amount": 3680.75,
      "count": 6,
      "percentage": 23.88,
      "color": "#F59E0B",
      "icon": "🛒"
    }
  ],
  "monthlyTrends": [
    {
      "monthYear": "2024-01",
      "amount": 15420.50,
      "count": 25,
      "averageDaily": 497.11
    }
  ],
  "topCategory": "Food",
  "topCategoryAmount": 5240.25,
  "topPayees": ["Pizza Palace", "Grocery Store", "Coffee Shop", "Gas Station"]
}
```

### Get Custom Date Range Summary
```bash
curl -X GET "http://localhost:8080/api/expenses/john.doe/summary?period=CUSTOM&startDate=2024-01-01&endDate=2024-01-15"
```

### Get Yearly Summary
```bash
curl -X GET "http://localhost:8080/api/expenses/john.doe/summary?period=YEARLY"
```

### Get Weekly Summary
```bash
curl -X GET "http://localhost:8080/api/expenses/john.doe/summary?period=WEEKLY"
```

## 🔍 Advanced Filtering Examples

### Multiple Filters Combined
```bash
# Get Food expenses from last month, sorted by amount
curl -X GET "http://localhost:8080/api/expenses/john.doe/date-range?startDate=2023-12-01&endDate=2023-12-31" \
  | jq '.[] | select(.category == "Food") | sort_by(.amount) | reverse'
```

### Search with Specific Payee
```bash
curl -X GET "http://localhost:8080/api/expenses/john.doe/search?query=Pizza" \
  | jq '.[] | {expenseId, amount, payee, date}'
```

## 📈 Business Intelligence Queries

### Top 5 Most Expensive Expenses
```bash
curl -X GET http://localhost:8080/api/expenses/john.doe \
  | jq 'sort_by(.amount) | reverse | .[0:5] | .[] | {amount, payee, category, date}'
```

### Category-wise Spending This Month
```bash
curl -X GET "http://localhost:8080/api/expenses/john.doe/summary?period=MONTHLY" \
  | jq '.categoryBreakdown[] | {category: .categoryName, amount, percentage}'
```

### Daily Spending Pattern
```bash
curl -X GET "http://localhost:8080/api/expenses/john.doe/date-range?startDate=2024-01-01&endDate=2024-01-07" \
  | jq 'group_by(.date) | .[] | {date: .[0].date, total: (map(.amount) | add), count: length}'
```

## 🛠️ Testing Workflows

### Complete Expense Lifecycle Test
```bash
# 1. Create user
USER_RESPONSE=$(curl -s -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}')

USER_ID=$(echo $USER_RESPONSE | jq -r '.userId')

# 2. Initialize categories
curl -s -X POST http://localhost:8080/api/categories/$USER_ID/initialize-defaults > /dev/null

# 3. Get categories
CATEGORIES=$(curl -s -X GET http://localhost:8080/api/categories/$USER_ID)
FOOD_CATEGORY_ID=$(echo $CATEGORIES | jq -r '.[] | select(.name == "Food") | .categoryId')

# 4. Create expense
EXPENSE_RESPONSE=$(curl -s -X POST "http://localhost:8080/api/expenses?userId=$USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.50,
    "category": "Food",
    "categoryId": "'$FOOD_CATEGORY_ID'",
    "date": "2024-01-15",
    "time": "12:00:00",
    "payee": "Test Restaurant"
  }')

EXPENSE_ID=$(echo $EXPENSE_RESPONSE | jq -r '.expenseId')

# 5. Update expense
curl -s -X PUT http://localhost:8080/api/expenses/$EXPENSE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 150.75,
    "category": "Food",
    "categoryId": "'$FOOD_CATEGORY_ID'",
    "date": "2024-01-15",
    "time": "12:00:00",
    "payee": "Test Restaurant Updated"
  }' > /dev/null

# 6. Get summary
curl -s -X GET "http://localhost:8080/api/expenses/$USER_ID/summary?period=MONTHLY" \
  | jq '{totalAmount, totalExpenses, topCategory}'

# 7. Clean up - delete expense and user
curl -s -X DELETE http://localhost:8080/api/expenses/$EXPENSE_ID > /dev/null
curl -s -X DELETE http://localhost:8080/api/users/$USER_ID > /dev/null

echo "Test completed successfully!"
```

## 🔧 Health Check & Monitoring

### API Health Check
```bash
curl -X GET http://localhost:8080/api/actuator/health
```

**Response:**
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "MongoDB",
        "version": "6.0"
      }
    }
  }
}
```

### Application Info
```bash
curl -X GET http://localhost:8080/api/actuator/info
```

### Metrics
```bash
curl -X GET http://localhost:8080/api/actuator/metrics
```

## ❌ Error Handling Examples

### Validation Error
```bash
# Missing required field
curl -X POST "http://localhost:8080/api/expenses?userId=john.doe" \
  -H "Content-Type: application/json" \
  -d '{"category": "Food"}'
```

**Error Response:**
```json
{
  "timestamp": "2024-01-15T14:30:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "details": {
    "amount": "Amount cannot be null",
    "date": "Date cannot be null",
    "time": "Time cannot be null"
  }
}
```

### Resource Not Found
```bash
curl -X GET http://localhost:8080/api/expenses/details/non_existent_id
```

**Error Response:**
```json
{
  "timestamp": "2024-01-15T14:30:00",
  "status": 404,
  "error": "Resource Not Found",
  "message": "Expense not found: non_existent_id"
}
```

### Duplicate Resource Error
```bash
# Try to create user with existing email
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Another User", "email": "john.doe@example.com"}'
```

**Error Response:**
```json
{
  "timestamp": "2024-01-15T14:30:00",
  "status": 409,
  "error": "Resource Conflict",
  "message": "User with email john.doe@example.com already exists"
}
```

## 📋 Postman Collection

Save this as a Postman collection JSON for easy testing:

```json
{
  "info": {
    "name": "Expense Tracker API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080/api"
    },
    {
      "key": "userId",
      "value": "demo_user_123"
    }
  ],
  "item": [
    {
      "name": "Users",
      "item": [
        {
          "name": "Create User",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{baseUrl}}/users",
            "body": {
              "raw": "{\"name\": \"Test User\", \"email\": \"test@example.com\"}"
            }
          }
        }
      ]
    }
  ]
}
```

## 🎯 Tips & Best Practices

1. **Always validate data** - Check response status codes
2. **Handle errors gracefully** - Parse error messages for user feedback
3. **Use pagination** - For large datasets, use paginated endpoints
4. **Cache responses** - Cache category and user data for better performance
5. **Use proper HTTP methods** - GET for retrieval, POST for creation, PUT for updates, DELETE for removal
6. **Include meaningful data** - Provide descriptions, tags, and notes for better expense tracking

---

**Happy API Testing! 🚀**
