const fromAdaptReq = require("../utils/adapt-req");
// const ac = require("../roles");
const translate = require("../i18n/msg");
const crypto = require("../lib/crypto").crypto;
const DataValidator = require("../services").Services.DataValidator;
const CreateError = require("../error/dp-error").CreateError;
const logger = require("../utils/logger").logger;
const db = require("../lib/database").database;
const fromUseCase = require("../use-cases/form").formUseCases;
const accessManager = require("../services/access-manager").accessManager;


exports.createForm = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .createForms({
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

    return res.status(201).json(
      result.data.res,
    );
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.findAllForms = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .findAllForms({
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

exports.deleteForm = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .deleteForms({
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

exports.updateForms = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .updateForms({
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


exports.formDetails = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.formDetails
      ({
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
