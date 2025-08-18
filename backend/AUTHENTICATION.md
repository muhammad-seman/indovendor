# Authentication System Documentation

## Overview

The IndoVendor authentication system provides comprehensive security features including JWT token management, password hashing, role-based access control (RBAC), and user management. This system is production-ready with proper security measures and extensive testing.

## Features

### 🔐 Core Authentication
- **JWT Token System**: Access tokens (15min) + Refresh tokens (7 days)
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Role-Based Access Control**: SuperAdmin, Vendor, Client roles
- **Token Refresh**: Automatic token renewal without re-login
- **Password Validation**: Strength checking and security requirements

### 🛡️ Security Features
- **Token Extraction**: Secure Bearer token handling
- **Token Verification**: Comprehensive validation with error codes
- **Password Strength**: Advanced validation with scoring system
- **Ownership Checks**: Resource ownership validation
- **Optional Authentication**: Public endpoints with optional user context

### 🎯 Role-Based Permissions
- **SuperAdmin**: Full system access
- **Vendor**: Business profile and product management
- **Client**: Order creation and profile management
- **Flexible Combinations**: Mix and match role requirements

## Quick Start

### 1. Environment Setup

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Password Security Configuration
BCRYPT_SALT_ROUNDS=12

# Optional: Email verification requirement
REQUIRE_EMAIL_VERIFICATION=false
```

### 2. Test Authentication System

```bash
# Run complete authentication tests
npm run auth:test

# Quick health check
npm run auth:health

# Test all systems
npm run test:all
```

### 3. Start Using Authentication

```typescript
import { authenticate, requireVendor } from '@/middleware/auth';

// Protect route with authentication
app.get('/protected', authenticate, (req, res) => {
  // req.user is available
});

// Protect with role requirement
app.get('/vendor-only', requireVendor, (req, res) => {
  // Only vendors can access
});
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | User logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/check-password-strength` | Check password strength | No |
| GET | `/api/auth/verify-token` | Verify token | Optional |

### Role Demonstration Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/auth/admin-only` | Super admin demo | SUPERADMIN |
| GET | `/api/auth/vendor-only` | Vendor demo | VENDOR |
| GET | `/api/auth/client-only` | Client demo | CLIENT |
| GET | `/api/auth/authenticated-users` | Any auth user | ANY |
| GET | `/api/auth/user/:userId/profile` | Ownership demo | OWNER |

## Usage Examples

### 1. User Registration

```typescript
// POST /api/auth/register
{
  "email": "vendor@example.com",
  "password": "SecurePassword123!",
  "phone": "+628123456789",
  "role": "VENDOR",
  "firstName": "John",
  "lastName": "Doe"
}

// Response
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "vendor@example.com",
      "role": "VENDOR",
      "isVerified": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### 2. User Login

```typescript
// POST /api/auth/login
{
  "email": "vendor@example.com",
  "password": "SecurePassword123!"
}

// Response - Same format as registration
```

### 3. Protected Route Usage

```typescript
import { authenticate, requireVendor } from '@/middleware/auth';

// Basic authentication
router.get('/profile', authenticate, (req: AuthenticatedRequest, res) => {
  const user = req.user; // Guaranteed to exist
  // Handle request
});

// Role-based access
router.post('/products', requireVendor, (req: AuthenticatedRequest, res) => {
  // Only vendors can create products
});

// Ownership validation
router.get('/user/:userId/orders', 
  requireOwnership((req) => req.params.userId),
  (req: AuthenticatedRequest, res) => {
    // Users can only access their own orders
  }
);

// Optional authentication
router.get('/public-with-user-context', optionalAuthenticate, (req: AuthenticatedRequest, res) => {
  if (req.user) {
    // User is logged in
  } else {
    // Anonymous user
  }
});
```

### 4. Token Management

```typescript
import JwtUtil from '@/utils/jwt';

// Generate tokens
const tokens = JwtUtil.generateTokenPair({
  userId: 'user_id',
  email: 'user@example.com',
  role: UserRole.VENDOR
});

// Verify tokens
const decoded = JwtUtil.verifyAccessToken(accessToken);

// Refresh token
const newAccessToken = JwtUtil.refreshAccessToken(refreshToken);

// Check expiration
const isExpired = JwtUtil.isTokenExpired(token);
```

### 5. Password Management

```typescript
import PasswordUtil from '@/utils/password';

// Hash password
const hashed = await PasswordUtil.hashPassword('password123');

// Compare password
const isMatch = await PasswordUtil.comparePassword('password123', hashed);

// Validate strength
const validation = PasswordUtil.validatePasswordStrength('password123');
console.log(validation.score); // 0-5
console.log(validation.errors); // Array of issues

// Generate random password
const randomPassword = PasswordUtil.generateRandomPassword(12, true);
```

## Middleware Reference

### Authentication Middleware

```typescript
// Required authentication
authenticate: (req, res, next) => void

