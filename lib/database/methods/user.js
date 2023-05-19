const models = require("../models").models;
const Op = require("../connection").operators;
const paginate = require("../paginate").paginateArray
const User=models.User;
exports.User = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        
        const constructedParams = load(params);
        const user = new User(constructedParams.updateParams);
          try {
            await user.save();
            console.log("user is",user)
            console.log('User created successfully!');
          } catch (err) {
            console.log(err)
            if(err.message.includes("duplicate key error collection"))
            {
              throw Error('Duplicate key error')
            }
          }
        return {
          msg: `Created user successfully`,
          data: { user: unload(user) },
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
        const projection = { password: 0 };
        let users = await User.find({},projection);
        users = paginate(users, page, limit);
                return {
          msg: `Find users result`,
          data:  users.results ,
        };
      } catch (error) {
        
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to find users: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
      },
      findByEmail: async ({email}) => {
        try {

          const user = await User.findOne({email});

          return {
            msg: `Find users result`,
            data: { user },
          };
        } catch (error) {
          
          if (error instanceof CreateError) {
            throw error;
          }
          logger.error("Failed to find user by email: %s %s", error.message, error);
          throw Error(translate(lang, "unknown_error_contact_support"));
        }
        },
        findById: async (id) => {
          try {
            const user = await User.findById(id);

            return {
              msg: `Find users result`,
              data: { user },
            };
          } catch (error) {
            
            if (error instanceof CreateError) {
              throw error;
            }
            logger.error("Failed to find user by id: %s %s", error.message, error);
            throw Error(translate(lang, "unknown_error_contact_support"));
          }
          },
    deleteById: async (id) => {
      try {
        const res = await User.deleteOne({ _id: id })

        if(res.deletedCount!==1) {
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
          "Failed to delete user by id: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
   
    },
    update: async ({ id, params }) => {
      try {

        const Params = load(params);
        const update = await User.findByIdAndUpdate(id, Params.updateParams)

        return {
          msg: `Updated user details successfully`,
          data: {  },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to update user details: %s %s",
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
    _id: params._id
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
