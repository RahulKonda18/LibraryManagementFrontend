# Library Management System - Frontend

A modern, responsive React-based frontend application for a comprehensive library management system. This application provides role-based access control with separate interfaces for administrators and subscribers, featuring book management, user management, borrowing system, and fine collection.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT Token-based Authentication**: Secure authentication using JSON Web Tokens stored in cookies
- **Role-based Access Control**: Separate interfaces for ADMIN and SUBSCRIBER roles
- **Protected Routes**: Automatic route protection and authentication checks
- **Automatic Token Management**: Tokens are automatically handled and refreshed

### 📚 Book Management
- **Book Catalog**: Browse and search books with pagination
- **Genre Filtering**: Filter books by genre
- **Book Details**: View comprehensive book information
- **Admin Book Management**: Add, edit, and delete books (Admin only)
- **Copy Management**: Track available copies of each book

### 👥 User Management
- **User Registration**: New user signup with validation
- **User Profiles**: View and manage user information
- **Admin User Management**: Manage subscribers and admin accounts
- **Role Management**: Assign and manage user roles

### 📖 Borrowing System
- **Book Borrowing**: Borrow books with automatic copy tracking
- **Book Returns**: Return books with fine calculation
- **Borrow History**: Track all borrowing activities
- **Active Borrows**: View currently borrowed books

### 💰 Financial Management
- **Wallet System**: Digital wallet for subscribers
- **Fine Collection**: Automatic fine calculation for late returns
- **Payment Processing**: Pay fines and add funds to wallet
- **Financial Reports**: Admin dashboard for financial overview

### 🎨 User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with modern styling
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: Comprehensive error handling and user feedback

## 🏗️ Architecture

### Technology Stack
- **Frontend Framework**: React 19.1.1
- **Routing**: React Router DOM 7.8.1
- **State Management**: React Context API
- **Authentication**: JWT with js-cookie
- **Styling**: CSS3 with modern design patterns
- **Build Tool**: Create React App

### Project Structure
```
src/
├── Components/                 # React components
│   ├── Admin/                 # Admin-specific components
│   │   ├── AdminBooks.js      # Book management interface
│   │   ├── AdminSubscribers.js # Subscriber management
│   │   ├── RemoveSubscribers.js # User removal interface
│   │   └── FineCollections.js # Fine management
│   ├── Auth/                  # Authentication components
│   │   ├── Login.js           # Login form
│   │   └── SignUp.js          # Registration form
│   ├── BookList/              # Book display components
│   ├── FilterBar/             # Search and filter components
│   ├── Header/                # Navigation header
│   ├── Footer/                # Application footer
│   ├── Home/                  # Main dashboard
│   ├── Subscriber/            # Subscriber-specific components
│   │   ├── Wallet.js          # Wallet management
│   │   └── BorrowHistory.js   # Borrowing history
│   ├── LoadingSpinner/        # Loading indicators
│   ├── ProtectedRoute.js      # Route protection
│   └── RoleRoute.js           # Role-based routing
├── contexts/                  # React contexts
│   └── AuthContext.js         # Authentication context
├── services/                  # API services
│   ├── apiService.js          # Main API service
│   └── authService.js         # Authentication service
├── App.js                     # Main application component
└── index.js                   # Application entry point
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API server running on `http://localhost:8080`

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LibraryManagementFrontend/library
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🔧 Configuration

### Environment Variables
The application is configured to connect to a backend API at `http://localhost:8080`. To change this:

1. Update the `API_BASE_URL` in `src/services/authService.js`
2. Update any hardcoded API endpoints in `src/services/apiService.js`

### Backend API Requirements
The frontend expects the following backend endpoints:

#### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

#### Books
- `GET /api/books` - Get paginated books
- `GET /api/books/{id}` - Get specific book
- `POST /api/books` - Add new book (Admin)
- `PUT /api/books/{id}` - Update book (Admin)
- `DELETE /api/books/{id}` - Delete book (Admin)
- `GET /api/books/genres` - Get all genres
- `GET /api/books/genre` - Get books by genre

#### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/{id}` - Get specific user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (Admin)
- `GET /api/users/{id}/wallet` - Get wallet balance
- `POST /api/users/{id}/wallet/add` - Add funds to wallet

