const models = require('../models').models;
const Op = require('../connection').operators;
const paginate = require('../paginate').paginateArray;
const Role = models.Role;

exports.Role = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        const constructedParams = load(params);

        const role = new Role(constructedParams.updateParams);

        try {
          await role.save();
          console.log('Role created successfully!');
        } catch (err) {
          if (err.message.includes('duplicate key error collection')) {
            throw Error('Duplicate key error');
          }
        }
        return {
          msg: `Created role successfully`,
          data: { role: unload(role) },
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

    findAll: async (page, limit, searchQuery = '', statusQuery = 'active') => {
      try {
        let roles = await Role.find({
          name: { $regex: searchQuery, $options: 'i', status: statusQuery },
        });
        roles = paginate(roles, page, limit);
        return {
          msg: `Find roles result`,
          data: roles,
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
        console.log(id);
        const role = await Role.findById(id);
        return {
          msg: `Find role result`,
          data: { role },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find user by id: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findByName: async (name) => {
      try {
        const role = await Role.findOne({ name: name });
        return {
          msg: `Find role result`,
          data: { role },
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
        const res = await Role.deleteOne({ _id: id });
        if (res.deletedCount !== 1) {
          throw Error('Role not deleted.');
        }
        return {
          msg: `delete role`,
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
    update: async ({ id, params }) => {
      try {
        const Params = load(params);
        const update = await Role.findByIdAndUpdate(id, Params.updateParams);

        return {
          msg: `Updated role details successfully`,
          data: { role: unload(update) },
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
    status: params.status,
    permissions: params.permissions,
    code: params.code,
    type: params.type,
    _id: params._id,
  };

  return data;
}

function load(fields) {
  // param map

  const paramsMap = {
    name: 'name',
    status: 'status',
    permissions: 'permissions',
    code: 'code',
    type: 'type',
  };

  let updateParams = {};

  for (const param in fields) {
    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}
