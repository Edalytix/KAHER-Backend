const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'Active'
  },
  permissions: {
    workflows: {
      type: String,
      enum: ['view', 'edit', 'none'],
      default: 'none'
    },
    users: {
      type: String,
      enum: ['view', 'edit', 'none'],
      default: 'none'
    },
    forms: {
      type: String,
      enum: ['view', 'edit', 'none'],
      default: 'none'
    },
    departments: {
      type: String,
      enum: ['view', 'edit', 'none'],
      default: 'none'
    },
    applications: {
      type: String,
      enum: ['view', 'edit', 'none'],
      default: 'none'
    },
    roles: {
      type: String,
      enum: ['view', 'edit', 'none'],
      default: 'none'
    }
  }
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;