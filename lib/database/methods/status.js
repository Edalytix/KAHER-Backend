const models = require('../models').models;
const Op = require('../connection').operators;
const Status = models.Status;
const Workflow = models.Workflow;
const Form = models.Form;
const Response = models.Response;
const paginate = require('../paginate').paginateArray;

exports.Status = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        const constructedParams = load(params);

        const status = new Status(constructedParams.updateParams);

        try {
          await status.save();
          console.log('Status created successfully!');
        } catch (err) {
          if (err.message.includes('duplicate key error collection')) {
            throw Error('Duplicate key error');
          }
        }
        return {
          msg: `Created status successfully`,
          data: { status: unload(status) },
        };
      } catch (error) {
        if (error.message.includes('Duplicate key error')) {
          throw new CreateError(translate(lang, 'duplicate_status'), 409);
        }
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to create status details: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },

    findAll: async (page, limit) => {
      try {
        let statuss = await Status.find()
          .populate('user')
          .populate('department')
          .populate('workflow')
          .exec();
        statuss = paginate(statuss, page, limit);
        return {
          msg: `Find statuss result`,
          data: statuss,
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
        const res = await Status.deleteOne({ email });
        if (res.deletedCount !== 1) {
          throw Error('Status not deleted.');
        }
        return {
          msg: `delete status`,
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
    update: async (id, arrayIndex, fieldToUpdate, status) => {
      try {
        const date = new Date();
        const options = {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        };
        const formattedDate = date.toLocaleString('en-US', options);

        const update = await Status.updateOne(
          { applicationId: id },
          {
            $set: {
              [`stages.${arrayIndex}.${fieldToUpdate}`]: status,
              [`stages.${arrayIndex}.updatedAt`]: formattedDate,
            },
          }
        );

        return {
          msg: `Updated status details successfully`,
          data: {},
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
        const status = await Status.findOne({ applicationId: id });

        return {
          msg: `Find statuss result`,
          data: {
            status,
          },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to find status by id: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findUsers: async (id) => {
      try {
        const status = await Status.findOne({ _id: id })
          .populate('users')
          .exec();

        return {
          msg: `Find statuss result`,
          data: { status },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to find status by id: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findAllAssignedApps: async (id) => {
      try {
        const user = await User.findOne({ _id: id });
        const userId = user._id; // Replace with the user ID to match
        const departmentIds = user.department.map((obj) => obj.id); // Replace with the department ID to match
        const roleId = user.role; // Replace with the role ID to match

        const statuss = await Status.find({
          workflow: {
            $elemMatch: {
              approvals: {
                $elemMatch: {
                  approvalBy: {
                    $or: [
                      { 'approvalBy.user': userId },
                      {
                        'approvalBy.department': { $in: departmentIds },
                        'approvalBy.role': roleId,
                      },
                    ],
                  },
                },
              },
            },
          },
        })
          .populate('user')
          .populate('department')
          .populate('workflow')
          .populate({
            path: 'workflow',
            populate: {
              path: 'forms.form',
              model: 'Form',
            },
          })
          .exec();

        return {
          msg: `Find statuss result`,
          data: { status },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to find status by id: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    updateApproval: async ({ id, params }) => {
      try {
        const Params = load(params);
        if (Params.updateParams.status === 'approved') {
          const updateWorkflow = await Workflow.findByIdAndUpdate(id, {});
        }
        const update = await Status.findByIdAndUpdate(id, {
          $set: { users: Params.updateParams.users },
        });
        return {
          msg: `Updated status details successfully`,
          data: {},
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
    addStatus: async ({ id, params }) => {
      try {
        const status = await Status.updateOne(
          { applicationId: id },
          { $push: { actions: params } }
        );

        return {
          msg: `Find applications result`,
          data: { status },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to find application by id: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    addUsers: async ({ id, params }) => {
      try {
        const Params = load(params);
        const update = await Status.findByIdAndUpdate(id, {
          $set: { users: Params.updateParams.users },
        });
        return {
          msg: `Updated status details successfully`,
          data: {},
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
    removeUser: async ({ id, userid }) => {
      try {
        const update = await Status.findByIdAndUpdate(id, {
          $pull: { users: userid },
        });

        return {
          msg: `Updated status details successfully`,
          data: {},
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
    deleteById: async (id) => {
      try {
        const res = await Status.deleteOne({ _id: id });
        if (res.deletedCount !== 1) {
          throw Error('Status not deleted.');
        }

        return {
          msg: `delete status`,
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
