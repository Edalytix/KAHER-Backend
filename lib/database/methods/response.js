const models = require('../models').models;
const Op = require('../connection').operators;
const Response = models.Response;
const paginate = require('../paginate').paginateArray;

exports.Response = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        const constructedParams = load(params);
        const response = new Response(constructedParams.updateParams);
        try {
          await response.save();
          console.log('Response created successfully!');
        } catch (err) {
          if (err.message.includes('duplicate key error collection')) {
            throw Error('Duplicate key error');
          }
        }
        return {
          msg: `Created response successfully`,
          data: { response: unload(response) },
        };
      } catch (error) {
        console.log('first', error);
        if (error.message.includes('Duplicate key error')) {
          throw new CreateError(translate(lang, 'duplicate_user'), 409);
        }
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to create user details: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },

    findAll: async (page, limit) => {
      try {
        let departments = await Response.find();
        departments = paginate(departments, page, limit);
        return {
          msg: `Find departments result`,
          data: departments.results,
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find mood by uid: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },

    deleteByEmail: async ({ email }) => {
      try {
        const res = await Response.deleteOne({ email });
        if (res.deletedCount !== 1) {
          throw Error('Response not deleted.');
        }
        return {
          msg: `delete response`,
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
    update: async (params) => {
      try {
        const Params = load(params);

        const updateParams = Params.updateParams;
        const propertiesToDelete = ['fuid', 'auid', 'wuid', 'uid'];
        const updatedParams = {};

        for (const key in updateParams) {
          if (!propertiesToDelete.includes(key)) {
            updatedParams[key] = updateParams[key];
          }
        }

        const update = await Response.findOneAndUpdate(
          {
            fuid: Params.updateParams.fuid,
            uid: Params.updateParams.uid,
            auid: Params.updateParams.auid,
            wuid: Params.updateParams.wuid,
          },
          updatedParams,
          { new: true }
        );

        return {
          msg: `Updated response details successfully`,
          data: { update },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to update mood details: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findById: async (id) => {
      try {
        const response = await Response.findById(id);
        return {
          msg: `Find users result`,
          data: { response },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find user by id: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    addFile: async ({ id, qid, url }) => {
      try {
        const response = await Response.updateOne(
          {
            _id: id,
            'responses.quid': qid,
          },
          { $set: { 'responses.$.file': url } }
        );
        return {
          msg: `Find users result`,
          data: { response },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find user by id: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
  });
};

function unload(params) {
  const data = {
    fuid: params.fuid,
    wuid: params.wuid,
    auid: params.auid,
    createdAt: params.createdAt,
    uid: params.uid,
    responses: params.responses,
    _id: params._id,
  };

  return data;
}

function load(fields) {
  // param map

  const paramsMap = {
    fuid: 'fuid',
    wuid: 'wuid',
    auid: 'auid',
    createdAt: 'createdAt',
    uid: 'uid',
    responses: 'responses',
  };

  let updateParams = {};

  for (const param in fields) {
    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}
