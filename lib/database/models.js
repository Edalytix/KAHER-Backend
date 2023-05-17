const connection = require("./connection");
const db = connection.db; 
exports.models = {

  Department: db.Department,
  Role: db.Role,
  User: db.User,
};
