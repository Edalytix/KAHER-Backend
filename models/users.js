const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const generatePassword = require('generate-password');

const userSchema = new mongoose.Schema({
    uuid: { 
        type: String,
        required: true,
        unique: true,
        default: uuidv4 // generate a new UUID when a user is created
      },
  firstName: {
    type: String,
    required: true
  },
  secondName: {
    type: String,
    required: true
  },
  department: {
    name: {
      type: String,
      required:true,
    },
    id: { 
      type: String,
      required:true,
    }

  },
  statusActivation: {
    type: Date,
    required: false,
  },
  role: { 
    type: String,
    required: true,
  },
  applications: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true,
    default: generatePassword.generate({ length: 10, numbers: true })
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;