# Authentication System Documentation

This document describes the JWT token-based authentication system implemented in the Library Management Frontend.

## Features

- **JWT Token Authentication**: Secure token-based authentication
- **Protected Routes**: Only authenticated users can access the library features
- **Login/Signup Pages**: Modern, responsive authentication forms
- **Automatic Token Management**: Tokens are automatically stored and managed
- **Token Expiration Handling**: Automatic logout when tokens expire

## Components

### Authentication Context (`src/contexts/AuthContext.js`)
- Manages authentication state globally
- Handles JWT token storage and validation
- Provides authentication methods (login, signup, logout)
- Automatically checks token expiration

### Login Component (`src/Components/Auth/Login.js`)
- User login form with email and password
- Form validation and error handling
- Redirects to home page on successful login

### Sign Up Component (`src/Components/Auth/SignUp.js`)
- User registration form with name, email, and password
- Password confirmation validation
- Email format validation
- Minimum password length requirement (6 characters)

### Protected Route Component (`src/Components/ProtectedRoute.js`)
- Guards routes that require authentication
- Shows loading spinner while checking authentication
- Redirects to login page if not authenticated

## API Endpoints

The authentication system expects the following backend endpoints:

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

## Usage

### Making Authenticated API Calls
All API calls to protected endpoints should include the JWT token in the Authorization header:

```javascript
import { useAuth } from '../contexts/AuthContext';

const { getAuthHeaders } = useAuth();

const response = await fetch('/api/protected-endpoint', {
  headers: getAuthHeaders()
});
```

### Checking Authentication Status
```javascript
import { useAuth } from '../contexts/AuthContext';

const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  console.log('User is logged in:', user.name);
}
```

### Logging Out
```javascript
import { useAuth } from '../contexts/AuthContext';

const { logout } = useAuth();
logout(); // This will clear the token and redirect to login
```

## Security Features

1. **Token Storage**: JWT tokens are stored in localStorage
2. **Automatic Expiration**: Tokens are automatically validated and cleared when expired
3. **Protected Routes**: Unauthenticated users are redirected to login
4. **Form Validation**: Client-side validation for all authentication forms
5. **Error Handling**: Comprehensive error handling for authentication failures

## File Structure

```
src/
├── contexts/
│   └── AuthContext.js          # Authentication context
├── Components/
│   ├── Auth/
│   │   ├── Login.js            # Login component
│   │   ├── SignUp.js           # Sign up component
│   │   ├── Auth.css            # Authentication styles
│   │   └── index.js            # Auth components export
│   ├── Home/
│   │   ├── Home.js             # Protected home component
│   │   └── index.js            # Home component export
│   ├── LoadingSpinner/
│   │   ├── LoadingSpinner.js   # Loading component
│   │   ├── LoadingSpinner.css  # Loading styles
│   │   └── index.js            # Loading component export
│   ├── ProtectedRoute.js       # Route protection component
│   └── Header/
│       └── index.js            # Updated header with auth status
└── App.js                      # Main app with routing
```

## Setup Instructions

1. Install required dependencies:
   ```bash
   npm install react-router-dom jwt-decode
   ```

2. Ensure your backend provides the required authentication endpoints

3. Update API base URLs in the authentication context if needed

4. The authentication system will automatically handle token management

## Notes

- The system assumes JWT tokens are returned from the backend
- Token expiration is handled automatically
- All protected API calls should use the `getAuthHeaders()` method
- The system provides fallback demo data when the backend is unavailable
