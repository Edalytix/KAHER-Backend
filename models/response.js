const mongoose = require('mongoose');
const FormModels = require('./form');

const answerSchema = new mongoose.Schema({
  quid: {
    type: mongoose.Schema.Types.ObjectId,
  },
  type: {
    type: String,
    enum: [
      'string',
      'file',
      'number',
      'date',
      'singleChoice',
      'dropDown',
      'multipleChoice',
      'longString',
      'department',
      'user',
    ],
    required: true,
  },
  string: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  longString: { type: String },
  file: { type: String },
  number: { type: Number },
  date: { type: Date },
  singleChoice: { type: FormModels.FormQuestionOptionSchema },
  dropDown: { type: FormModels.FormQuestionOptionSchema },
  multipleChoice: { type: [FormModels.FormQuestionOptionSchema] },
});
// Define the schema for the Response collection
const responseSchema = new mongoose.Schema({
  fuid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
  },
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  wuid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow',
  },
  auid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
  },
  responses: [answerSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Response model from the schema
const Response = mongoose.model('Response', responseSchema);

// Export the Response model
module.exports = Response;
