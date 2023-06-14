const connection = require("./connection");
const db = connection.db; 
exports.models = {

  Department: db.Department,
  Role: db.Role,
  User: db.User,
  Form: db.Form,
  Response: db.Response,
  Workflow: db.Workflow,
  Application: db.Application,
  Comment: db.Comment,
};
