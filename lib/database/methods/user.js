const models = require('../models').models;
const Op = require('../connection').operators;
const paginate = require('../paginate').paginateArray;
const User = models.User;
const Role = models.Role;
const Application = models.Application;

exports.User = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        const constructedParams = load(params);
        const user = new User(constructedParams.updateParams);
        try {
          await user.save();
          console.log('User created successfully!');
        } catch (err) {
          console.log(err);
          if (err.message.includes('duplicate key error collection')) {
            throw Error('Duplicate key error');
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
        return {
          msg: `Created user successfully`,
          data: { user: unload(user) },
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
        const projection = { password: 0 };
        let users = await User.find(
          {
            $expr: {
              $regexMatch: {
                input: {
                  $concat: ['$firstName', ' ', '$secondName'],
                },
                regex: searchQuery,
                options: 'i',
              },
            },
            status: statusQuery ? statusQuery : ['active', 'inactive'],
          },
          projection
        )
          .populate('role')
          .exec();
        users = paginate(users, page, limit);
        return {
          msg: `Find users result`,
          data: users,
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find users: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findAllForUsers: async () => {
      try {
        const projection = { _id: 1, firstName: 1, secondName: 1 };
        let users = await User.find({}, projection);
        return {
          msg: `Find users result`,
          data: users,
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find users: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findByParams: async (params) => {
      try {
        const projection = { password: 0 };
        let users = await User.find(params, projection).populate('role').exec();
        return {
          msg: `Find users result`,
          data: users,
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find users: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findByEmail: async ({ email }) => {
      try {
        const user = await User.findOne({ email }).populate('role').exec();

        return {
          msg: `Find users result`,
          data: { user },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to find user by email: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findById: async (id) => {
      try {
        const user = await User.findById(id).populate('role').exec();

        const res = await Application.aggregate([
          {
            $match: {
              user: user._id,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              approved: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'approved'] }, 1, 0],
                },
              },
              lastMonth: {
                $sum: {
                  $cond: [
                    {
                      $gt: [
                        '$createdAt',
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              lastQuarter: {
                $sum: {
                  $cond: [
                    {
                      $gt: [
                        '$createdAt',
                        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ]);

        delete res[0]._id;

        return {
          msg: `Find users result`,
          data: { ...user._doc, ...res[0] },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find user by id: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    deleteById: async (id) => {
      try {
        const res = await User.deleteOne({ _id: id });

        if (res.deletedCount !== 1) {
          throw Error('User not deleted.');
        }
        return {
          msg: `delete user`,
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to delete user by id: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    update: async ({ id, params }) => {
      try {
        const Params = load(params);
        const update = await User.findByIdAndUpdate(id, Params.updateParams, {
          returnOriginal: false,
        });

        return {
          msg: `Updated user details successfully`,
          data: unload(update),
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to update user details: %s %s',
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
    uuid: params.uuid,
    firstName: params.firstName,
    secondName: params.secondName,
    status: params.status,
    statusActivation: params.statusActivation,
    applications: params.applications,
    role: params.role,
    department: params.department,
    email: params.email,
    type: params.type,
    password: params.password,
    _id: params._id,
    employeeId: params.employeeId,
  };

  return data;
}

function load(fields) {
  // param map

  const paramsMap = {
    uuid: 'uuid',
    firstName: 'firstName',
    secondName: 'secondName',
    status: 'status',
    statusActivation: 'statusActivation',
    applications: 'applications',
    role: 'role',
    department: 'department',
    email: 'email',
    password: 'password',
    employeeId: 'employeeId',
    type: 'type',
  };

  let updateParams = {};

  for (const param in fields) {
    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}
