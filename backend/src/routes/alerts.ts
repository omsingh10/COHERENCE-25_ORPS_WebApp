import express from 'express';
import SensorData from '../models/SensorData';
import User from '../models/User';
import mongoose from 'mongoose';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Check and generate alerts based on sensor data
const generateAlerts = async (sensorData: any) => {
  const alerts = [];
  
  // Air Quality Alert
  if (sensorData.airQuality.aqi > 150) {
    alerts.push({
      type: 'AirQuality',
      severity: 'High',
      message: `Air Quality Index is ${sensorData.airQuality.aqi} in ${sensorData.city}`,
      timestamp: new Date(),
      location: sensorData.location
    });
  }

  // Traffic Congestion Alert
  if (sensorData.traffic.congestionLevel > 75) {
    alerts.push({
      type: 'Traffic',
      severity: 'High',
      message: `Heavy traffic congestion (${sensorData.traffic.congestionLevel}%) in ${sensorData.city}`,
      timestamp: new Date(),
      location: sensorData.location
    });
  }

  // Water Level Alert
  if (sensorData.waterLevel.status === 'Critical') {
    alerts.push({
      type: 'WaterLevel',
      severity: 'Critical',
      message: `Critical water level detected in ${sensorData.city}`,
      timestamp: new Date(),
      location: sensorData.location
    });
  }

  return alerts;
};

// Get active alerts for a city
router.get('/city/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    const sensorData = await SensorData.findOne({ city: cityName })
      .sort({ timestamp: -1 })
      .exec();

    if (!sensorData) {
      return res.status(404).json({ message: 'No data found for this city' });
    }

    const alerts = await generateAlerts(sensorData);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error });
  }
});

// Get user's alerts
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if the authenticated user is requesting their own alerts
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Sort alerts by timestamp descending (newest first)
    const sortedAlerts = user.alerts.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    res.json(sortedAlerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user alerts', error });
  }
});

// Mark an alert as read
router.put('/:alertId/read', async (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.user.userId;
    
    const result = await User.updateOne(
      { _id: userId, 'alerts._id': alertId },
      { $set: { 'alerts.$.read': true } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    res.json({ message: 'Alert marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating alert', error });
  }
});

// Mark all user alerts as read
router.put('/user/:userId/read-all', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if the authenticated user is updating their own alerts
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const result = await User.updateOne(
      { _id: userId },
      { $set: { 'alerts.$[].read': true } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'All alerts marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating alerts', error });
  }
});

// Subscribe to alerts for a city
router.post('/subscribe', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { city } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { city },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Successfully subscribed to alerts', city });
  } catch (error) {
    res.status(500).json({ message: 'Error subscribing to alerts', error });
  }
});

// Get user's alert preferences
router.get('/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if the authenticated user is requesting their own preferences
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.preferences);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alert preferences', error });
  }
});

export default router; 