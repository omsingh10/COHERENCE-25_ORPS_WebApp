import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import sensorRoutes from './routes/sensors';
import alertRoutes from './routes/alerts';
import adminRoutes from './routes/admin';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store io instance in app
app.set('io', io);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-city')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sensors', authMiddleware, sensorRoutes);
app.use('/api/alerts', authMiddleware, alertRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('subscribe', (city) => {
    socket.join(city);
    console.log(`User subscribed to ${city}`);
  });

  socket.on('unsubscribe', (city) => {
    socket.leave(city);
    console.log(`User unsubscribed from ${city}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Smart City Dashboard API is running');
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 