const models = require('../models').models;
const Op = require('../connection').operators;
const paginate = require('../paginate').paginateArray;
const Institution = models.Institution;

exports.Institution = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        const constructedParams = load(params);

        const institution = new Institution(constructedParams.updateParams);

        try {
          await institution.save();
          console.log('Institution created successfully!');
        } catch (err) {
          if (err.message.includes('duplicate key error collection')) {
            throw Error('Duplicate key error');
          }
        }
        return {
          msg: `Created institution successfully`,
          data: { institution: unload(institution) },
        };
      } catch (error) {
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

    findAll: async (page, limit, searchQuery = '', statusQuery) => {
      try {
        let institutions = await Institution.find({
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        });
        institutions = paginate(institutions, page, limit);
        return {
          msg: `Find institutions result`,
          data: institutions,
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find mood by uid: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findById: async (id) => {
      try {
        const institution = await Institution.findById(id);
        return {
          msg: `Find institution result`,
          data: { institution },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find user by id: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    deleteById: async ({ id }) => {
      try {
        const res = await Institution.deleteOne({ _id: id });
        if (res.deletedCount !== 1) {
          throw Error('Institution not deleted.');
        }
        return {
          msg: `delete institution`,
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
    updateById: async ({ id, params }) => {
      try {
        const Params = load(params);
        const update = await Institution.findByIdAndUpdate(
          id,
          Params.updateParams,
          { new: true }
        );

        return {
          msg: `Updated institution details successfully`,
          data: { institution: unload(update) },
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
  });
};

function unload(params) {
  const data = {
    name: params.name,
    users: params.users,
    _id: params._id,
  };

  return data;
}

function load(fields) {
  // param map

  const paramsMap = {
    name: 'name',
    users: 'users',
  };

  let updateParams = {};

  for (const param in fields) {
    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}
