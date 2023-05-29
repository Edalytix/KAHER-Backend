const fromAdaptReq = require("../utils/adapt-req");
// const ac = require("../roles");
const translate = require("../i18n/msg");
const crypto = require("../lib/crypto").crypto;
const DataValidator = require("../services").Services.DataValidator;
const CreateError = require("../error/dp-error").CreateError;
const logger = require("../utils/logger").logger;
const db = require("../lib/database").database;
const fromUseCase = require("../use-cases/users").userUseCases;
const token = require("../lib/token").token;
const store = require("../lib/store").store;
const accessManager = require("../services/access-manager").accessManager;

exports.createUser = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .createUsers({
        CreateError,
        DataValidator,
        logger, 
        translate, 
        crypto,
        request,
        db,
        accessManager
      })
      .execute();

    return res.status(201).json(result.data.res);
  } catch (error) {
    // console.log(error)
    next(error);
  } 
};
 
exports.Login = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .login({
        CreateError,
        DataValidator,
        logger, 
        translate, 
        crypto,
        request,
        db,
        token,
        store
      })
      .execute();

    return res.status(201).json(result);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.findUser = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .userDetails({
        CreateError,
        DataValidator,
        logger, 
        translate, 
        crypto,
        request,
        db,
        accessManager
      })
      .execute();

    return res.status(201).json({
      msg: result.data.res.msg,
      data: result.data.res.data,
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.findAllUsers = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .findAllUsers({
        CreateError,
        DataValidator,
        logger, 
        translate, 
        crypto,
        request,
        db,
        accessManager
      })
      .execute();

    return res.status(201).json({
      msg: result.data.res.msg,
      data: result.data.res.data,
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .deleteUser({
        CreateError,
        DataValidator,
        logger, 
        translate, 
        crypto,
        request,
        db,
        accessManager
      })
      .execute();

    return res.status(201).json({
      msg: result.data.res.msg,
      data: result.data.res.data,
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .updateUser({
        CreateError,
        DataValidator,
        logger, 
        translate, 
        crypto,
        request,
        db,
        accessManager
      })
      .execute();

    return res.status(201).json({
      msg: result.data.res.msg,
      data: result.data.res.data,
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};