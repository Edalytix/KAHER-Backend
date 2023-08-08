const fromAdaptReq = require('../utils/adapt-req');
const translate = require('../i18n/msg');
const crypto = require('../lib/crypto').crypto;
const DataValidator = require('../services').Services.DataValidator;
const CreateError = require('../error/dp-error').CreateError;
const logger = require('../utils/logger').logger;
const db = require('../lib/database').database;
const fromUseCase = require('../use-cases/institution').institutionUseCases;
const accessManager = require('../services/access-manager').accessManager;

exports.createInstitutions = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .createInstitutions({
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

exports.findAllInstitutions = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .findAllInstitutions({
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

exports.deleteInstitutions = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .deleteInstitutions({
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

exports.updateInstitutions = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .updateInstitutions({
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

exports.findInstitutionDetails = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .findInstitutionDetails({
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
