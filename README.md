# Event Management Web Application

A full-stack Event Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring custom authentication, dynamic event operations, and an intuitive user interface.

## 🚀 Features

### Authentication System
- **Custom Authentication** - Built without third-party packages
- **User Registration** - Name, Email, Password, and Photo URL
- **Secure Login** - Email and Password authentication
- **Error Handling** - Clear error messages for invalid credentials and missing fields
- **Protected Routes** - Private routes for authenticated users only

### Event Management
- **Create Events** - Add new events with detailed information
- **View All Events** - Browse events in descending order by date and time
- **Join Events** - Users can join events (once per event)
- **My Events** - View and manage personal events
- **Update/Delete Events** - Full CRUD operations for event creators

### Search & Filter System
- **Search by Title** - Find events quickly using the search functionality
- **Date Filters** - Filter events by:
  - Today's date
  - Current week
  - Last week
  - Current month
  - Last month
  - Custom date range

### User Interface
- **Responsive Design** - Works seamlessly across all devices
- **Dynamic Navbar** - Shows user profile when logged in
- **Card-based Layout** - Clean and organized event display
- **Modal Updates** - User-friendly update forms
- **Confirmation Dialogs** - Safe delete operations

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface library
- **React Router** - Client-side routing
- **JavaScript (ES6+)** - Modern JavaScript features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Tools & Libraries
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## ⚡ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/farad-alam/Event-Management-Client-Side
cd event-management-app
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following environment variables to your `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eventmanagement
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to your frontend `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup
Make sure MongoDB is running on your system, or configure MongoDB Atlas connection string in your backend `.env` file.

### 5. Run the Application

**Start Backend Server:**
```bash
cd backend
npm start
# or for development
npm run dev
```

**Start Frontend Development Server:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📱 Usage Guide

### Getting Started
1. **Register** - Create a new account with your details
2. **Login** - Sign in with your credentials
3. **Browse Events** - View all available events on the Events page
4. **Join Events** - Click "Join Event" to participate
5. **Create Events** - Use "Add Event" to create your own events
6. **Manage Events** - View and edit your events in "My Events"

### Navigation
- **Home** - Landing page with application overview
- **Events** - Browse and join all available events
- **Add Event** - Create new events (requires login)
- **My Events** - Manage your created events (requires login)
- **Profile** - Access user settings and logout

### Event Operations
- **Create**: Fill out the event form with title, date, location, and description
- **Join**: Click "Join Event" to increase attendee count
- **Update**: Use the update button to modify event details
- **Delete**: Remove events with confirmation dialog
- **Search**: Use the search bar to find events by title
- **Filter**: Apply date-based filters for better event discovery

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get specific event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/join` - Join event

### Users
- `GET /api/users/events` - Get user's events
- `PUT /api/users/profile` - Update user profile

## 🏗️ Project Structure

```
event-management-app/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── utils/
│   │   ├── styles/
│   │   └── App.js
│   ├── .env
│   └── package.json
└── README.md
```
