const models = require("../models").models;
const Op = require("../connection").operators;
const Application = models.Application;
const paginate = require("../paginate").paginateArray

exports.Application = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        
        const constructedParams = load(params);

        const application = new Application(constructedParams.updateParams);
        
          try {
            await application.save();
            console.log('Application created successfully!');
          } catch (err) {
            if(err.message.includes("duplicate key error collection"))
            {
              throw Error('Duplicate key error')
            }
          }
        return {
          msg: `Created application successfully`,
          data: { application: unload(application) },
        };
      } catch (error) {

        if (error.message.includes("Duplicate key error")) {
          throw new CreateError(translate(lang, "duplicate_application"), 409);
        }
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to create application details: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },

    findAll: async (page, limit) => {
      try {
        let applications = await Application.find();
        applications = paginate(applications, page, limit);
        return {
          msg: `Find applications result`,
          data:  applications ,
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
        const res = await Application.deleteOne({ email })
        if(res.deletedCount!==1) {throw Error('Application not deleted.');}
        return {
          msg: `delete application`,
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
   
        const update = await Application.findByIdAndUpdate(id, Params.updateParams)
 
        return {
          msg: `Updated application details successfully`,
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
        const application = await Application.findById(id);
        return {
          msg: `Find applications result`,
          data: { application },
        };
      } catch (error) {
        
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to find application by id: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
      },
      findUsers: async (id) => {
        try {
          const application = await Application.findOne({ _id: id })
          .populate('users')
          .exec()

          return {
            msg: `Find applications result`,
            data: { application },
          };
        } catch (error) {
          
          if (error instanceof CreateError) {
            throw error;
          }
          logger.error("Failed to find application by id: %s %s", error.message, error);
          throw Error(translate(lang, "unknown_error_contact_support"));
        }
        },
    addUsers: async ({ id, params }) => {
      try {
        const Params = load(params);
        const update = await Application.findByIdAndUpdate(id, { $set: { "users": Params.updateParams.users}})
        return { 
          msg: `Updated application details successfully`,
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
    removeUser: async ({ id, userid }) => {
      try {
        const update = await Application.findByIdAndUpdate(id, {
          $pull: { users: userid }
        })
        
 
        return {
          msg: `Updated application details successfully`,
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
        const res = await Application.deleteOne({ _id: id })
        if(res.deletedCount!==1) {throw Error('Application not deleted.');}

        return {
          msg: `delete application`,
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
  title: params.title,
  user: params.user,
  status: params.status,
  level: params.level,
  department: params.department,
  workflow: params.workflow,
  comments: params.comments,
  activities: params.activities,
  _id: params._id,
  createdAt: params.createdAt,
  };

  return data;
}

function load(fields) {
  // param map

  const paramsMap = {
    title: "title",
    user: "user",
    status: "status",
    level: "level",
    department:"department",
    workflow: "workflow",
    comments: "comments",
    activities: "activities",
    createdAt: "createdAt"
  };

  let updateParams = {};

  for (const param in fields) {

    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}