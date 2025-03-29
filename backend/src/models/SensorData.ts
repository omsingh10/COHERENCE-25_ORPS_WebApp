import mongoose from 'mongoose';

export interface ISensorData extends mongoose.Document {
  city: string;
  location: {
    type: string;
    coordinates: number[];
  };
  timestamp: Date;
  airQuality: {
    aqi: number;
    pm25: number;
    pm10: number;
    no2: number;
    so2: number;
    co: number;
  };
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    precipitation: number;
  };
  traffic: {
    congestionLevel: number;
    averageSpeed: number;
    incidentCount: number;
  };
  waterLevel: {
    level: number;
    status: string;
  };
}

const sensorDataSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    index: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  airQuality: {
    aqi: Number,
    pm25: Number,
    pm10: Number,
    no2: Number,
    so2: Number,
    co: Number
  },
  weather: {
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    windDirection: String,
    precipitation: Number
  },
  traffic: {
    congestionLevel: Number,
    averageSpeed: Number,
    incidentCount: Number
  },
  waterLevel: {
    level: Number,
    status: {
      type: String,
      enum: ['Normal', 'Warning', 'Critical']
    }
  }
});

// Create geospatial index
sensorDataSchema.index({ location: '2dsphere' });

export default mongoose.model<ISensorData>('SensorData', sensorDataSchema); 