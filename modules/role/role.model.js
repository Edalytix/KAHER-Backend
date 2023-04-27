const mongoose = require('mongoose');
const paginate = require('../paginate/paginate');
const toJSON = require('../toJSON/toJSON');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    uniqueId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'deactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
roleSchema.plugin(toJSON);
// roleSchema.plugin(paginate);

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
