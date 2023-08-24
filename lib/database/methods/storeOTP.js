const models = require('../models').models;
const Op = require('../connection').operators;
const OTP = models.OTP;

exports.OTP = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        const otp = new OTP({
          otp: params.otp,
          keyPath: params.keyPath,
        });

        try {
          await otp.save();
          console.log('OTP created successfully!');
        } catch (err) {
          if (err.message.includes('duplicate key error collection')) {
            throw Error('Duplicate key error');
          }
        }
        return {
          msg: `Created otp successfully`,
          data: { otp },
        };
      } catch (error) {
        if (error.message.includes('Duplicate key error')) {
          console.log(error);
          throw new CreateError(translate(lang, 'duplicate_status'), 409);
        }
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to create otp details: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },

    findOne: async (keyPath) => {
      try {
        let otp = await OTP.findOne(
          { keyPath },
          {},
          { sort: { createdAt: -1 } }
        );

        return {
          msg: `Find statuss result`,
          data: otp,
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find mood by uid: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },

    deleteById: async (params) => {
      try {
        const res = await OTP.deleteOne(params);
        if (res.deletedCount !== 1) {
          throw Error('OTP not deleted.');
        }
        return {
          msg: `delete otp`,
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to delete mood by uid: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
  });
};

function unload(params) {
  const data = {
    applicationId: params.applicationId,
    stages: params.stages,
    _id: params._id,
  };

  return data;
}

function load(fields) {
  // param map

  const paramsMap = {
    applicationId: 'applicationId',
    stages: 'stages',
  };

  let updateParams = {};

  for (const param in fields) {
    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}