// Optional authentication (doesn't fail if no token)
optionalAuthenticate: (req, res, next) => void
```

### Role-Based Middleware

```typescript
// Custom role authorization
authorize(roles: UserRole[]): Middleware

// Predefined role middleware
requireSuperAdmin: Middleware
requireVendor: Middleware  
requireClient: Middleware
requireVendorOrAdmin: Middleware
requireClientOrAdmin: Middleware
requireAnyUser: Middleware
```

### Ownership Middleware

```typescript
// User ownership validation
requireOwnership(getUserId: (req) => string): Middleware

// Vendor ownership validation  
requireVendorOwnership(getVendorId: (req) => string): Middleware
```

## Error Codes

### Authentication Errors

| Code | Status | Description |
|------|--------|-------------|
| `NO_TOKEN` | 401 | No authorization token provided |
| `TOKEN_EXPIRED` | 401 | Access token has expired |
| `INVALID_TOKEN` | 401 | Token is malformed or invalid |
| `USER_NOT_FOUND` | 401 | User associated with token not found |
| `EMAIL_NOT_VERIFIED` | 403 | Email verification required |
| `AUTH_SERVICE_ERROR` | 500 | Internal authentication error |

### Authorization Errors

| Code | Status | Description |
|------|--------|-------------|
| `AUTH_REQUIRED` | 401 | Authentication required for this endpoint |
| `INSUFFICIENT_PERMISSIONS` | 403 | User role doesn't have access |
| `OWNERSHIP_REQUIRED` | 403 | User doesn't own the resource |
| `VENDOR_REQUIRED` | 403 | Only vendors can access this resource |
| `VENDOR_OWNERSHIP_REQUIRED` | 403 | Vendor doesn't own the resource |
| `OWNERSHIP_CHECK_ERROR` | 500 | Error checking resource ownership |

## Testing

### Run Authentication Tests

```bash
# Complete test suite
npm run auth:test

# Quick health check
npm run auth:health

# Test specific components
ts-node src/utils/auth-test.ts
```

### Test Coverage

- ✅ JWT token generation and verification
- ✅ Password hashing and comparison
- ✅ Authentication service (register/login/refresh)
- ✅ Role-based access control
- ✅ Token extraction and validation
- ✅ Password strength validation
- ✅ Error handling and edge cases

## Security Best Practices

### 1. Token Security
- Use secure, random JWT secrets
- Short-lived access tokens (15 minutes)
- Longer refresh tokens (7 days)
- Implement token blacklisting for logout

### 2. Password Security
- bcrypt with 12+ salt rounds
- Password strength validation
- No password in API responses
- Secure password reset flow

### 3. Role-Based Security
- Principle of least privilege
- Resource ownership validation
- Admin bypass for system operations
- Audit trails for sensitive actions

### 4. API Security
- Consistent error responses
- Rate limiting on auth endpoints
- HTTPS in production
- CORS configuration

## Production Considerations

### 1. Environment Variables
```env
# Use strong, unique secrets
JWT_SECRET=generate-strong-secret-key-here
JWT_REFRESH_SECRET=different-strong-secret-key

# Adjust token lifetimes
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Password security
BCRYPT_SALT_ROUNDS=12

# Email verification
REQUIRE_EMAIL_VERIFICATION=true
```

### 2. Database Considerations
- Index on user email and id fields
- Regular cleanup of expired sessions
- Audit table for authentication events

### 3. Monitoring
- Track failed login attempts
- Monitor token usage patterns
- Alert on suspicious activities

### 4. Scaling
- Token blacklist in Redis
- Session management
- Load balancer considerations

## Troubleshooting

### Common Issues

1. **Token Verification Fails**
   ```bash
   # Check JWT secret configuration
   echo $JWT_SECRET
   
   # Run auth health check
   npm run auth:health
   ```

2. **Password Hashing Errors**
   ```bash
   # Check bcrypt installation
   npm list bcrypt
   
   # Test password utilities
   npm run auth:test
   ```

3. **Role Access Denied**
   - Verify user role in database
   - Check middleware configuration
   - Confirm token contains correct role

4. **Database Connection Issues**
   ```bash
   # Test database connection
   npm run db:test
   
   # Check user table
   npm run db:studio
   ```

### Debug Mode

```typescript
// Enable debug logging
process.env.DEBUG_AUTH = 'true';

// Check token payload
const decoded = JwtUtil.decodeToken(token);
console.log('Token payload:', decoded);
```

## Next Steps

After implementing authentication:

1. **Implement Email Verification**
   - Email sending service
   - Verification token system
   - Email template system

2. **Add Password Reset**
   - Reset token generation
   - Email reset links
   - Password reset validation

3. **Implement Rate Limiting**
   - Login attempt limits
   - Token request limits
   - Brute force protection

4. **Add OAuth Integration**
   - Google OAuth
   - Facebook OAuth
   - Apple OAuth

5. **Implement Session Management**
   - Active session tracking
   - Device management
   - Session invalidation

For questions or issues, run the test suite and check the implementation files for detailed examples.