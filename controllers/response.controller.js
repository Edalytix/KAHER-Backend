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

exports.addFile = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .addFile({
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

    return res.status(201).json(result.data);
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

exports.updateRejected = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .updateRejected({
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

exports.resubmitRejected = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .resubmitRejected({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
      })
      .execute();

    return res.status(201).json(result);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};
