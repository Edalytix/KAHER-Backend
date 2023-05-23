const fromAdaptReq = require("../utils/adapt-req");
// const ac = require("../roles");
const translate = require("../i18n/msg");
const crypto = require("../lib/crypto").crypto;
const DataValidator = require("../services").Services.DataValidator;
const CreateError = require("../error/dp-error").CreateError;
const logger = require("../utils/logger").logger;
const db = require("../lib/database").database;
const fromUseCase = require("../use-cases/roles").roleUseCases;
const accessManager = require("../services/access-manager").accessManager;


exports.createRoles = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .createRoles({
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

exports.findAllRoles = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .findAllRoles({
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

    return res.status(201).json(result.data);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};
exports.findRoleDetails = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .rolesDetails({
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

    return res.status(201).json(result.data);
  } catch (error) {
    // console.log(error)
    next(error);
  }}

exports.deleteRoles = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .deleteRoles({
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

exports.updateRoles = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .updateRoles({
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
