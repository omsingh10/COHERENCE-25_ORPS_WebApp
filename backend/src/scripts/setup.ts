import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import SensorData from '../models/SensorData';
import bcrypt from 'bcryptjs';

dotenv.config();

const setupAdmin = async () => {
  try {
    console.log('Setting up admin user...');
    
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = new User({
      name: 'Admin User',
      email: 'admin@smartcity.com',
      password: hashedPassword,
      role: 'admin',
      city: 'Delhi',
    });
    
    await admin.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

const setupDemoUsers = async () => {
  try {
    console.log('Setting up demo users...');
    
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'];
    const demoUsers = [];
    
    // Create a user for each city
    for (let i = 0; i < cities.length; i++) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('user123', salt);
      
      demoUsers.push({
        name: `User ${i + 1}`,
        email: `user${i + 1}@smartcity.com`,
        password: hashedPassword,
        role: 'user',
        city: cities[i],
      });
    }
    
    // Check if users already exist
    const userExists = await User.findOne({ role: 'user' });
    if (userExists) {
      console.log('Demo users already exist');
      return;
    }
    
    await User.insertMany(demoUsers);
    console.log(`${demoUsers.length} demo users created successfully`);
  } catch (error) {
    console.error('Error creating demo users:', error);
  }
};

const generateSensorData = async () => {
  try {
    console.log('Generating sensor data...');
    
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'];
    const cityCoordinates = {
      Mumbai: [72.8777, 19.0760],
      Delhi: [77.2090, 28.6139],
      Bangalore: [77.5946, 12.9716],
      Hyderabad: [78.4867, 17.3850],
      Chennai: [80.2707, 13.0827],
      Kolkata: [88.3639, 22.5726],
    };
    
    const sensorData = [];
    
    // Generate data for each city
    for (const city of cities) {
      // Check if data already exists for this city
      const dataExists = await SensorData.findOne({ city });
      if (dataExists) {
        console.log(`Sensor data for ${city} already exists`);
        continue;
      }
      
      sensorData.push({
        city,
        location: {
          type: 'Point',
          coordinates: cityCoordinates[city as keyof typeof cityCoordinates],
        },
        timestamp: new Date(),
        airQuality: {
          aqi: Math.floor(Math.random() * 200) + 30,
          pm25: Math.floor(Math.random() * 100) + 10,
          pm10: Math.floor(Math.random() * 150) + 20,
          no2: Math.floor(Math.random() * 100) + 5,
          so2: Math.floor(Math.random() * 50) + 2,
          co: Math.floor(Math.random() * 10) + 1,
        },
        weather: {
          temperature: Math.floor(Math.random() * 20) + 15,
          humidity: Math.floor(Math.random() * 60) + 30,
          windSpeed: Math.floor(Math.random() * 20) + 5,
          windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
          precipitation: Math.floor(Math.random() * 10),
        },
        traffic: {
          congestionLevel: Math.floor(Math.random() * 80) + 10,
          averageSpeed: Math.floor(Math.random() * 60) + 10,
          vehicles: Math.floor(Math.random() * 300) + 50,
          incidentCount: Math.floor(Math.random() * 5),
        },
        waterLevel: {
          level: Math.floor(Math.random() * 100) + 1,
          percentage: Math.floor(Math.random() * 100),
          status: ['Normal', 'Warning', 'Critical'][Math.floor(Math.random() * 3)],
        },
        energy: {
          usage: Math.floor(Math.random() * 300) + 50,
        },
      });
    }
    
    await SensorData.insertMany(sensorData);
    console.log(`Sensor data generated for ${sensorData.length} cities`);
  } catch (error) {
    console.error('Error generating sensor data:', error);
  }
};

const setupDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-city');
    console.log('Connected to MongoDB');
    
    // Run setup functions
    await setupAdmin();
    await setupDemoUsers();
    await generateSensorData();
    
    console.log('Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
};

// Run the setup
setupDatabase(); 