#### Borrowing
- `POST /api/borrows/{userId}/books/{bookId}/borrow` - Borrow book
- `POST /api/borrows/{userId}/books/{bookId}/return` - Return book
- `GET /api/borrows/{userId}/history` - Get borrow history
- `GET /api/borrows/{userId}/active` - Get active borrows
- `GET /api/borrows/active` - Get all active borrows (Admin)
- `POST /api/borrows/{userId}/fines/{borrowId}/pay` - Pay fine

## 👤 User Roles & Permissions

### Admin Role
- **Book Management**: Add, edit, delete books
- **User Management**: View, edit, delete subscribers
- **Financial Overview**: View total fines collected
- **System Monitoring**: Monitor active borrows and unpaid fines

### Subscriber Role
- **Book Browsing**: Browse and search books
- **Borrowing**: Borrow and return books
- **Wallet Management**: Add funds and pay fines
- **History**: View borrowing history

## 🔐 Authentication System

### JWT Token Management
- Tokens are stored securely in HTTP cookies
- Automatic token expiration handling (24 hours)
- Automatic logout on token expiry
- Protection against XSS attacks

### Security Features
- **Cookie-based Storage**: Secure token storage using js-cookie
- **Automatic Cleanup**: Tokens are cleared on logout
- **Route Protection**: Unauthenticated users are redirected to login
- **Role-based Access**: Components are protected based on user roles

## 📱 Component Documentation

### Core Components

#### AuthContext (`src/contexts/AuthContext.js`)
Manages global authentication state and provides authentication methods.

```javascript
const { user, login, logout, isAuthenticated, isAdmin } = useAuth();
```

#### ProtectedRoute (`src/Components/ProtectedRoute.js`)
Protects routes that require authentication.

```javascript
<ProtectedRoute>
  <Component />
</ProtectedRoute>
```

#### RoleRoute (`src/Components/RoleRoute.js`)
Protects routes based on user roles.

```javascript
<RoleRoute allowedRole="ADMIN">
  <AdminComponent />
</RoleRoute>
```

### Service Layer

#### AuthService (`src/services/authService.js`)
Handles authentication logic, token management, and API requests.

```javascript
// Login
const result = await authService.login(username, password);

// Check authentication
const isAuth = authService.isAuthenticated();

// Make authenticated request
const data = await authService.apiRequest('/api/endpoint');
```

#### ApiService (`src/services/apiService.js`)
Centralized API service for all backend communications.

```javascript
// Get books
const books = await apiService.getBooks(page, size);

// Borrow book
await apiService.borrowBookWithUser(userId, bookId);

// Add book (Admin)
await apiService.addBook(bookData);
```

## 🎨 Styling & UI

### Design System
- **Color Scheme**: Modern blue and white theme
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent padding and margins
- **Responsive**: Mobile-first responsive design

### CSS Architecture
- Component-specific CSS files
- Consistent naming conventions
- Modular styling approach
- Responsive breakpoints

## 🧪 Testing

### Manual Testing
1. **Authentication Flow**
   - Test login with valid/invalid credentials
   - Test registration process
   - Verify token storage and expiration

2. **Role-based Access**
   - Test admin features with admin account
   - Test subscriber features with subscriber account
   - Verify route protection

3. **Book Management**
   - Test book browsing and filtering
   - Test borrowing and returning books
   - Test admin book management features

### Test Users
- **Admin**: username: `admin2`, password: `admin123`
- **Subscriber**: username: `subscriber1`, password: `password123`

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Static Hosting**: Deploy to Netlify, Vercel, or similar
- **Docker**: Containerize the application
- **Traditional Hosting**: Deploy to web server

### Environment Configuration
Update API endpoints for production environment in the service files.

## 🔧 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify backend server is running on port 8080
   - Check CORS configuration on backend
   - Verify API endpoints match backend implementation

2. **Authentication Issues**
   - Clear browser cookies and try again
   - Check JWT token format in backend response
   - Verify token expiration settings

3. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check for version conflicts in package.json
   - Verify Node.js version compatibility

## 📝 API Documentation

For detailed API documentation, refer to the backend API documentation or the individual service files in `src/services/`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the authentication documentation files
- Contact the development team

---

**Note**: This frontend application requires a compatible backend API server to function properly. Ensure the backend is running and properly configured before using the frontend application.
