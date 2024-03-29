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
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
      default: []
    },
    users: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: []
    }
  });
  
  const Department = mongoose.model('Department', departmentSchema);

  return Department; 