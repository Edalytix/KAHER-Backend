const redis = require("redis");
const bluebird = require("bluebird");

const redisConfig = require('../../config/redis.config.json');

const redisHost = redisConfig[process.env.NODE_ENV].host; 
const redisPort = redisConfig[process.env.NODE_ENV].port;

const logger = require('../../utils/logger').logger;
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);



//redis client configuration
const client = redis.createClient({
    host: redisHost,
    port: redisPort
});


client.on('connect', function () {
    logger.info(`Connection established with redis server on ${redisPort}`, redisHost);
});

client.on("error", function (err) {
    logger.error('Failed to connect with redis server', err);
});

module.exports = client;