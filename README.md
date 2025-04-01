# Smart City Dashboard - India 🌆

A comprehensive web application for real-time monitoring of urban parameters across Indian cities. This dashboard provides insights into air quality, traffic conditions, water levels, energy usage, and more.

## Features 🚀

- Real-time monitoring of urban parameters
- User authentication system with admin/user roles
- Interactive data visualizations
- OpenStreetMap integration for location mapping
- Location-based search and filtering
- Alert system for critical conditions
- Admin panel for managing users and creating alerts
- Responsive design for all devices

## Tech Stack 💻




### Frontend
- React.js with TypeScript
- Chakra UI for styling
- Redux Toolkit for state management
- Socket.io-client for real-time updates
- Leaflet Maps (OpenStreetMap) for mapping
- Chart.js for data visualization

### Backend
- Node.js with Express.js
- MongoDB for database
- JWT for authentication
- Socket.io for real-time communication
- Various APIs integration

## Prerequisites 📋

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Getting Started 🚀

### Setup MongoDB

1. Make sure MongoDB is running on your machine or you have a MongoDB Atlas connection string
2. Update the `.env` file in the backend directory with your MongoDB URI

### Backend Setup
```bash
cd backend
npm install
# Set up sample data (creates admin user and test data)
npm run setup
# Start development server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Default Logins

**Admin User:**
- Email: admin@smartcity.com
- Password: admin123

**Demo User:**
- Email: user1@smartcity.com
- Password: user123

## Environment Variables 🔐

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Features Overview 📊

### For Regular Users

1. **Dashboard** - View real-time data for your city
2. **Alerts** - Receive notifications about critical conditions
3. **Map View** - Visual representation of sensor locations
4. **Settings** - Update alert preferences

### For Admin Users

1. **Admin Dashboard** - View system statistics
2. **Create Alerts** - Send notifications to users
3. **Manage Users** - View all users in the system
4. **Monitor System** - Check overall system status

## Project Structure 📁

```
smart-city-dashboard/
├── backend/
│   ├── src/
│   │   ├── middleware/       # Auth middleware
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API endpoints
│   │   ├── scripts/          # Setup scripts
│   │   └── server.ts         # Main server file
│   ├── .env                  # Environment variables
│   └── package.json          # Backend dependencies
└── frontend/
    ├── public/               # Static files
    ├── src/
    │   ├── components/       # React components
    │   ├── contexts/         # Context providers
    │   ├── utils/            # Utility functions
    │   └── App.tsx           # Main App component
    ├── .env                  # Environment variables
    └── package.json          # Frontend dependencies
```

## Screenshots 📸

- Dashboard with Real-time Monitoring
- Admin Panel for Alert Management
- User Authentication Screens
- Alert Notifications

## License 📄

This project is licensed under the MIT License.

## Acknowledgements 🙏

- OpenStreetMap for map data
- ChartJS for data visualization
- Chakra UI for the modern interface 
