const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormQuestionOptionSchema = new Schema({
  id: { type: Number, required: true },
  value: { type: String, required: true }
});

const FormQuestionSchema = new Schema({
  sequence: { type: Number, required: true },
  question: { type: String, required: true },
  type: {
    type: String,
    enum: ['string', 'file', 'number', 'date', 'singleChoice', 'multipleChoice', 'longString'],
    required: true
  },
  required: { type: Boolean, required: true, default: false },
  options: { type: [FormQuestionOptionSchema] }
});

const FormSchema = new Schema({
  title: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true, default: Date.now },
  workflows: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workflow' }], required: true },
  questions:{ type:[FormQuestionSchema], required: true },
  status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'inactive' }
});

const Form = mongoose.model('Form', FormSchema);
module.exports = {FormQuestionOptionSchema,FormQuestionSchema}
return Form;