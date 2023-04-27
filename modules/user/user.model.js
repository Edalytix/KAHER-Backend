const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const paginate = require('../paginate/paginate');
const toJSON = require('../toJSON/toJSON');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            'Password must contain at least one letter and one number'
          );
        }
      },
      private: true, // used by the toJSON plugin
    },
    roleId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Role',
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Department',
      // required: true,
    },
    // phoneNumber: {
    //   type: String,
    //   // unique: true,
    // },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    images: String,
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.static('isEmailTaken', async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
});

userSchema.method('isPasswordMatch', async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
