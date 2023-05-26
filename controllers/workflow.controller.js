const fromAdaptReq = require("../utils/adapt-req");
// const ac = require("../roles");
const translate = require("../i18n/msg");
const crypto = require("../lib/crypto").crypto;
const DataValidator = require("../services").Services.DataValidator;
const CreateError = require("../error/dp-error").CreateError;
const logger = require("../utils/logger").logger;
const db = require("../lib/database").database;
const fromUseCase = require("../use-cases/workflow").workflowUseCases
const accessManager = require("../services/access-manager").accessManager;


exports.createWorkflow = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .createWorkflows({
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

exports.findAllWorkflows = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .findAllWorkflows({
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

exports.deleteWorkflow = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .deleteWorkflows({
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

exports.updateWorkflows = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .updateWorkflows({
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


exports.workflowDetails = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase.workflowDetails
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
