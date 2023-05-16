const client = require('../lib/store/connection');
const {db} = require('../lib/database/connection')
const checkHealth = async(req, res, next) => {
    try {
        const redis = client.connected;

        const database = await testDbConnection();

        const redisContainer = await setValue('test', 10, 'test_redis_container.')

        if(!redis) {
            return res.status(500).send({ msg: 'redis server is not connected.' })
        }
        if(!database) {
            return res.status(500).send({ msg: 'database is not connected.' })
        }
        if(!redisContainer) {
            return res.status(500).send({ msg: 'redis container is full or not working properly.' })
        }

        if(redis && database && redisContainer){
            return res.status(200).send({ msg: 'Everything working fine.' })
        }    

        
    } catch (error) {
        console.log("🚀 ~ file: app-health.js ~ line 15 ~ checkHealth ~ error", error)
    }

    return next();
}

function testDbConnection() {
    return db.sequelize.authenticate()
     .then(() => true);
}

async function setValue(key, duration, value) {
    return new Promise((resolve, reject) => {
        client.setex(key, duration, value, (err, res) => {
            if (err) {
            reject(false);
            } else {
            resolve(true);
            }
        });
    });
}
  

module.exports = checkHealth;

