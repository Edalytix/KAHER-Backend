const fromAdaptReq = require("../utils/adapt-req");
// const ac = require("../roles");
const translate = require("../i18n/msg");
const crypto = require("../lib/crypto").crypto;
const DataValidator = require("../services").Services.DataValidator;
const CreateError = require("../error/dp-error").CreateError;
const logger = require("../utils/logger").logger;
const db = require("../lib/database").database;
const fromUseCase = require("../use-cases/department").departmentUseCases;



exports.createDepartment = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .createDepartments({
        CreateError,
        DataValidator,
        logger, 
        translate, 
        crypto,
        request,
        db,
        
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

exports.updateDepartment = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .updateDepartments({
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
