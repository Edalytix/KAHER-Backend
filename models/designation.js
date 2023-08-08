const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  users: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
});

const Designation = mongoose.model('Designation', designationSchema);

return Designation;
