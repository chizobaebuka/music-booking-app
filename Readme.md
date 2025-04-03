# Music Booking API

## Overview
The **Music Booking API** is a RESTful API that allows **artists** to create profiles, list their availability, and accept bookings from **event organizers**. Built with **Node.js, TypeScript, Express.js, and Supabase (PostgreSQL)**, it provides a structured platform for seamless artist-event interactions.

## Features
### 1. **User Authentication & Authorization**
- **Signup & Login** with secure password hashing (Argon2)
- **JWT-based authentication**
- **Role-based access control** (Artists & Organizers)

### Artist Features
- Create and manage professional profiles
- Set availability schedules
- View and respond to booking requests
- Browse event listings
- Accept/reject booking requests

### Organizer Features
- Create and manage events
- Browse artist profiles
- Send booking requests
- Manage event schedules
- Track booking statuses

### Booking System
- **Status Management**
  - Pending
  - Confirmed
  - Canceled
- Real-time status updates
- Booking history tracking

## 🛠 Tech Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + Argon2
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Zod
- **Security**: Helmet

## 📝 Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Git

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/music-booking-api.git
cd music-booking-api
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=4002
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
```

### 4️⃣ **Run the Application**
#### **Development Mode**
```sh
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## 📚 API Documentation
Once the server is running, access the Swagger documentation at:
```
http://localhost:4002/api-docs
```

## 🗄 Database Schema

### Users Table
- id (UUID)
- email (STRING)
- password (STRING)
- role (ENUM: 'artist', 'organizer')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Events Table
- id (UUID)
- organizer_id (UUID, FK)
- name (STRING)
- description (TEXT)
- date (TIMESTAMP)
- location (STRING)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Bookings Table
- id (UUID)
- artist_id (UUID, FK)
- event_id (UUID, FK)
- status (ENUM: 'pending', 'confirmed', 'canceled')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## 🔐 Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🔌 API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - User login

### Artists
- GET `/api/artists` - List all artists
- GET `/api/artists/:id` - Get artist details
- PUT `/api/artists/:id` - Update artist profile

### Events
- GET `/api/events` - List all events
- POST `/api/events` - Create new event
- GET `/api/events/:id` - Get event details
- PUT `/api/events/:id` - Update event
- DELETE `/api/events/:id` - Delete event

### Bookings
- POST `/api/bookings` - Create booking request
- GET `/api/bookings` - List user's bookings
- GET `/api/bookings/:id` - Get booking details
- PUT `/api/bookings/:id` - Update booking status
- DELETE `/api/bookings/:id` - Cancel booking

## ❌ Error Handling
The API uses standard HTTP status codes and returns error responses in the format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the ISC License.
