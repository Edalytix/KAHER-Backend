const httpStatus = require('http-status');
const mongoose = require('mongoose');
const ApiError = require('../errors/appError');
const Role = require('./role.model');

/**
 * Create a role
 * @param {Object} roleBody
 */
module.exports.createRole = async (roleBody) => {
  return Role.create(roleBody);
};

/**
 * Query for roles
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 */
module.exports.queryRoles = async (filter, options) => {
  const roles = await Role.paginate(filter, options);
  return roles;
};

/**
 * Get role by id
 * @param {mongoose.Types.ObjectId} id
 */
module.exports.getRoleById = async (id) => Role.findById(id);

/**
 * Get role by email
 * @param {string} email
 */
module.exports.getRoleByEmail = async (email) => Role.findOne({ email });

/**
 * Update role by id
 * @param {mongoose.Types.ObjectId} roleId
 * @param {updateBody}
 */
module.exports.updateRoleById = async (roleId, updateBody) => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError('Role not found', httpStatus.NOT_FOUND);
  }
  if (updateBody.email && (await Role.isEmailTaken(updateBody.email, roleId))) {
    throw new ApiError('Email already taken', httpStatus.BAD_REQUEST);
  }
  Object.assign(role, updateBody);
  await role.save();
  return role;
};

/**
 * Delete role by id
 * @param {mongoose.Types.ObjectId} roleId
 */
module.exports.deleteRoleById = async (roleId) => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError('Role not found', httpStatus.NOT_FOUND);
  }
  await role.deleteOne();
  return role;
};
