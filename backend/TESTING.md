# NeoNest Backend - Testing Guide

## Test Setup

### Install Test Dependencies
```bash
npm install --save-dev jest supertest
```

### Test Scripts
Add to package.json:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Test Configuration

### Jest Configuration (jest.config.js)
```javascript
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middlewares/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

## Test Categories

### 1. Unit Tests
- Model validation tests
- Utility function tests
- Middleware tests
- Controller logic tests

### 2. Integration Tests
- API endpoint tests
- Database integration tests
- External service integration tests

### 3. End-to-End Tests
- Complete user workflows
- Payment flow tests
- Authentication flow tests

## Sample Test Files

### Authentication Tests
```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../app');

describe('Authentication', () => {
  test('should register a new user', async () => {
    const userData = {
      role: 'woman',
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(userData.email);
  });
});
```

### Model Tests
```javascript
// tests/models/user.test.js
const User = require('../../models/user.model');

describe('User Model', () => {
  test('should hash password before saving', async () => {
    const user = new User({
      role: 'woman',
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      password: 'password123'
    });

    await user.save();
    expect(user.password).not.toBe('password123');
    expect(user.password.length).toBeGreaterThan(10);
  });
});
```

## Test Database Setup

### Test Environment
```javascript
// tests/setup.js
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});
```

## Mock External Services

### Razorpay Mock
```javascript
// tests/mocks/razorpay.mock.js
jest.mock('razorpay', () => {
  return jest.fn().mockImplementation(() => ({
    orders: {
      create: jest.fn().mockResolvedValue({
        id: 'order_test123',
        amount: 10000,
        currency: 'INR'
      })
    },
    payments: {
      refund: jest.fn().mockResolvedValue({
        id: 'refund_test123',
        amount: 10000
      })
    }
  }));
});
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test tests/auth.test.js
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

## Test Data Management

### Test Fixtures
```javascript
// tests/fixtures/user.fixtures.js
const userFixtures = {
  validWoman: {
    role: 'woman',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '9876543210',
    password: 'password123'
  },
  validOrganization: {
    role: 'organization',
    name: 'Care Org',
    email: 'org@example.com',
    phone: '9876543211',
    password: 'password123'
  }
};

module.exports = userFixtures;
```

## Continuous Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm test
```

## Performance Testing

### Load Testing with Artillery
```bash
npm install -g artillery
artillery quick --count 10 --num 5 http://localhost:5000/api/auth/login
```

### Memory Leak Testing
```bash
npm install -g clinic
clinic doctor -- node server.js
```

## Security Testing

### OWASP ZAP Integration
```bash
# Install OWASP ZAP
# Run security scans against API endpoints
```

### Input Validation Testing
- Test SQL injection attempts
- Test XSS payloads
- Test file upload vulnerabilities
- Test authentication bypasses
