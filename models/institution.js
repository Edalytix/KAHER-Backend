const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  users: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
});

const Institution = mongoose.model('Institution', institutionSchema);

return Institution;
