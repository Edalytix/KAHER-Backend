const models = require("../models").models;
const Op = require("../connection").operators;
const Department=models.Department;
exports.Department = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        
        const constructedParams = load(params);

        const department = new Department(constructedParams.updateParams);
        
          try {
            await department.save();
            console.log('Department created successfully!');
          } catch (err) {
            console.error(err);
          }
        return {
          msg: `Created department successfully`,
          data: { department: unload(department) },
        };
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          console.log(error);
          throw new CreateError(translate(lang, "duplicate_mood"), 409);
        }
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to create Mood details: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },

    findAll: async () => {
      try {
        const departments = await Department.find();
        console.log(departments);
        return {
          msg: `Find departments result`,
          data: { departments },
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
        const res = await Department.deleteOne({ email })
        console.log(res)
        if(res.deletedCount!==1) {throw Error('Department not deleted.');}
        return {
          msg: `delete department`,
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
        console.log(id, Params.updateParams)
        const update = await Department.findByIdAndUpdate(id, Params.updateParams)

        return {
          msg: `Updated department details successfully`,
          data: { department: unload(update) },
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

  const data = {
    name: params.name,
    status: params.status,
    applications: params.applications,
    users: params.users,
    
  };

  return data;
}

function load(fields) {
  // param map

  const paramsMap = {
    name: "name",
    status: "status",
    applications: "applications",
    users: "users",
  };

  let updateParams = {};

  for (const param in fields) {

    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}
