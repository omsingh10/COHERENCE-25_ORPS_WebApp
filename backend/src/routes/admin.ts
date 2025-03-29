import express from 'express';
import User from '../models/User';
import SensorData from '../models/SensorData';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(authMiddleware, adminMiddleware);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAlerts = await User.aggregate([
      { $unwind: '$alerts' },
      { $count: 'total' }
    ]);
    
    const criticalAlerts = await User.aggregate([
      { $unwind: '$alerts' },
      { $match: { 'alerts.type': { $in: ['AirQuality', 'WaterLevel'] } } },
      { $count: 'total' }
    ]);
    
    const activeSensors = await SensorData.aggregate([
      { $group: { _id: '$city' } },
      { $count: 'total' }
    ]);
    
    res.json({
      totalUsers,
      totalAlerts: totalAlerts.length > 0 ? totalAlerts[0].total : 0,
      criticalAlerts: criticalAlerts.length > 0 ? criticalAlerts[0].total : 0,
      activeSensors: activeSensors.length > 0 ? activeSensors[0].total : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error });
  }
});

// Get all alerts
router.get('/alerts', async (req, res) => {
  try {
    const allAlerts = await User.aggregate([
      { $unwind: '$alerts' },
      {
        $project: {
          _id: '$alerts._id',
          type: '$alerts.type',
          message: '$alerts.message',
          timestamp: '$alerts.timestamp',
          read: '$alerts.read',
          city: '$city',
          userId: '$_id'
        }
      },
      { $sort: { timestamp: -1 } }
    ]);
    
    // Group alerts by unique message to count how many users received each alert
    const alertCounts = await User.aggregate([
      { $unwind: '$alerts' },
      {
        $group: {
          _id: '$alerts.message',
          sentToUsers: { $sum: 1 },
          type: { $first: '$alerts.type' },
          message: { $first: '$alerts.message' },
          timestamp: { $first: '$alerts.timestamp' },
          city: { $first: '$city' }
        }
      },
      { $sort: { timestamp: -1 } }
    ]);
    
    res.json(alertCounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error });
  }
});

// Create a new alert and send to relevant users
router.post('/alerts', async (req, res) => {
  try {
    const { type, message, city } = req.body;
    
    if (!type || !message) {
      return res.status(400).json({ message: 'Alert type and message are required' });
    }
    
    // Find users to send the alert to (by city if specified)
    const query = city ? { city } : {};
    
    // Update all matching users with the new alert
    const alertObj = {
      type,
      message,
      timestamp: new Date(),
      read: false
    };
    
    const result = await User.updateMany(
      query,
      { $push: { alerts: alertObj } }
    );
    
    // Get count of users that received the alert
    const affectedUsers = result.modifiedCount;
    
    res.status(201).json({
      message: 'Alert created and sent to users',
      sentToUsers: affectedUsers,
      alert: {
        type,
        message,
        timestamp: new Date(),
        city: city || 'All Cities'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating alert', error });
  }
});

// Delete an alert from all users
router.delete('/alerts/:alertMessage', async (req, res) => {
  try {
    const { alertMessage } = req.params;
    
    const result = await User.updateMany(
      {},
      { $pull: { alerts: { message: alertMessage } } }
    );
    
    res.json({
      message: 'Alert deleted',
      affectedUsers: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting alert', error });
  }
});

export default router; 