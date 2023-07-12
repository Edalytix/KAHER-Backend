const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  stages: {
    type: Array,
    default: [],
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    unique: true,
  },
});

const Status = mongoose.model('Status', statusSchema);

return Status;
