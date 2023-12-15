const models = require('../models').models;
const Op = require('../connection').operators;
const paginate = require('../paginate').paginateArray;
const Designation = models.Designation;

exports.Designation = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        const constructedParams = load(params);

        const designation = new Designation(constructedParams.updateParams);

        try {
          await designation.save();
          console.log('Designation created successfully!');
        } catch (err) {
          if (err.message.includes('duplicate key error collection')) {
            throw Error('Duplicate key error');
          }
        }
        return {
          msg: `Created designation successfully`,
          data: { designation: unload(designation) },
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

    findAll: async (page, limit, searchQuery = '') => {
      try {
        console.log(searchQuery, 'searchQuery');
        let designations = await Designation.find({
          name: {
            $regex: searchQuery,
          },
        });
        designations = paginate(designations, page, limit);
        return {
          msg: `Find designations result`,
          data: designations,
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
        const designation = await Designation.findById(id);
        return {
          msg: `Find designation result`,
          data: { designation },
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
        const res = await Designation.deleteOne({ _id: id });
        if (res.deletedCount !== 1) {
          throw Error('Designation not deleted.');
        }
        return {
          msg: `delete designation`,
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
        const update = await Designation.findByIdAndUpdate(
          id,
          Params.updateParams
        );

        return {
          msg: `Updated designation details successfully`,
          data: { designation: unload(update) },
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
