const models = require("../models").models;
const Op = require("../connection").operators;
const Workflow = models.Workflow;
const Form = models.Form;
const Application = models.Application;
const paginate = require("../paginate").paginateArray

exports.Workflow = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        
        const constructedParams = load(params);

        const workflow = new Workflow(constructedParams.updateParams);
        
          try {
            await workflow.save();
            console.log('Workflow created successfully!');
          } catch (err) {
            if(err.message.includes("duplicate key error collection"))
            {
              throw Error('Duplicate key error')
            }
          }
        return {
          msg: `Created workflow successfully`,
          data: unload(workflow) ,
        };
      } catch (error) {

        if (error.message.includes("Duplicate key error")) {
          throw new CreateError(translate(lang, "duplicate_user"), 409);
        }
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to create user details: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },

    findAll: async (page, limit) => {
      try {
        let workflows = await Workflow.find();
        workflows = paginate(workflows, page, limit);
        return {
          msg: `Find workflows result`,
          data:  workflows ,
        };
      } catch (error) {
        
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to find mood by uid: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
      },
  
    deleteByEmail: async ({ email }) => {
      try {
        const res = await Workflow.deleteOne({ email })
        if(res.deletedCount!==1) {throw Error('Workflow not deleted.');}
        return {
          msg: `delete workflow`,
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to delete mood by uid: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
   
    },
    update: async ({ id, params }) => {
      try {
        const Params = load(params);
   
        const update = await Workflow.findByIdAndUpdate(id, Params.updateParams)
 
        return {
          msg: `Updated workflow details successfully`,
          data: {  },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to update mood details: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    findById: async (id) => {
      try {
       const workflow = await Workflow.findById(id)
        .populate('applications')
        .populate('forms.form')
        .populate('approvals.approvalBy.user')
        .populate('approvals.approvalBy.department')
        .populate('approvals.approvalBy.role')
        .exec()
        return {
          msg: `Find workflows result`,
          data: { workflow },
        };
      } catch (error) {
        
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to find user by id: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
      },
      findUsers: async (id) => {
        try {
          const workflow = await Workflow.findOne({ _id: id })
          .populate('users')
          .exec()

          return {
            msg: `Find workflows result`,
            data: { workflow },
          };
        } catch (error) {
          
          if (error instanceof CreateError) {
            throw error;
          }
          logger.error("Failed to find user by id: %s %s", error.message, error);
          throw Error(translate(lang, "unknown_error_contact_support"));
        }
        },
    addForms: async ({ id, params }) => {
      try {
        const Params = load(params);
        const update = await Workflow.findByIdAndUpdate(id, { $set: { "forms": Params.updateParams.forms}})
        Params.updateParams.forms.forEach(async element => {
          const updateForm = await Form.findByIdAndUpdate(element.form, { $set: { "workflows": id}})
        });
        
        return { 
          msg: `Updated workflow details successfully`,
          data: {  },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to update mood details: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    removeForm: async ({ id, formid }) => {
      try {
        const update = await Workflow.findOneAndUpdate(
          { "forms.form": formid },
          { $pull: { forms: { form: formid } } }
        ); 
        return {
          msg: `Updated workflow details successfully`,
          data: {  },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to update mood details: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },
    deleteById: async (id) => {
      try {
        const res = await Workflow.deleteOne({ _id: id })
        if(res.deletedCount!==1) {throw Error('Workflow not deleted.');}

        const application = await Application.updateOne({ workflow: id }, { workflow: null });
        return {
          msg: `delete workflow`,
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to delete mood by uid: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }},
  });
};

function unload(params) {

  const data = {
  name: params.name,
  applications: params.applications,
  approvals: params.approvals,
  status: params.status,
  level: params.level,
  workflows: params.workflows,
  forms: params.forms,
  _id: params._id,
  createdAt: params.createdAt,
  };

  return data;
}

function load(fields) {
  // param map

  const paramsMap = {
    name: "name",
    createdAt: "createdAt",
    workflows: "workflows",
    approvals:"approvals",
    status: "status",
    applications: "applications",
    level: "level",
    forms: "forms"
  };

  let updateParams = {};

  for (const param in fields) {

    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}
