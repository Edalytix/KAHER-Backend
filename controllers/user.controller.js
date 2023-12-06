const fromAdaptReq = require('../utils/adapt-req');
// const ac = require("../roles");
const translate = require('../i18n/msg');
const crypto = require('../lib/crypto').crypto;
const DataValidator = require('../services').Services.DataValidator;
const CreateError = require('../error/dp-error').CreateError;
const logger = require('../utils/logger').logger;
const db = require('../lib/database').database;
const fromUseCase = require('../use-cases/users').userUseCases;
const token = require('../lib/token').token;
const store = require('../lib/store').store;
const accessManager = require('../services/access-manager').accessManager;
const mailer = require('../services/send-mail').mailer;
const uploadFile = require('../services/upload-file').uploadFile;

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
        accessManager,
        uploadFile,
        mailer,
        token,
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
        store,
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
        accessManager,
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
        accessManager,
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
        accessManager,
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
        accessManager,
        uploadFile,
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

exports.findAllUsersNoAuthorization = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .findAllUsersNoAuthorization({
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

    return res.status(201).json({
      msg: result.data.res.msg,
      data: result.data.res.data,
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.uploadExcel = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .uploadExcel({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
        accessManager,
        mailer,
        store,
        token,
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

exports.SendExcelEmail = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .SendExcelEmail({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
        accessManager,
        mailer,
        store,
        token,
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

exports.SetPassword = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .SetPassword({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
        accessManager,
        mailer,
        store,
      })
      .execute();

    return res.status(201).json({
      msg: result.msg,
      data: result.data,
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.PasswordReset = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .PasswordReset({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        request,
        db,
        accessManager,
        mailer,
        store,
        token,
      })
      .execute();

    return res.status(201).json({
      msg: result.msg,
      data: result.data,
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.fromFindAllForExcel = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .fromFindAllForExcel({
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

    return res.status(201).json({
      msg: result.data.res.msg,
      data: result.data.res.data,
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.BruteResetPassword = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .BruteResetPassword({
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

    return res.status(201).json({
      msg: result.msg,
      data: result.data,
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.ApproverReport = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .ApproverReport({
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

    return res.status(201).json({
      msg: result.msg,
      data: result.data,
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

exports.AdminReport = async (req, res, next) => {
  try {
    const request = fromAdaptReq.adaptReq(req, res);
    const result = await fromUseCase
      .AdminReport({
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

    return res.status(201).json({
      msg: result.msg,
      data: result.data,
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};
