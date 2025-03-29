import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  city: string;
  preferences: {
    notifications: boolean;
    alertThresholds: {
      airQuality: number;
      trafficCongestion: number;
      waterLevel: number;
    };
  };
  alerts: Array<{
    type: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    alertThresholds: {
      airQuality: {
        type: Number,
        default: 150 // AQI threshold
      },
      trafficCongestion: {
        type: Number,
        default: 75 // Percentage
      },
      waterLevel: {
        type: Number,
        default: 80 // Percentage
      }
    }
  },
  alerts: [{
    type: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export default mongoose.model<IUser>('User', userSchema); 