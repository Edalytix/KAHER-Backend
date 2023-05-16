const connection = require("./connection");
const db = connection.db; 
console.log(db)
exports.models = {

  Department: db.Department,
  Role: db.Role,
  User: db.User,
};
