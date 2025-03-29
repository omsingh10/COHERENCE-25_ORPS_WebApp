import express from 'express';
import SensorData from '../models/SensorData';

const router = express.Router();

// Get latest sensor data for a city
router.get('/city/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    const data = await SensorData.findOne({ city: cityName })
      .sort({ timestamp: -1 })
      .exec();

    if (!data) {
      return res.status(404).json({ message: 'No data found for this city' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sensor data', error });
  }
});

// Get sensor data within a specific radius (in kilometers)
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    const data = await SensorData.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)]
          },
          $maxDistance: parseInt(radius as string) * 1000 // Convert to meters
        }
      }
    }).sort({ timestamp: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nearby sensor data', error });
  }
});

// Get historical data for a specific parameter in a city
router.get('/historical/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    const { parameter, duration = '24h' } = req.query;

    const durationMap: { [key: string]: number } = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const startTime = new Date(Date.now() - durationMap[duration as string]);

    const data = await SensorData.find({
      city: cityName,
      timestamp: { $gte: startTime }
    })
    .select(`city timestamp ${parameter}`)
    .sort({ timestamp: 1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching historical data', error });
  }
});

// Add new sensor data (simulated IoT sensor input)
router.post('/data', async (req, res) => {
  try {
    const sensorData = new SensorData(req.body);
    await sensorData.save();

    // Emit the new data through Socket.io (implement in main server.ts)
    req.app.get('io').to(sensorData.city).emit('newSensorData', sensorData);

    res.status(201).json(sensorData);
  } catch (error) {
    res.status(500).json({ message: 'Error saving sensor data', error });
  }
});

export default router; 