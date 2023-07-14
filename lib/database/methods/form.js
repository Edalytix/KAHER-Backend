const models = require('../models').models;
const Op = require('../connection').operators;
const Form = models.Form;
const Workflow = models.Workflow;
const paginate = require('../paginate').paginateArray;

exports.Form = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        const constructedParams = load(params);

        const form = new Form(constructedParams.updateParams);
        try {
          const ress = await form.save();
          console.log('Form created successfully!');
        } catch (error) {
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
          msg: `Created form successfully`,
          data: { form: unload(form) },
        };
      } catch (error) {
        if (error.message.includes('Duplicate key error')) {
          throw new CreateError(translate(lang, 'duplicate_form'), 409);
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
        let forms = await Form.find({
          title: { $regex: searchQuery, $options: 'i' },
          version: 'latest',
          status: statusQuery,
        });
        forms = paginate(forms, page, limit);
        return {
          msg: `Find forms result`,
          data: forms,
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find mood by uid: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findAllWorkflows: async (workflowIds) => {
      try {
        let workflows = await Workflow.find({
          _id: { $in: workflowIds },
          status: { $eq: 'active' },
        });
        return {
          msg: `Find forms result`,
          data: workflows,
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find mood by uid: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },

    deleteById: async (id) => {
      try {
        const workflows = await Workflow.find({
          forms: { $elemMatch: { form: id } },
        });
        // Step 2: Update each Workflow document
        for (const workflow of workflows) {
          // Step 2a: Retrieve the Workflow document from the database
          const workflowDoc = await Workflow.findById(workflow._id);

          // Step 2b: Remove the deleted Form's _id from the forms array
          workflowDoc.forms = workflowDoc.forms.filter(
            (formId) => formId != id
          );

          // Step 2c: Save the updated Workflow document back to the database
          await workflowDoc.save();
        }

        const res = await Form.deleteOne({ _id: id });
        if (res.deletedCount !== 1) {
          throw Error('Form not deleted.');
        }
        return {
          msg: `delete form`,
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

        const update = await Form.findByIdAndUpdate(id, Params.updateParams);

        return {
          msg: `Updated form details successfully`,
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
        const form = await Form.findById(id).populate('workflows').exec();
        return {
          msg: `Find users result`,
          data: { form },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find user by id: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findUsers: async (id) => {
      try {
        const form = await Form.findOne({ _id: id }).populate('users').exec();

        return {
          msg: `Find users result`,
          data: { form },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find user by id: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    addUsers: async ({ id, params }) => {
      try {
        const Params = load(params);
        const update = await Form.findByIdAndUpdate(id, {
          $set: { users: Params.updateParams.users },
        });
        return {
          msg: `Updated form details successfully`,
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
        const update = await Form.findByIdAndUpdate(id, {
          $pull: { users: userid },
        });

        return {
          msg: `Updated form details successfully`,
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
  });
};

function unload(params) {
  const data = {
    title: params.title,
    createdAt: params.createdAt,
    workflows: params.workflows,
    questions: params.questions,
    status: params.status,
    version: params.version,
    _id: params._id,
  };

  return data;
}

function load(fields) {
  // param map

  const paramsMap = {
    title: 'title',
    createdAt: 'createdAt',
    workflows: 'workflows',
    questions: 'questions',
    status: 'status',
    version: 'version',
  };

  let updateParams = {};

  for (const param in fields) {
    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}
