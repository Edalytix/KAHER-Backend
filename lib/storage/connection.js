const obsConfig = require('../../config/obs.config.json');

// Import the OBS library.
const ObsClient = require('./obs/obs');

const env = process.env.NODE_ENV || 'development';

// Create an instance of ObsClient.
module.exports = new ObsClient({
    access_key_id: obsConfig[env].accessKey,
    secret_access_key: obsConfig[env].secretKey,
    server: obsConfig[env].server,
});

