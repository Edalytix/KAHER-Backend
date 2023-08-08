const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4, // generate a new UUID when a user is created
  },
  firstName: {
    type: String,
    required: true,
  },
  secondName: {
    type: String,
    required: true,
  },
  department: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  statusActivation: {
    type: Date,
    required: false,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
  ],
  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Designation',
    required: true,
  },
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  type: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
