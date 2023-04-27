const User = require('./role.model');
const AppError = require('../errors/appError');
const catchAsync = require('../utils/catchAsync');
const roleService = require('./role.service');
const httpStatus = require('http-status');

exports.createRole = catchAsync(async (req, res) => {
  const role = await roleService.createRole(req.body);
  res.status(httpStatus.CREATED).json({
    message: 'success',
    data: role,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// // Do NOT update passwords with this!
exports.updateUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
