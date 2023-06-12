const FromAddResponse = require('./create-response');
const FromUpdateResponse = require('./update-response');

exports.Responses = {
    addResponse: FromAddResponse.addResponse,
    updateResponse: FromUpdateResponse.updateResponse,
}