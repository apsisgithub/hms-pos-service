# HMS Core Service - End-to-End Testing

This directory contains comprehensive E2E tests for all HMS Core Service modules using NestJS testing framework with real server instances.

## 🏗️ Test Architecture

### Components

1. **TestSetup** (`test-setup.ts`) - Manages NestJS application lifecycle
2. **TestData** (`test-data.ts`) - Contains realistic test data for all modules
3. **DatabaseSeeder** (`database-seeder.ts`) - Handles test database setup/cleanup
4. **Individual Test Files** - E2E tests for each module

### Test Coverage

The testing suite covers all major HMS modules:

- ✅ Buildings Management
- ✅ Business Sources
- ✅ Payment Modes
- ✅ Currencies
- ✅ Departments
- ✅ Floors
- ✅ Room Types
- ✅ Taxes
- ✅ Seasons
- ✅ Guests
- ✅ Roles
- ✅ SBU (Strategic Business Units)
- ✅ Discounts

## 🚀 Running Tests

### Prerequisites

1. Ensure your database is running and accessible
2. Update your `.env` file with test database credentials
3. Install dependencies: `npm install`

### Available Commands

```bash
# Setup test database with seed data
npm run test:e2e:setup

# Run all E2E tests
npm run test:e2e

# Clean up test data
npm run test:e2e:teardown

# Complete test cycle (setup + run + cleanup)
npm run test:e2e:all

# Run tests with detailed reporting
npm run test:e2e:run

# Run specific module tests
npm run test:e2e -- buildings.e2e-spec.ts
npm run test:e2e -- business-sources.e2e-spec.ts
```

### Test Execution Flow

1. **Setup Phase**: Seeds required test data (SBU, Buildings, Roles, Users)
2. **Test Phase**: Runs comprehensive API tests for each module
3. **Cleanup Phase**: Removes all test data from database

## 📋 Test Cases Per Module

Each module includes **8 comprehensive test cases**:

### CREATE Operations (POST)
1. ✅ Create with valid data
2. ✅ Create with different valid data
3. ❌ Validation error with invalid data
4. ❌ Authentication error without token

### READ Operations (GET)
5. ✅ List all with pagination
6. ✅ List all without pagination
7. ✅ Get specific item by ID
8. ❌ 404 error for non-existent ID

### UPDATE Operations (PATCH)
9. ✅ Update with valid data
10. ❌ 404 error for non-existent item

### DELETE Operations (DELETE)
11. ✅ Soft delete existing item
12. ❌ 404 error for non-existent item

## 🧪 Test Data Structure

### Realistic Hotel Industry Data

All test data uses realistic hotel industry examples:

```typescript
// Example: Buildings
buildings: {
  valid: {
    sbu_id: 1,
    name: 'Grand Plaza Hotel Main Building',
    description: 'Main building housing reception, restaurant, and premium suites',
    status: BuildingStatus.Active,
  }
}

// Example: Business Sources
businessSources: {
  valid: {
    sbu_id: 1,
    name: 'Booking.com',
    code: 'BDC',
    bin: 'BIN001',
    address: '123 Travel Street, Amsterdam, Netherlands',
    color_tag: '#FF5722',
    status: BusinessSourceStatus.Active,
  }
}
```

## 🔧 Configuration

### Jest E2E Configuration (`jest-e2e.json`)

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
```

### Authentication

Tests use mock JWT tokens for authentication. Update `TestData.mockAuthToken` if your JWT structure differs.

## 📊 Test Results

### Expected Output

```
🚀 Starting HMS Core Service E2E Tests...

📋 Running tests for: buildings.e2e-spec.ts
✅ buildings.e2e-spec.ts - PASSED

📋 Running tests for: business-sources.e2e-spec.ts
✅ business-sources.e2e-spec.ts - PASSED

...

============================================================
📊 TEST SUMMARY
============================================================
Total Tests: 13
✅ Passed: 13
❌ Failed: 0
📈 Success Rate: 100.0%
============================================================
```

## 🛠️ Customization

### Adding New Module Tests

1. **Add test data** to `test-data.ts`:
```typescript
newModule: {
  valid: { /* valid data */ },
  validSecond: { /* another valid data */ },
  invalid: { /* invalid data */ },
  update: { /* update data */ }
}
```

2. **Generate test file** using the generator:
```bash
node test/generate-tests.js
```

3. **Update the module list** in `run-all-tests.ts`

### Modifying Test Scenarios

Each test file follows a consistent pattern. Modify individual test files to:
- Add custom validation scenarios
- Test specific business logic
- Add performance benchmarks
- Include integration tests

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify database is running
   - Check `.env` configuration
   - Ensure test database exists

2. **Authentication Failures**
   - Update mock JWT token in `test-data.ts`
   - Verify JWT strategy configuration

3. **Validation Errors**
   - Check DTO validation rules
   - Update test data to match current validation

4. **Timeout Issues**
   - Increase Jest timeout in configuration
   - Optimize database queries
   - Check server performance

### Debug Mode

Run tests in debug mode:
```bash
npm run test:debug -- --config ./test/jest-e2e.json
```

## 📈 Best Practices

1. **Data Isolation**: Each test creates and cleans up its own data
2. **Realistic Data**: Use hotel industry-relevant test data
3. **Comprehensive Coverage**: Test all CRUD operations and edge cases
4. **Error Scenarios**: Include negative test cases
5. **Performance**: Monitor test execution time
6. **Maintainability**: Keep test data centralized and reusable

## 🔄 Continuous Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run E2E tests
        run: npm run test:e2e:all
```

## 📝 Contributing

When adding new features:
1. Create corresponding test cases
2. Update test data with realistic examples
3. Ensure all tests pass
4. Update documentation

---

**Happy Testing! 🎉**