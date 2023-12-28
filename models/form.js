const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const FormQuestionOptionSchema = new Schema({
  id: { type: Number, required: true },
  value: { type: String, required: true },
});

const FormQuestionSchema = new Schema({
  sequence: { type: Number, required: true },
  question: { type: String, required: true },
  label: { type: String, required: false, default: '' },
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
      'doi'
    ],
    required: true,
  },
  required: { type: Boolean, required: true, default: false },
  options: { type: [FormQuestionOptionSchema] },
});

const FormSchema = new Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  order: {
    type: Number,
  },
  workflows: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workflow' }],
    required: true,
  },
  questions: { type: [FormQuestionSchema], required: true },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'inactive',
  },
  version: {
    type: String,
    enum: ['older', 'latest', 'deleted'],
    default: 'latest',
  },
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4, // generate a new UUID when a user is created
  },
});

FormSchema.pre('save', async function (next) {
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

const Form = mongoose.model('Form', FormSchema);
module.exports = { FormQuestionOptionSchema, FormQuestionSchema };
return Form;
