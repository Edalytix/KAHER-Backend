/**
 * @typedef { import("mongoose").Schema } Schema
 * @typedef { import("mongoose").Model } Model
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Comment
 * @property {mongoose.Types.ObjectId} id - The user ID of the commenter.
 * @property {Date} date - The date the comment was made.
 * @property {string} comment - The text of the comment.
 */

/**
 * @typedef {Object} Activity
 * @property {mongoose.Types.ObjectId} id - The user ID of the activity performer.
 * @property {Date} date - The date the activity was performed.
 * @property {string} activity - The description of the activity.
 */

/**
 * @typedef {Object} ApplicationDocument
 * @property {string} title - The title of the application.
 * @property {mongoose.Types.ObjectId} username - The user ID of the applicant.
 * @property {string} status - The status of the application (active or inactive).
 * @property {string} level - The level of the application (approved, rejected, or waiting).
 * @property {mongoose.Types.ObjectId} department - The department ID of the application.
 * @property {mongoose.Types.ObjectId} workflow - The workflow ID of the application.
 * @property {Date} createdAt - The date the application was created * @property {Comment[]} comments - The comments on the application.
 * @property {Activity[]} activity - The activity logs for the application.
 */

const applicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  level: {
    type: String,
    enum: ['approved', 'rejected', 'waiting', 'draft'],
    default: 'waiting',
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  workflow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    comment: {
      type: String,
      required: true,
    },
  }],
  activities: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    level: {
      type: String,
      enum: ['status change', 'comment'],
    },
    activity: {
      type: String,
      required: true,
    },
  }],
});

/**
 * @typedef {Model<ApplicationDocument>} ApplicationModel
 */

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;