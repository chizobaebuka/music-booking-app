# Music Booking API

## Overview
The **Music Booking API** is a RESTful API that allows **artists** to create profiles, list their availability, and accept bookings from **event organizers**. Built with **Node.js, TypeScript, Express.js, and Supabase (PostgreSQL)**, it provides a structured platform for seamless artist-event interactions.

## Features
### 1. **User Authentication & Authorization**
- **Signup & Login** with secure password hashing (Argon2)
- **JWT-based authentication**
- **Role-based access control** (Artists & Organizers)

### 2. **Artist Profile Management**
- Artists can create and update their **profile, bio, genres, and availability**
- Event organizers can view artist profiles

### 3. **Event Listings**
- Organizers can **create, update, delete**, and **list events**
- Artists can **view and apply** for events

### 4. **Booking System**
- Organizers can **send booking requests** to artists
- Artists can **accept or reject bookings**
- Booking status: **Pending, Confirmed, Canceled**

### 5. **Payments & Transactions**
- Integrate **Supabase for PostgreSQL** storage
- Store **booking transactions** securely

### 6. **API Documentation**
- **Swagger/OpenAPI** for clear documentation
- **Postman collection** for testing

---

## Tech Stack
| Technology      | Purpose                         |
|---------------|-------------------------------|
| **Node.js** | Backend runtime |
| **TypeScript** | Type safety & clean code |
| **Express.js** | Web framework |
| **Supabase (PostgreSQL)** | Database |
| **Argon2** | Password hashing |
| **JWT** | Authentication |
| **Swagger** | API Documentation |
| **Supabase Auth** | User management (alternative) |

---

## Setup & Installation
### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/yourusername/music-booking-api.git
cd music-booking-api
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Environment Variables**
Create a `.env` file in the root directory:
```ini
PORT=4002
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_secret_key
```

### 4️⃣ **Run the Application**
#### **Development Mode**
```sh
npm run dev
```

#### **Production Mode**
```sh
npm run build
npm start
```

---

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/artists` | Get all artist profiles |
| GET | `/api/artists/:id` | Get a single artist profile |
| POST | `/api/events` | Create a new event |
| GET | `/api/events` | List all events |
| POST | `/api/bookings` | Book an artist |
| GET | `/api/bookings` | Get all bookings |

---

## Contributing
Feel free to submit **issues** or **pull requests** to improve the project.

## License
MIT License
