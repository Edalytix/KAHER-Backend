const connection = require('./connection');
const fromMethods = require('./methods');
module.exports = {
    client: connection,
    methods: {
        ...fromMethods
    }
}