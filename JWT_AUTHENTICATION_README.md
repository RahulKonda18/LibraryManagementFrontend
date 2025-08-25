# JWT Authentication Implementation - Frontend

This document explains how JWT (JSON Web Token) authentication has been implemented in the Library Management Frontend.

## Overview

The frontend now uses JWT tokens stored in cookies for authentication and authorization. This provides a more secure and simplified authentication system compared to the previous localStorage approach.

## Key Changes Made

### 1. Cookie-Based Token Storage
- **Before**: JWT tokens were stored in localStorage
- **After**: JWT tokens are stored in HTTP-only cookies using `js-cookie` library
- **Benefits**: Better security, automatic token expiration, protection against XSS attacks

### 2. Simplified Authentication Service
- Created `src/services/authService.js` - Centralized authentication logic
- Created `src/services/apiService.js` - Centralized API calls with automatic token handling
- Removed complex token decoding and validation logic

### 3. Updated Components
- **AuthContext**: Simplified to use the new auth service
- **Login/SignUp**: Updated to handle JWT responses properly
- **Home**: Updated to use the new API service
- **RoleRoute**: Updated to use simplified role checking methods

## Authentication Flow

1. **User Login**: 
   - User enters credentials
   - Frontend calls `/api/users/login`
   - Backend returns JWT token and user data
   - Frontend stores token in cookie and user data in separate cookie

2. **API Requests**:
   - All API requests automatically include JWT token in Authorization header
   - If token expires (401 response), user is automatically logged out and redirected to login

3. **User Logout**:
   - Cookies are cleared
   - User is redirected to login page

## File Structure

```
src/
├── services/
│   ├── authService.js     # Authentication service with cookie management
│   └── apiService.js      # API service with automatic token handling
├── contexts/
│   └── AuthContext.js     # Simplified React context
└── Components/
    ├── Auth/
    │   ├── Login.js       # Updated login component
    │   └── SignUp.js      # Updated signup component
    ├── Home/
    │   └── Home.js        # Updated to use API service
    └── RoleRoute.js       # Updated role checking
```

## Key Features

### 1. Automatic Token Management
```javascript
// Token is automatically included in all API requests
const data = await apiService.getBooks();
```

### 2. Automatic Logout on Token Expiry
```javascript
// If token expires, user is automatically logged out
if (response.status === 401) {
  this.logout();
  window.location.href = '/login';
}
```

### 3. Simplified Role Checking
```javascript
// Easy role checking methods
const { isAdmin, isSubscriber } = useAuth();
```

### 4. Cookie Security
- Tokens expire after 24 hours
- Cookies are automatically cleared on logout
- Protection against XSS attacks

## Usage Examples

### Login
```javascript
const { login } = useAuth();
const result = await login(username, password);
if (result.success) {
  // User is logged in, token stored in cookie
  navigate('/');
}
```

### Making API Calls
```javascript
import apiService from '../services/apiService';

// Get books (token automatically included)
const books = await apiService.getBooks();

// Borrow a book (token automatically included)
await apiService.borrowBook(bookId);
```

### Checking Authentication Status
```javascript
const { isAuthenticated, isAdmin, isSubscriber } = useAuth();

if (isAuthenticated) {
  if (isAdmin) {
    // Show admin features
  } else if (isSubscriber) {
    // Show subscriber features
  }
}
```

## Security Benefits

1. **XSS Protection**: Cookies with httpOnly flag prevent JavaScript access
2. **Automatic Expiration**: Tokens expire after 24 hours
3. **Secure Storage**: No sensitive data in localStorage
4. **Automatic Cleanup**: Cookies are cleared on logout

## Backend Integration

The frontend now properly integrates with the JWT-enabled backend:

- **Login**: Receives JWT token from `/api/users/login`
- **API Calls**: Includes `Authorization: Bearer <token>` header
- **Error Handling**: Handles 401/403 responses appropriately

## Testing

### Test Users
- **Admin**: username: `admin2`, password: `admin123`
- **Subscriber**: username: `subscriber1`, password: `password123`

### Manual Testing
1. Start the backend server
2. Start the frontend: `npm start`
3. Navigate to `/login`
4. Use test credentials to login
5. Verify JWT token is stored in cookies
6. Test API calls work with authentication

## Dependencies Added

- `js-cookie`: For secure cookie management

## Migration Notes

- Previous localStorage tokens are no longer used
- All components now use the simplified auth service
- API calls are centralized through the apiService
- Role checking is simplified with dedicated methods

## Future Enhancements

1. **Token Refresh**: Implement automatic token refresh before expiration
2. **Remember Me**: Add option to extend token expiration
3. **Multi-tab Support**: Ensure authentication state syncs across tabs
4. **Offline Support**: Cache user data for offline access
