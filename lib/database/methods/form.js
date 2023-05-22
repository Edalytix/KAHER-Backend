const models = require("../models").models;
const Op = require("../connection").operators;
const Form=models.Form;
const paginate = require("../paginate").paginateArray

exports.Form = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        
        const constructedParams = load(params);

        const form = new Form(constructedParams.updateParams);
        
          try {
            await form.save();
            console.log('Form created successfully!');
          } catch (err) {
            if(err.message.includes("duplicate key error collection"))
            {
              throw Error('Duplicate key error')
            }
          }
        return {
          msg: `Created form successfully`,
          data: { form: unload(form) },
        };
      } catch (error) {
        console.log("first", error)
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
        let departments = await Form.find();
        departments = paginate(departments, page, limit);
        return {
          msg: `Find departments result`,
          data:  departments.results ,
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
        const res = await Form.deleteOne({ email })
        if(res.deletedCount!==1) {throw Error('Form not deleted.');}
        return {
          msg: `delete form`,
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
   
        const update = await Form.findByIdAndUpdate(id, Params.updateParams)
 
        return {
          msg: `Updated form details successfully`,
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
        console.log(id)
        const form = await Form.findById(id);
        console.log("form is", form)
        return {
          msg: `Find users result`,
          data: { form },
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
          const form = await Form.findOne({ _id: id })
          .populate('users')
          .exec()
          console.log(form)
          return {
            msg: `Find users result`,
            data: { form },
          };
        } catch (error) {
          
          if (error instanceof CreateError) {
            throw error;
          }
          logger.error("Failed to find user by id: %s %s", error.message, error);
          throw Error(translate(lang, "unknown_error_contact_support"));
        }
        },
    addUsers: async ({ id, params }) => {
      try {
        const Params = load(params);
        const update = await Form.findByIdAndUpdate(id, { $set: { "users": Params.updateParams.users}})
        return { 
          msg: `Updated form details successfully`,
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
        const update = await Form.findByIdAndUpdate(id, {
          $pull: { users: userid }
        })
        
 
        return {
          msg: `Updated form details successfully`,
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
  });
};

function unload(params) {
console.log(params)
  const data = {
    title: params.title,
  createdAt: params.createdAt,
  workflows: params.workflows,
  questions:params.questions,
  status: params.status,
    _id: params._id
  };

  return data;
}

function load(fields) {
  // param map

  const paramsMap = {
    title: "title",
  createdAt: "createdAt",
  workflows: "workflows",
  questions:"questions",
  status: "status",
  };

  let updateParams = {};

  for (const param in fields) {

    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}
