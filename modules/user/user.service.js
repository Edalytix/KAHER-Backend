const httpStatus = require('http-status');
const mongoose = require('mongoose');
const ApiError = require('../errors/appError');
const User = require('../user/user.model');

/**
 * Create a user
 * @param {Object} userBody
 */
module.exports.createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Register a user
 * @param {Oject} userBody
 */
module.exports.registerUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 */
module.exports.queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 */
module.exports.getUserById = async (id) => User.findById(id);

/**
 * Get user by email
 * @param {string} email
 */
module.exports.getUserByEmail = async (email) => User.findOne({ email });

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {updateBody}
 */
module.exports.updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} userId
 */
module.exports.deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.deleteOne();
  return user;
};
