# 🔧 Expense Tracker Backend - Spring Boot REST API

This is the backend service for the Expense Tracker application, built with **Spring Boot 3.2.0** and **Java 17**. It provides a comprehensive REST API for managing expenses, categories, and users with MongoDB as the database.

## 🌟 Features

- ✅ **RESTful API** - Well-designed REST endpoints
- ✅ **MongoDB Integration** - MongoDB Atlas cloud database
- ✅ **Data Validation** - Comprehensive input validation
- ✅ **Error Handling** - Global exception handling
- ✅ **Testing** - Unit and integration tests
- ✅ **CORS Support** - Cross-origin resource sharing
- ✅ **Logging** - Structured logging with SLF4J
- ✅ **Health Checks** - Spring Boot Actuator endpoints

## 🏗️ Architecture

```
backend/
├── src/main/java/com/expensetracker/
│   ├── controller/          # REST Controllers
│   │   ├── ExpenseController.java
│   │   ├── CategoryController.java
│   │   └── UserController.java
│   ├── service/            # Business Logic
│   │   ├── ExpenseService.java
│   │   ├── CategoryService.java
│   │   └── UserService.java
│   ├── repository/         # Data Access Layer
│   │   ├── ExpenseRepository.java
│   │   ├── CategoryRepository.java
│   │   └── UserRepository.java
│   ├── model/             # Entity Models
│   │   ├── Expense.java
│   │   ├── Category.java
│   │   └── User.java
│   ├── dto/              # Data Transfer Objects
│   │   ├── ExpenseRequestDto.java
│   │   ├── CategoryRequestDto.java
│   │   └── ExpenseSummaryDto.java
│   ├── exception/        # Exception Handling
│   │   └── GlobalExceptionHandler.java
│   └── ExpenseTrackerApplication.java
├── src/test/             # Test Classes
├── src/main/resources/
│   └── application.yml   # Configuration
└── pom.xml              # Maven Dependencies
```

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MongoDB Atlas account (connection string provided)

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd expense-tracker/backend
```

### 2. Install Dependencies
```bash
mvn clean install
```

### 3. Run the Application
```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`

### 4. Verify Installation
```bash
curl http://localhost:8080/api/actuator/health
```

## 📡 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication
Currently, the API doesn't require authentication (placeholder for future JWT implementation).

### Content Type
All API requests and responses use `application/json`.

### Response Format
```json
{
  "data": {},
  "message": "Success message",
  "status": 200,
  "success": true
}
```

### Error Response Format
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": {
    "amount": "Amount must be greater than 0"
  }
}
```

## 📊 API Endpoints

### Expense Management

#### Create Expense
```http
POST /expenses?userId={userId}
Content-Type: application/json

{
  "amount": 500.00,
  "category": "Food",
  "date": "2024-01-15",
  "time": "12:30:00",
  "payee": "Restaurant ABC",
  "description": "Lunch with team",
  "paymentMethod": "CREDIT_CARD",
  "tags": ["lunch", "work"],
  "location": "Mumbai",
  "notes": "Client meeting lunch"
}
```

#### Get All Expenses
```http
GET /expenses/{userId}
```

#### Get Expense by ID
```http
GET /expenses/details/{expenseId}
```

#### Update Expense
```http
PUT /expenses/{expenseId}
Content-Type: application/json

{
  "amount": 600.00,
  "category": "Food",
  "date": "2024-01-15",
  "time": "12:30:00",
  "payee": "Restaurant XYZ",
  "description": "Updated lunch",
  "paymentMethod": "UPI"
}
```

#### Delete Expense
```http
DELETE /expenses/{expenseId}
```

#### Get Expense Summary
```http
GET /expenses/{userId}/summary?period=MONTHLY&startDate=2024-01-01&endDate=2024-01-31
```

#### Get Expenses by Date Range
```http
GET /expenses/{userId}/date-range?startDate=2024-01-01&endDate=2024-01-31
```

#### Search Expenses
```http
GET /expenses/{userId}/search?query=restaurant
```

### Category Management

#### Create Category
```http
POST /categories?userId={userId}
Content-Type: application/json

{
  "name": "Healthcare",
  "description": "Medical and healthcare expenses",
  "color": "#10B981",
  "icon": "🏥"
}
```

#### Get All Categories
```http
GET /categories/{userId}
```

#### Update Category
```http
PUT /categories/{categoryId}
Content-Type: application/json

{
  "name": "Medical",
  "description": "Updated healthcare expenses",
  "color": "#EF4444",
  "icon": "⚕️"
}
```

#### Delete Category
```http
DELETE /categories/{categoryId}
```

#### Initialize Default Categories
```http
POST /categories/{userId}/initialize-defaults
```

### User Management

#### Create User
```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Get User
```http
GET /users/{userId}
```

#### Update User
```http
PUT /users/{userId}
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

