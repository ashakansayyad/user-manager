# User Manager Project

## Overview
The **User Manager Project** is a full-stack web application designed to manage user registration, authentication, and role-based access control. This project implements secure authentication, user filtering, and administrative controls for managing users efficiently.

## Features
- **User Registration & Authentication**: Secure login and registration using bcrypt password hashing and JWT authentication.
- **Role-Based Access Control**: Users can be categorized into different roles such as `admin`, `teacher`, `mother`, `father`, and `child`.
- **User Management**: Add, delete, and retrieve users with filtering options.
- **Public & Private User Segmentation**: Retrieve only users who have no email assigned (non-registered users).
- **RESTful API**: Backend APIs built with Express.js and PostgreSQL.

## Tech Stack
### Frontend
- React.js (if applicable)
- Context API for state management
- Axios for API requests

### Backend
- Node.js & Express.js
- PostgreSQL (Relational Database)
- bcrypt (Password hashing)
- JWT (Authentication & Authorization)
- dotenv (Environment variable management)

## API Endpoints
### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and receive a JWT token

### User Management
- `GET /api/users/get-all-users` - Retrieve users without an email (non-registered users)
- `GET /api/users/get-user/:id` - Retrieve user details by ID
- `POST /api/users/add-user` - Add a new user with a specific role (without an email)
- `DELETE /api/users/delete-user/:id` - Delete a user by ID

### Filtering & Search
- `GET /api/users/filter-users?name=xyz&type=admin` - Search and filter users by name and type

## Setup & Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/user-manager.git
   cd user-manager
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file with database credentials and JWT secret:
   ```env
   DATABASE_URL=your_postgresql_database_url
   JWT_SECRET=your_secret_key
   ```
4. Run database migrations (if using a migration tool like Sequelize or Knex):
   ```bash
   npx knex migrate:latest
   ```
5. Start the server:
   ```bash
   npm start
   ```

## Database Schema (PostgreSQL)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password TEXT,
    type VARCHAR(50) CHECK (type IN ('child', 'mother', 'father', 'teacher', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Measures
- Passwords are securely hashed using **bcrypt** before storing them in the database.
- Authentication tokens are generated using **JWT** to ensure secure session management.
- Only users with `admin` roles can add or delete users.

## Future Enhancements
- Implement frontend UI with React.js for better user interaction.
- Add two-factor authentication (2FA) for enhanced security.
- Implement logging and monitoring for tracking user activity.

## Author
- **Ashakan Sayyad**
- **Email: sayyadashakan1002@gmail.com**
- **GitHub: https://github.com/ashakansayyad**


