# Smart City Dashboard - India 🌆

A comprehensive web application for real-time monitoring of urban parameters across Indian cities. This dashboard provides insights into air quality, traffic conditions, weather, and more.

## Features 🚀

- Real-time monitoring of urban parameters
- User authentication system
- Interactive data visualizations
- Google Maps integration
- Location-based search
- Alert system for critical conditions
- Responsive design

## Tech Stack 💻

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Redux Toolkit for state management
- Socket.io-client for real-time updates
- Google Maps API
- Chart.js for data visualization

### Backend
- Node.js with Express.js
- MongoDB for database
- JWT for authentication
- Socket.io for real-time communication
- Various APIs integration (Weather, Air Quality, etc.)

## Prerequisites 📋

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Google Maps API key
- Environment variables (see below)

## Getting Started 🚀

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

## Environment Variables 🔐

### Frontend (.env)
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_API_URL=http://localhost:5000
```

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

## API Integrations 🔌

- OpenWeatherMap API for weather data
- Central Pollution Control Board (CPCB) API for air quality
- Google Maps Platform for maps and traffic data
- Custom IoT sensor endpoints (simulated)

## Contributing 🤝

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License. 