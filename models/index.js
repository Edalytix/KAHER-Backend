"use strict"; 

const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "test";
const config = require(__dirname + "/../config/config.json")[env];
const db = {}; 
const logger = require("../utils/logger").logger;

const mongoose = require('mongoose');  
const connectionURI=`mongodb://${config.username}:${config.password}@${config.host}`
mongoose.connect(connectionURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

});


const mongoosedb = mongoose.connection;

mongoosedb.on('error', console.error.bind(console, 'connection error:'));
mongoosedb.once('open', function() {
  logger.info(`Connecting to database: ${env.toUpperCase()}`);
  console.log('Connected to MongoDB database!');
});


fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  }) 
  .forEach((file) => {
    const model = require(path.join(__dirname, file))
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.mongoose = mongoosedb;
db.models = db.mongoose.models;
module.exports = db;
 