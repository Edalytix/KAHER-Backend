const models = require('../models').models;
const Op = require('../connection').operators;
const Token = models.Token;

exports.Token = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        const token = new Token({
          token: params.token,
          sessData: params.sessData,
        });

        try {
          await token.save();
          console.log('Token created successfully!');
        } catch (err) {
          if (err.message.includes('duplicate key error collection')) {
            throw Error('Duplicate key error');
          }
        }
        return {
          msg: `Created token successfully`,
          data: { token },
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
          'Failed to create token details: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },

    findOne: async (token) => {
      try {
        let sessData = await Token.findOne({ token });

        return {
          msg: `Find statuss result`,
          data: sessData,
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
        const res = await Token.deleteOne(params);
        if (res.deletedCount !== 1) {
          throw Error('Token not deleted.');
        }
        return {
          msg: `delete token`,
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
