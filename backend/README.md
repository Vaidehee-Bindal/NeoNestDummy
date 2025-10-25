# NeoNest Backend API Documentation

## Overview
NeoNest is a hybrid neonatal and postnatal care platform connecting new mothers with verified caretakers, empowering unemployed women through flexible work opportunities.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
```
**Body:**
```json
{
  "role": "woman|organization|admin",
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string"
}
```

#### Login
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

#### Verify Email
```http
GET /api/auth/verify-email/:token
```

#### Send Phone OTP
```http
POST /api/auth/send-phone-otp
```
**Body:**
```json
{
  "phone": "string"
}
```

#### Verify Phone OTP
```http
POST /api/auth/verify-phone-otp
```
**Body:**
```json
{
  "phone": "string",
  "otp": "string"
}
```

### Woman Routes (`/api/woman`)

#### Get Profile
```http
GET /api/woman/profile
```

#### Update Profile
```http
PUT /api/woman/profile
```

#### Search Caregivers
```http
GET /api/woman/caregivers/search?city=&skills=&budgetMin=&budgetMax=
```

#### Get Caregiver Details
```http
GET /api/woman/caregivers/:caregiverId
```

#### Create Booking
```http
POST /api/woman/bookings
```

#### Get Bookings
```http
GET /api/woman/bookings
```

#### Cancel Booking
```http
PUT /api/woman/bookings/:bookingId/cancel
```

#### Submit Review
```http
POST /api/woman/bookings/:bookingId/review
```

### Organization Routes (`/api/org`)

#### Get Profile
```http
GET /api/org/profile
```

#### Update Profile
```http
PUT /api/org/profile
```

#### Create Caregiver
```http
POST /api/org/caregivers
```

#### Get Caregivers
```http
GET /api/org/caregivers
```

#### Update Caregiver
```http
PUT /api/org/caregivers/:caregiverId
```

#### Get Bookings
```http
GET /api/org/bookings
```

#### Accept Booking
```http
PUT /api/org/bookings/:bookingId/accept
```

#### Reject Booking
```http
PUT /api/org/bookings/:bookingId/reject
```

### Admin Routes (`/api/admin`)

#### Get Dashboard
```http
GET /api/admin/dashboard
```

#### Get Verifications
```http
GET /api/admin/verifications
```

#### Verify User
```http
POST /api/admin/verify/:userId
```

#### Get Caregivers
```http
GET /api/admin/caregivers
```

#### Verify Caregiver
```http
POST /api/admin/caregivers/:caregiverId/verify
```

#### Get Bookings
```http
GET /api/admin/bookings
```

#### Forward Booking
```http
POST /api/admin/bookings/:bookingId/forward
```

#### Get Incidents
```http
GET /api/admin/incidents
```

#### Handle Incident
```http
PUT /api/admin/incidents/:incidentId/handle
```

### Payment Routes (`/api/payments`)

#### Create Order
```http
POST /api/payments/create-order
```

#### Verify Payment
```http
POST /api/payments/verify
```

#### Get Payment Details
```http
GET /api/payments/:paymentId
```

#### Process Refund
```http
POST /api/payments/:paymentId/refund
```

### AI Routes (`/api/ai`)

#### Chat with AI
```http
POST /api/ai/chat
```

#### Get Recommendations
```http
GET /api/ai/recommendations
```

#### Generate Health Summary
```http
GET /api/ai/health-summary
```

#### Analyze Caregiver Compatibility
```http
GET /api/ai/caregiver-compatibility/:caregiverId
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "string",
  "errors": []
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- General endpoints: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes
- Payment endpoints: 3 requests per 5 minutes

## Environment Variables

See `env.example` file for required environment variables.
