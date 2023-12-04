const mongoose = require('mongoose');

const mailLogSchema = new mongoose.Schema({
    error: {
        type: String,
    },
    info: {
        type: String,
    },
    response: {
        type: String,
    },
});

const mailLog = mongoose.model('mailLog', mailLogSchema);

module.exports = mailLog;
