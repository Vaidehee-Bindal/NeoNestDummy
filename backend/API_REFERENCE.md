# NeoNest Backend - API Endpoints Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| GET | `/auth/verify-email/:token` | Verify email address | No |
| POST | `/auth/send-phone-otp` | Send OTP to phone | No |
| POST | `/auth/verify-phone-otp` | Verify phone OTP | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password | No |
| GET | `/auth/profile` | Get user profile | Yes |
| POST | `/auth/logout` | Logout user | Yes |

## Woman Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/woman/profile` | Get woman profile | Yes (Woman) |
| PUT | `/woman/profile` | Update woman profile | Yes (Woman) |
| GET | `/woman/caregivers/search` | Search caregivers | Yes (Woman) |
| GET | `/woman/caregivers/:id` | Get caregiver details | Yes (Woman) |
| POST | `/woman/bookings` | Create booking | Yes (Woman) |
| GET | `/woman/bookings` | Get woman's bookings | Yes (Woman) |
| PUT | `/woman/bookings/:id/cancel` | Cancel booking | Yes (Woman) |
| POST | `/woman/bookings/:id/review` | Submit review | Yes (Woman) |

## Organization Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/org/profile` | Get org profile | Yes (Org) |
| PUT | `/org/profile` | Update org profile | Yes (Org) |
| POST | `/org/caregivers` | Create caregiver | Yes (Org) |
| GET | `/org/caregivers` | Get org's caregivers | Yes (Org) |
| PUT | `/org/caregivers/:id` | Update caregiver | Yes (Org) |
| GET | `/org/bookings` | Get org's bookings | Yes (Org) |
| PUT | `/org/bookings/:id/accept` | Accept booking | Yes (Org) |
| PUT | `/org/bookings/:id/reject` | Reject booking | Yes (Org) |
| PUT | `/org/bookings/:id/status` | Update booking status | Yes (Org) |

## Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/dashboard` | Get dashboard data | Yes (Admin) |
| GET | `/admin/analytics` | Get analytics data | Yes (Admin) |
| GET | `/admin/verifications` | Get pending verifications | Yes (Admin) |
| POST | `/admin/verify/:id` | Verify user | Yes (Admin) |
| GET | `/admin/caregivers` | Get all caregivers | Yes (Admin) |
| POST | `/admin/caregivers/:id/verify` | Verify caregiver | Yes (Admin) |
| GET | `/admin/bookings` | Get all bookings | Yes (Admin) |
| POST | `/admin/bookings/:id/forward` | Forward booking | Yes (Admin) |
| GET | `/admin/incidents` | Get incidents | Yes (Admin) |
| PUT | `/admin/incidents/:id/handle` | Handle incident | Yes (Admin) |

## Payment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/payments/create-order` | Create payment order | Yes |
| POST | `/payments/verify` | Verify payment | Yes |
| GET | `/payments/:id` | Get payment details | Yes |
| POST | `/payments/:id/refund` | Process refund | Yes |
| POST | `/payments/webhook` | Razorpay webhook | No |

## AI Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/ai/chat` | Chat with AI | Yes (Woman) |
| GET | `/ai/recommendations` | Get recommendations | Yes (Woman) |
| GET | `/ai/health-summary` | Generate health summary | Yes (Woman) |
| GET | `/ai/caregiver-compatibility/:id` | Analyze compatibility | Yes (Woman) |
| GET | `/ai/insights` | Get AI insights | Yes (Admin) |

## Response Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

## Pagination Format

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

## Rate Limits

| Endpoint Type | Limit |
|---------------|-------|
| General API | 100 requests per 15 minutes |
| Authentication | 5 requests per 15 minutes |
| Payment | 3 requests per 5 minutes |

## File Upload Limits

| File Type | Max Size |
|-----------|----------|
| Images | 10MB |
| Documents | 10MB |
| All Files | 10MB |

## Supported File Types

- Images: JPEG, JPG, PNG
- Documents: PDF, DOC, DOCX
