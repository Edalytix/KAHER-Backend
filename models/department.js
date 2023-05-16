const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active' 
    },
    applications: {
      type: [String],
      default: []
    },
    users: {
      type: [String],
      default: []
    }
  });
  
  const Department = mongoose.model('Department', departmentSchema);

  return Department; 