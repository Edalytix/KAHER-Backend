const fromDepartment = require("./department");
const fromRole = require('./roles');
const fromUser = require('./user');
// //const fromExercise = require("./track_exercise");
// const fromWater = require("./track_water");

exports.methods = {
  Department: fromDepartment.Department,
  Role: fromRole.Role,
  User: fromUser.User,

};
