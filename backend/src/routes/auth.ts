import express from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (default role is 'user')
    const user = new User({
      name,
      email,
      password,
      city,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        role: user.role,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        role: user.role,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      city: user.city,
      role: user.role,
      preferences: user.preferences,
      alerts: user.alerts
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
});

// Update user preferences
router.put('/preferences', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notifications, alertThresholds } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        'preferences.notifications': notifications,
        'preferences.alertThresholds': alertThresholds
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ message: 'Error updating preferences', error });
  }
});

// Create first admin user (only works if no admin exists)
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;
    
    // Check if the secret key matches
    if (secretKey !== (process.env.ADMIN_SECRET_KEY || 'admin-secret-key')) {
      return res.status(401).json({ message: 'Invalid secret key' });
    }
    
    // Check if an admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }
    
    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Create admin user
    const admin = new User({
      name,
      email,
      password,
      role: 'admin',
      city: 'Delhi', // Default city for admin
    });
    
    await admin.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Admin user created successfully',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin user', error });
  }
});

export default router; 