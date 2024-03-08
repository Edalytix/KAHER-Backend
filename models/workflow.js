/**
 * Workflow model
 * @module models/workflow
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
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
    required: true,
  },
  uuid: {
    type: String,
    required: true,
    default: uuidv4, // generate a new UUID when a user is created
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
  ],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  order: {
    type: Number,
  },
  level: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  version: {
    type: String,
    enum: ['older', 'latest', 'deleted'],
    default: 'latest',
  },
  forms: [
    {
      form: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
      },
      formUid: {
        type: String,
        ref: 'Form',
      },
      required: {
        type: Boolean,
        default: false,
      },
    },
  ],
  approvals: [
    {
      approveGrant: {
        type: Boolean,
        default: false,
      },
      sequence: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      approvalBy: {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        department: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Department',
        },
        role: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Role',
        },
      },
      assignedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  totalApprovers: {
    type: Number,
    default: function () {
      return this.approvals.length;
    },
  },
  totalApplications: {
    type: Number,
    default: function () {
      return this.applications.length;
    },
  },
  colour: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

workflowSchema.pre('save', async function (next) {
  // Check if the "order" field is not provided by the user
  if (this.isNew && typeof this.order !== 'number') {
    try {
      // Query the collection to count the total documents
      const totalDocuments = await this.constructor.countDocuments();

      // Set the "order" field to totalDocuments + 1
      this.order = totalDocuments + 1;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

/**
 * Workflow model
 * @type {mongoose.Model<WorkflowSchema>}
 */
const Workflow = mongoose.model('Workflow', workflowSchema);

module.exports = Workflow;
