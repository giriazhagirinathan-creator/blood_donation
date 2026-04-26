import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  hospitalName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false
    },
    coordinates: {
      type: [Number],
      required: false
    }
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits'],
  },
  urgency: {
    type: String,
    required: true,
    enum: ['Immediate', '24 Hours'],
  },
  status: {
    type: String,
    enum: ['Active', 'Fulfilled', 'Cancelled'],
    default: 'Active'
  }
}, { timestamps: true });

// Create a geospatial index for finding nearby requests/donors
bloodRequestSchema.index({ location: '2dsphere' });

export default mongoose.model('BloodRequest', bloodRequestSchema);