#### Get User Statistics
```http
GET /users/{userId}/stats
```

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  user_id: "String (unique)",
  name: "String",
  email: "String (unique)",
  is_active: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### Category Collection
```javascript
{
  _id: ObjectId,
  category_id: "String (unique)",
  user_id: "String",
  name: "String",
  description: "String",
  color: "String",
  icon: "String",
  is_default: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### Expense Collection
```javascript
{
  _id: ObjectId,
  expense_id: "String (unique)",
  user_id: "String",
  amount: Decimal,
  category: "String",
  category_id: "String",
  date: Date,
  time: String,
  payee: "String",
  description: "String",
  payment_method: "String",
  tags: ["String"],
  location: "String",
  is_recurring: Boolean,
  recurring_frequency: "String",
  notes: "String",
  source: "String",
  created_at: Date,
  updated_at: Date
}
```

## 🧪 Testing

### Run All Tests
```bash
mvn test
```

### Run Specific Test Class
```bash
mvn test -Dtest=ExpenseControllerTest
```

### Run Integration Tests
```bash
mvn test -Dtest=ExpenseTrackerIntegrationTest
```

### Test Coverage
```bash
mvn jacoco:report
```

### Test Data
The application includes comprehensive test data:
- Sample users, categories, and expenses
- Integration tests with real MongoDB
- Mock data for unit tests

## ⚙️ Configuration

### Application Properties (application.yml)
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  data:
    mongodb:
      uri: mongodb+srv://palsamarth9:samarth@cluster0.odq0ztk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
      database: expense_tracker

logging:
  level:
    com.expensetracker: DEBUG
```

### Environment-Specific Configuration
Create `application-{profile}.yml` files for different environments:
- `application-dev.yml` - Development
- `application-test.yml` - Testing
- `application-prod.yml` - Production

## 🔍 Monitoring & Health Checks

### Health Check
```http
GET /actuator/health
```

### Application Info
```http
GET /actuator/info
```

### Metrics
```http
GET /actuator/metrics
```

## 🔒 Security Considerations

### Current Security Features
- Input validation using Bean Validation
- CORS configuration for frontend integration
- Global exception handling
- SQL injection prevention (using MongoDB)

### Future Security Enhancements
- JWT authentication
- Role-based access control
- Rate limiting
- API key authentication
- Request/response encryption

## 🚀 Deployment

### Build for Production
```bash
mvn clean package -Pprod
```

### Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/expense-tracker-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Environment Variables
```env
SPRING_DATA_MONGODB_URI=your_mongodb_connection_string
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080
```

## 🛠️ Development

### Code Style
- Follow Java naming conventions
- Use Lombok to reduce boilerplate code
- Comprehensive JavaDoc comments
- SLF4J logging with appropriate log levels

### Adding New Features
1. Create model classes in `model` package
2. Create repository interfaces in `repository` package
3. Implement business logic in `service` package
4. Create REST endpoints in `controller` package
5. Add DTOs in `dto` package for request/response
6. Write unit and integration tests

### Database Indexes
Ensure proper indexing for performance:
```javascript
// User collection
db.users.createIndex({ "user_id": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })

// Category collection
db.categories.createIndex({ "category_id": 1 }, { unique: true })
db.categories.createIndex({ "user_id": 1, "name": 1 }, { unique: true })

// Expense collection
db.expenses.createIndex({ "expense_id": 1 }, { unique: true })
db.expenses.createIndex({ "user_id": 1, "date": -1 })
db.expenses.createIndex({ "user_id": 1, "category": 1 })
```

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Issues
```bash
# Check connection string format
# Ensure IP whitelist includes your IP
# Verify credentials
```

#### Port Already in Use
```bash
# Change port in application.yml
server:
  port: 8081
```

#### Test Failures
```bash
# Ensure MongoDB test container is running
# Check test database configuration
mvn clean test
```

## 📚 Dependencies

### Core Dependencies
- **Spring Boot Starter Web** - REST API framework
- **Spring Boot Starter Data MongoDB** - MongoDB integration
- **Spring Boot Starter Validation** - Input validation
- **Spring Boot Starter Test** - Testing framework
- **Lombok** - Reduce boilerplate code

### Development Dependencies
- **Spring Boot DevTools** - Development utilities
- **Testcontainers MongoDB** - Testing with real MongoDB
- **JUnit 5** - Unit testing
- **Mockito** - Mocking framework

## 🤝 Contributing

1. Follow the existing code structure
2. Add comprehensive tests for new features
3. Update documentation
4. Follow commit message conventions
5. Create pull requests with detailed descriptions

## 📞 API Support

For API-related questions:
- Check the integration tests for usage examples
- Use the provided cURL examples
- Refer to the error response format for troubleshooting

---

**Happy Coding! 🚀**
