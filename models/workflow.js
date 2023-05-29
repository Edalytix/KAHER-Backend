/**
 * Workflow model
 * @module models/workflow
 */

const mongoose = require('mongoose');

/**
 * Application reference
 * @typedef {Object} ApplicationRef
 * @property {ObjectId} _id - The ID of the referenced application.
 * @property {string} name - The name of the referenced application.
 */

/**
 * Form reference with required flag
 * @typedef {Object} FormRef
 * @property {ObjectId} form - The ID of the referenced form.
 * @property {boolean} required - Whether the form is required for the workflow.
 */

/**
 * Approval object
 * @typedef {Object} Approval
 * @property {number} sequence - The sequence number of the approval step.
 * @property {string} name - The name of the approval step.
 * @property {ObjectId} approvalBy - The user ID of the approver.
 */

/**
 * Workflow Schema
 * @typedef {Object} WorkflowSchema
 * @property {string} name - The name of the workflow.
 * @property {ApplicationRef[]} applications - The applications associated with the workflow.
 * @property {string} status - The status of the workflow (active or inactive).
 * @property {string} level - The level of the workflow (draft or published).
 * @property {FormRef[]} forms - The forms associated with the workflow and their requiredflag.
 * @property {Approval[]} approvals - The approval steps of the workflow.
 * @property {Date} createdAt - The date the workflow was created.
 */

/**
 * Mongoose schema for workflows
 * @type {mongoose.Schema<WorkflowSchema>}
 */
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
  approvals: [{
    sequence: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true
    },
    approvalBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Workflow model
 * @type {mongoose.Model<WorkflowSchema>}
 */
const Workflow = mongoose.model('Workflow', workflowSchema);

module.exports = Workflow;