const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  level: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  forms: [{
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form'
    },
    required: {
      type: Boolean,
      default: false
    }
  }],
  approval: [{
    sequence: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true
    },
    approvalBy: {
      type: String,
      required: true
    }
  }]
});

const Workflow = mongoose.model('Workflow', workflowSchema);

module.exports = Workflow;