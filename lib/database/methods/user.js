const models = require('../models').models;
const Op = require('../connection').operators;
const paginate = require('../paginate').paginateArray;
const mongoose = require('mongoose');
const User = models.User;
const Role = models.Role;
const Department = models.Department;
const Application = models.Application;
const Institution = models.Institution;

exports.User = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        const constructedParams = load(params);
        const user = new User(constructedParams.updateParams);

        try {
          await user.save();
          const update = await Department.findByIdAndUpdate(
            user.department.id,
            {
              $push: { users: user._id },
            }
          );

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
                  $concat: [
                    '$firstName',
                    ' ',
                    '$secondName',
                    ' ',
                    '$employeeId',
                  ],
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
          .populate('designation')
          .populate('institution')
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
    findAllForExcel: async (page, limit, searchQuery = '', statusQuery) => {
      try {
        const projection = {
          password: 0,
          presAddress: 0,
          permAddress: 0,
          __v: 0,
        };
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
          .populate('designation')
          .populate('institution')
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
        let users = await User.find(params, projection)
          .populate('role')
          .populate('designation')
          .populate('institution')
          .exec();
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
        const user = await User.findOne({ email })
          .populate('role')
          .populate('designation')
          .populate('institution')
          .exec();

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
    findByEmpyId: async ({ employeeId }) => {
      try {
        const user = await User.findOne({ employeeId })
          .populate('role')
          .populate('designation')
          .populate('institution')
          .exec();

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
        const user = await User.findById(id)
          .populate('role')
          .populate('designation')
          .populate('institution')
          .exec();

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

        delete res[0]?._id;

        return {
          msg: `Find users result`,
          data: { user: { ...user._doc }, ...res[0] },
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
    updateManyPassword: async (hashedPassword) => {
      try {
        // const Params = load(params);
        const update = await User.updateMany({}, { password: hashedPassword });

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
    addApplication: async (userUID, applicationID) => {
      try {
        const update = await User.findByIdAndUpdate(
          userUID, // Your query to find the document
          { $push: { applications: applicationID } } // $push to add 4 to the myArray field
        );

        console.log('User updated successfully!');
      } catch (error) {
        console.log(error);
        if (error.message.includes('duplicate key error collection')) {
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
        data: {},
      };
    },
    approverReport: async (applicationIds) => {
      try {
        const objectIdArray = applicationIds.map(
          (value) => new mongoose.Types.ObjectId(String(value))
        );

        let institutions = await Institution.find();
        const institutionArray = [];
        institutions.forEach(async (element) => {
          const applications = await Application.aggregate([
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $unwind: '$user',
            },
            {
              $match: {
                'user.institution': element._id,
              },
            },
            {
              $group: {
                _id: 1,
                total: { $sum: 1 },
                approved: {
                  $sum: {
                    $cond: [{ $eq: ['$level', 'approved'] }, 1, 0],
                  },
                },
                rWaiting: {
                  $sum: {
                    $cond: [{ $eq: ['$level', 'rWaiting'] }, 1, 0],
                  },
                },
                rejected: {
                  $sum: {
                    $cond: [{ $eq: ['$level', 'rejected'] }, 1, 0],
                  },
                },
                onHold: {
                  $sum: {
                    $cond: [{ $eq: ['$level', 'on-hold'] }, 1, 0],
                  },
                },
              },
            },
          ]);
          institutionArray.push({
            name: element.name,
            count: applications[0] || {},
          });
        });

        const applications = await Application.aggregate([
          {
            $match: {
              workflow: {
                $in: objectIdArray,
              },
            },
          },
          {
            $group: {
              _id: 1,
              total: { $sum: 1 },
              approved: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'approved'] }, 1, 0],
                },
              },
              rWaiting: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'rWaiting'] }, 1, 0],
                },
              },
              rejected: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'rejected'] }, 1, 0],
                },
              },
              onHold: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'on-hold'] }, 1, 0],
                },
              },
            },
          },
        ]);
        return {
          msg: `Created user successfully`,
          data: {
            applications: { ...applications[0] },
            institutions: institutionArray,
          },
        };
      } catch (error) {
        console.log(error);
        if (error.message.includes('duplicate key error collection')) {
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
    },
    adminReport: async (id) => {
      try {
        const currentDate = new Date();
        const total = await Application.countDocuments({});

        let institutions = await Institution.find();
        const institutionArray = [];

        for (let index = 0; index < institutions.length; index++) {
          const element = institutions[index];
          const total = await User.countDocuments({
            institution: new mongoose.Types.ObjectId(String(element._id)),
          });
          institutionArray.push({
            name: element.name,
            userCount: total,
          });
        }
        // Calculate the start date for the last month
        const lastMonthStartDate = new Date(currentDate);
        lastMonthStartDate.setMonth(currentDate.getMonth() - 1);

        // Calculate the start date for the last quarter
        const lastQuarterStartDate = new Date(currentDate);
        lastQuarterStartDate.setMonth(currentDate.getMonth() - 3);

        // Calculate the start date for the last year
        const lastYearStartDate = new Date(currentDate);
        lastYearStartDate.setFullYear(currentDate.getFullYear() - 1);

        const countLastMonth = await Application.aggregate([
          {
            $match: {
              createdAt: {
                $gte: lastMonthStartDate,
                $lte: currentDate,
              },
            },
          },
          {
            $group: {
              _id: '$level',
              countLastMonth: { $sum: 1 },
              totalApprovedAmount: { $sum: '$approvedAmount' },
            },
          },
          {
            $project: {
              _id: 0,
              level: '$_id',
              countLastMonth: 1,
              totalApprovedAmount: 1,
            },
          },
        ]);

        const countLastQuarter = await Application.aggregate([
          {
            $match: {
              createdAt: {
                $gte: lastQuarterStartDate,
                $lte: currentDate,
              },
            },
          },
          {
            $group: {
              _id: '$level',
              countLastQuarter: { $sum: 1 },
              totalApprovedAmount: { $sum: '$approvedAmount' },
            },
          },
          {
            $project: {
              _id: 0,
              level: '$_id',
              countLastQuarter: 1,
              totalApprovedAmount: 1,
            },
          },
        ]);

        const countLastYear = await Application.aggregate([
          {
            $match: {
              createdAt: {
                $gte: lastYearStartDate,
                $lte: currentDate,
              },
            },
          },
          {
            $group: {
              _id: '$level',
              countLastYear: { $sum: 1 },
              totalApprovedAmount: { $sum: '$approvedAmount' },
            },
          },
          {
            $project: {
              _id: 0,
              level: '$_id',
              countLastYear: 1,
              totalApprovedAmount: 1,
            },
          },
        ]);

        return {
          msg: `Find users result`,
          data: {
            total,
            lastMonth: countLastMonth,
            lastQuarter: countLastQuarter,
            lastYear: countLastYear,
            institutionUsers: institutionArray,
          },
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
    designation: params.designation,
    institution: params.institution,
    accountNumber: params.accountNumber,
    ifsc: params.ifsc,
    profile_picture: params.profile_picture,
    phoneNumber: params.phoneNumber,
    permAddress: params.permAddress,
    presAddress: params.presAddress,
    dob: params.dob,
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
    designation: 'designation',
    institution: 'institution',
    profile_picture: 'profile_picture',
    accountNumber: 'accountNumber',
    ifsc: 'ifsc',
    phoneNumber: 'phoneNumber',
    permAddress: 'permAddress',
    presAddress: 'presAddress',
    dob: 'dob',
  };

  let updateParams = {};

  for (const param in fields) {
    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}
