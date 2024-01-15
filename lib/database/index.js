const connection = require('./connection');

const logger = require('../../utils/logger').logger;

// const Sequelize = require('sequelize');
// const operators = Sequelize.Op;

const db = connection.db;
const operators = connection.operators;

const models = require('./models').models;
const methods = require('./methods').methods;

module.exports.database = {
  connectionTest: () => {
    console.log('start connecting to database');
    db.sequelize
      .authenticate()
      .then(() => {
        logger.info(
          'Connection to database has been established successfully.'
        );
        return true;
      })
      .catch((err) => {
        logger.error('Unable to connect to the database: %s', err);
        return false;
      });
  },
  sequelize: connection.sequelize,
  operators,
  models,
  methods,
};
