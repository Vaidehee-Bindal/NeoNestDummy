# NeoNest Backend - Deployment Guide

## Prerequisites
- Node.js 16+ 
- MongoDB 4.4+
- AWS Account (for S3)
- Razorpay Account
- Twilio Account (for SMS)

## Local Development Setup

### 1. Clone and Install
```bash
cd backend
npm install
```

### 2. Environment Configuration
```bash
cp env.example .env
# Edit .env with your configuration
```

### 3. Database Setup
```bash
# Start MongoDB locally or use MongoDB Atlas
mongod
```

### 4. Run Development Server
```bash
npm run dev
```

## Production Deployment

### 1. Environment Variables
Set the following environment variables:

```bash
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/neonest

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=neonest-documents

# AI Service
AI_SERVICE_URL=https://your-ai-service.com/api/ai
OPENAI_API_KEY=your-openai-key

# Frontend
FRONTEND_URL=https://your-frontend-domain.com
```

### 2. Database Setup
- Use MongoDB Atlas for production
- Configure connection string
- Set up database indexes
- Enable backup and monitoring

### 3. File Storage Setup
- Create AWS S3 bucket
- Configure CORS policy
- Set up IAM user with S3 permissions
- Configure bucket policies

### 4. Payment Gateway Setup
- Create Razorpay account
- Get API keys
- Configure webhook endpoints
- Test payment flows

### 5. Email Service Setup
- Configure SMTP settings
- Set up email templates
- Test email delivery
- Monitor email logs

### 6. SMS Service Setup
- Create Twilio account
- Get credentials
- Configure phone numbers
- Test SMS delivery

## Deployment Options

### Option 1: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 2: Render
```bash
# Connect GitHub repository
# Set environment variables in Render dashboard
# Deploy automatically on push
```

### Option 3: AWS EC2
```bash
# Launch EC2 instance
# Install Node.js and PM2
# Clone repository
# Configure environment
# Start with PM2
pm2 start server.js --name neonest-backend
```

### Option 4: Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Monitoring & Maintenance

### 1. Health Checks
- Monitor `/health` endpoint
- Set up uptime monitoring
- Configure alerts

### 2. Logging
- Configure log aggregation
- Set up error tracking
- Monitor performance metrics

### 3. Database Monitoring
- Monitor connection pools
- Track query performance
- Set up backup schedules

### 4. Security Monitoring
- Monitor failed login attempts
- Track API usage patterns
- Set up security alerts

## Scaling Considerations

### 1. Horizontal Scaling
- Use load balancers
- Implement session management
- Configure database clustering

### 2. Caching
- Implement Redis for session storage
- Cache frequently accessed data
- Use CDN for static assets

### 3. Database Optimization
- Implement read replicas
- Optimize queries and indexes
- Consider sharding for large datasets

## Backup & Recovery

### 1. Database Backups
- Automated daily backups
- Point-in-time recovery
- Cross-region replication

### 2. File Backups
- S3 versioning enabled
- Cross-region replication
- Regular backup verification

### 3. Configuration Backups
- Version control for configs
- Environment variable backups
- Disaster recovery procedures
