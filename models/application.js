const Comment = require('./comment');
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
  // order: {
  //   type: Number,
  //   unique: true,
  // },
  level: {
    type: String,
    enum: ['approved', 'rejected', 'waiting', 'on-hold', 'draft', 'rWaiting'],
    default: 'waiting',
  },
  currentApprover: {
    type: Number,
    default: 1,
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
  workflowUid: {
    type: String,
    ref: 'Workflow',
    required: true,
  },
  stages: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
  },
  resubmission: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  approvedAmount: {
    type: Number,
    required: false,
  },

  // comments: [{
  //   id: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User',
  //     required: true,
  //   },
  //   date: {
  //     type: Date,
  //     default: Date.now,
  //   },
  //   comment: {
  //     type: String,
  //     required: true,
  //   },
  // }],
  activities: [
    {
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
      comments: {
        type: Number,
        default: 0,
      },
      activity: {
        type: String,
        required: true,
      },
    },
  ],
});

// applicationSchema.pre('save', async function (next) {
//   // Check if the "order" field is not provided by the user
//   if (this.isNew && typeof this.order !== 'number') {
//     try {
//       // Query the collection to count the total documents
//       const totalDocuments = await this.constructor.countDocuments();

//       // Set the "order" field to totalDocuments + 1
//       this.order = totalDocuments + 1;
//     } catch (err) {
//       return next(err);
//     }
//   }
//   next();
// });

applicationSchema.statics.aggregateWithActionsCount = function (callback) {
  const Application = this;

  Application.aggregate(
    [
      {
        $match: { _id: this._id },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'applicationId',
          as: 'comments',
        },
      },
      {
        $addFields: {
          actionsCount: { $sum: '$comments.actions' },
        },
      },
    ],
    callback
  );
};

/**
 * @typedef {Model<ApplicationDocument>} ApplicationModel
 */

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
