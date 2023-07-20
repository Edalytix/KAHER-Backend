const fromAdaptReq = require('../utils/adapt-req');
// const ac = require("../roles");
const translate = require('../i18n/msg');
const crypto = require('../lib/crypto').crypto;
const DataValidator = require('../services').Services.DataValidator;
const CreateError = require('../error/dp-error').CreateError;
const logger = require('../utils/logger').logger;
const db = require('../lib/database').database;
const fromUseCase = require('../use-cases/response').responseUseCases;
const uploadFile = require('../services/upload-file').uploadFile;

exports.createResponse = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .createResponses({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
        uploadFile,
      })
      .execute();

    return res.status(201).json(result.data.res);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.findAllDepartments = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .findAllDepartments({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
      })
      .execute();

    return res.status(201).json(result.data);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .deleteDepartments({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
      })
      .execute();

    return res.status(201).json(result.data.res);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.updateResponse = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .updateResponses({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
      })
      .execute();

    return res.status(201).json(result.data.res);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .addUser({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
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

exports.departmentDetails = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .departmentDetails({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
      })
      .execute();

    return res.status(201).json(result.data);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .listUser({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
      })
      .execute();

    return res.status(201).json(result.data);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.removeUsers = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .removeUser({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
      })
      .execute();

    return res.status(201).json(result.data);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};
