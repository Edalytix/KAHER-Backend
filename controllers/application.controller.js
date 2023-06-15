const fromAdaptReq = require("../utils/adapt-req");
// const ac = require("../roles");
const translate = require("../i18n/msg");
const crypto = require("../lib/crypto").crypto;
const DataValidator = require("../services").Services.DataValidator;
const CreateError = require("../error/dp-error").CreateError;
const logger = require("../utils/logger").logger;
const db = require("../lib/database").database;
const fromUseCase = require("../use-cases/application").applicationUseCases
const accessManager = require("../services/access-manager").accessManager;


exports.createApplication = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .createApplications({
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

exports.findAllApplications = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .findAllApplications({
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

exports.deleteApplication = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .deleteApplications({
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

exports.applicationDetails = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
    .ApplicationDetails({
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

exports.addForm = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .addForms({
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

exports.removeForms = async (req, res, next) => {
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

    return res.status(201).json(result.data);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.updateApplication = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .updateApplications({
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

exports.getAssignedApplications = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .getAssignedApplications({
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

exports.submitApplications = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .submitApplications({
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

exports.addComment = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .addComment({
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

exports.getComment = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .getComment({
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

exports.getUserApplications = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .getUserApplications({
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