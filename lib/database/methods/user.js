const models = require("../models").models;
const Op = require("../connection").operators;
const User=models.User;
exports.User = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        
        const constructedParams = load(params);
        console.log(constructedParams.updateParams)
        const user = new User(constructedParams.updateParams);
        
          try {
            await user.save();
            console.log('User created successfully!');
          } catch (err) {
            console.error(err);
          }
        return {
          msg: `Created user successfully`,
          data: { user: unload(user) },
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
        const projection = { password: 0 };
        const users = await User.find({},projection);
        console.log(users);
        return {
          msg: `Find users result`,
          data: { users },
        };
      } catch (error) {
        
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to find mood by uid: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
      },
      findByEmail: async ({email}) => {
        try {
          console.log(email)
          const user = await User.findOne({email});
          console.log(user);
          return {
            msg: `Find users result`,
            data: { user },
          };
        } catch (error) {
          
          if (error instanceof CreateError) {
            throw error;
          }
          logger.error("Failed to find mood by uid: %s %s", error.message, error);
          throw Error(translate(lang, "unknown_error_contact_support"));
        }
        },
        findById: async (id) => {
          try {
            const user = await User.findById(id);
            console.log(user);
            return {
              msg: `Find users result`,
              data: { user },
            };
          } catch (error) {
            
            if (error instanceof CreateError) {
              throw error;
            }
            logger.error("Failed to find mood by uid: %s %s", error.message, error);
            throw Error(translate(lang, "unknown_error_contact_support"));
          }
          },
    deleteById: async (id) => {
      try {
        const res = await User.deleteOne({ _id: id })
        console.log(res)
        if(res.deletedCount!==1) {throw Error('User not deleted.');}
        return {
          msg: `delete user`,
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
        console.log("sadsadsa",id,params)
        const Params = load(params);
        console.log(id, Params.updateParams)
        const update = await User.findByIdAndUpdate(id, Params.updateParams)

        return {
          msg: `Updated user details successfully`,
          data: { user: unload(update) },
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
console.log("params", params)
  const data = {
    uuid: params.uuid,
    firstName: params.firstName,
    secondName: params.secondName,
    status: params.status,
    statusActivation:params.statusActivation,
    applications: params.applications,
    role: params.role,
    department: params.department,
    email: params.email,
    password: params.password,
  };

  return data;
}

function load(fields) {
  // param map

  const paramsMap = {
    uuid: "uuid",
    firstName: "firstName",
    secondName: "secondName",
    status: "status",
    statusActivation:"statusActivation",
    applications: "applications",
    role: "role",
    department: "department",
    email: "email",
    password: "password"
  };

  let updateParams = {};

  for (const param in fields) {

    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}
