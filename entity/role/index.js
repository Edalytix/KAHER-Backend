const FromAddRole = require('./create-role');
const FromUpdateRole = require('./update-role');
exports.Roles = {
    addRole: FromAddRole.addRole,
    updateRole: FromUpdateRole.updateRole,
}