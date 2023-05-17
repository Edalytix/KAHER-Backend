const models = require("../models").models;
const Op = require("../connection").operators;
const Role=models.Role;
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
            console.error(err);
          }
        return {
          msg: `Created role successfully`,
          data: { role: unload(role) },
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
        const roles = await Role.find();
        console.log(roles);
        return {
          msg: `Find roles result`,
          data: { roles },
        };
      } catch (error) {
        
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to find mood by uid: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
      },
  
    deleteById: async ({ id }) => {
      try {
        const res = await Role.deleteOne({ _id: id })
        console.log(res)
        if(res.deletedCount!==1) {throw Error('Role not deleted.');}
        return {
          msg: `delete role`,
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
        const update = await Role.findByIdAndUpdate(id, Params.updateParams)

        return {
          msg: `Updated role details successfully`,
          data: { role: unload(update) },
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
    permissions: params.permissions,
    code: params.code,
    
  };

  return data;
}

function load(fields) {
  // param map

  const paramsMap = {
    name: "name",
    status: "status",
    permissions: "permissions",
    code: "code",
  };

  let updateParams = {};

  for (const param in fields) {

    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}
