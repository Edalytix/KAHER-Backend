const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  sessData: {
    user_uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    ua: {
      type: String,
    },
  },
  token: {
    type: String,
  },
});

const Token = mongoose.model('Token', tokenSchema);

return Token;
