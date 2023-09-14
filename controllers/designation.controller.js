const fromAdaptReq = require('../utils/adapt-req');
const translate = require('../i18n/msg');
const crypto = require('../lib/crypto').crypto;
const DataValidator = require('../services').Services.DataValidator;
const CreateError = require('../error/dp-error').CreateError;
const logger = require('../utils/logger').logger;
const db = require('../lib/database').database;
const fromUseCase = require('../use-cases/designation').designationUseCases;
const accessManager = require('../services/access-manager').accessManager;

exports.createDesignations = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .createDesignations({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
        accessManager,
      })
      .execute();

    return res.status(201).json(result.data.res);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.findAllDesignations = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .findAllDesignations({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
        accessManager,
      })
      .execute();

    return res.status(201).json(result.data);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.deleteDesignations = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .deleteDesignations({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
        accessManager,
      })
      .execute();

    return res.status(201).json(result.data.res);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.updateDesignations = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .updateDesignations({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
        accessManager,
      })
      .execute();

    return res.status(201).json(result.data.res);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.findDesignationDetails = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .findDesignationDetails({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
        accessManager,
      })
      .execute();

    return res.status(201).json(result.data);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.findAllDesignationsNoAuth = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .findAllDesignationsNoAuth({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
        accessManager,
      })
      .execute();

    return res.status(201).json(result.data);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};
