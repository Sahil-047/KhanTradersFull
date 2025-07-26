# Khan Traders - Backend-Frontend Integration

This project integrates a Node.js backend with a React frontend for OTP-based role-based registration and user management.

## Features Implemented

### ✅ OTP-based Role-based Registration
- Users can register as either "User" or "Admin"
- OTP verification required for registration
- Role-based routing after registration

### ✅ Role-based Login
- Users must select their role (User/Admin) before logging in
- Different endpoints for admin and user authentication
- Role-based dashboard routing

### ✅ User Management
- Admin dashboard to view all users
- Premium status management
- User profile viewing and editing

### ✅ Premium User Flow
- Non-premium users see membership page
- Premium users access full dashboard
- Admin can toggle premium status

## Backend Setup

1. Navigate to the backend directory:
```bash
cd KhanTraders/Backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Create .env file
JWT_SECRET=your-secret-key
MONGODB_URI=your-mongodb-connection-string
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Testing the Integration

### Without Backend (Mock Mode)
The frontend includes fallback mechanisms for testing without the backend:

1. **User Registration:**
   - Go to `/signup`
   - Select "User" role
   - Enter details and click "Send OTP"
   - Enter any 6-digit OTP
   - Complete registration

2. **Admin Registration:**
   - Go to `/signup`
   - Select "Admin" role
   - Enter details and click "Send OTP"
   - Enter any 6-digit OTP
   - Complete registration

3. **User Login:**
   - Go to `/login`
   - Select "User" role
   - Enter any email/password
   - Login will work with mock data

4. **Admin Login:**
   - Go to `/login`
   - Select "Admin" role
   - Enter any email/password
   - Login will work with mock data

### With Backend (Full Integration)
When the backend is running:

1. **Real OTP Registration:**
   - Backend will send actual OTP emails
   - Registration will create real user accounts
   - Data will be stored in MongoDB

2. **Real Authentication:**
   - Login will verify against real user accounts
   - JWT tokens will be issued
   - Session management will work

3. **Admin Dashboard:**
   - View real users from database
   - Toggle premium status
   - Manage user profiles

## API Endpoints

### Authentication
- `POST /api/auth/request-registration-otp` - Request OTP for admin registration
- `POST /api/auth/register` - Register admin with OTP
- `POST /api/auth/login` - Admin login
- `POST /api/user/request-registration-otp` - Request OTP for user registration
- `POST /api/user/register-with-otp` - Register user with OTP
- `POST /api/user/login` - User login

### User Management
- `GET /api/user` - Get all users (admin only)
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/:id` - Update user profile
- `POST /api/user/premium-status` - Update premium status

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── SignUp.jsx
│   │   ├── Dashboard/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── UserFullProfileModal.jsx
│   │   └── auth-form.jsx
│   ├── services/
│   │   ├── authService.js
│   │   └── paymentService.js
│   └── Routes/
│       ├── ProtectedRoute.jsx
│       └── AdminProtectedRoute.jsx

KhanTraders/Backend/
├── controllers/
│   ├── authController.js
│   └── userController.js
├── models/
│   ├── Admin.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
└── utils/
    └── otpUtils.js
```

## Troubleshooting

### Common Issues

1. **"Failed to fetch profile" error:**
   - Backend is not running
   - Check if backend is on port 5000
   - Frontend will use mock data if backend is unavailable

2. **OTP not working:**
   - Backend OTP service not configured
   - Check email configuration in backend
   - Use mock mode for testing

3. **Role-based routing issues:**
   - Clear browser storage
   - Check role selection in login/signup forms
   - Verify protected route components

### Mock Mode
When the backend is not available, the frontend will:
- Use mock authentication
- Create mock user data
- Allow testing of UI flows
- Show console messages indicating mock mode

## Security Features

- JWT token-based authentication
- Role-based access control
- OTP verification for registration
- Secure password hashing
- Session management
- Rate limiting (admin accounts)

## Next Steps

1. Configure email service for OTP delivery
2. Set up MongoDB database
3. Configure environment variables
4. Test full integration with backend
5. Deploy to production environment
