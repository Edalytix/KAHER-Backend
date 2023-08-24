const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    unique: true,
  },
  keyPath: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OTP = mongoose.model('OTP', otpSchema);

return OTP;
