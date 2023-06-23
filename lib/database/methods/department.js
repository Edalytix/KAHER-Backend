const models = require("../models").models;
const Op = require("../connection").operators;
const Department=models.Department;
const User=models.User;
const Application=models.Application;
const paginate = require("../paginate").paginateArray
const mongoose = require("mongoose");

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
            if(err.message.includes("duplicate key error collection"))
            {
              throw Error('Duplicate key error')
            }
          }
        return {
          msg: `Created department successfully`,
          data: { department: unload(department) },
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

    findAll: async (page, limit, searchQuery='') => {
      try {
        let departments = await Department.find({name: { $regex: searchQuery, $options: 'i' } });
        departments = paginate(departments, page, limit);
       
        return {
          msg: `Find departments result`,
          data:  departments ,
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
        const department = await Department.findById(id);

        department.users.forEach(async element => {
            const updateUser = await User.findByIdAndUpdate({_id: element}, { $set: { "department": {name: null, id: null }}})
        });
        const res = await Department.deleteOne({ _id:id })
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
   
        const update = await Department.findByIdAndUpdate(id, Params.updateParams)
 
        return {
          msg: `Updated department details successfully`,
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
      
        const department = await Department.findById(id);
        return {
          msg: `Find users result`,
          data: { department },
        };
      } catch (error) {
        
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to find user by id: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
      },
      findUsers: async (id, page, limit) => {
        try {
          let department = await Department.findOne({ _id: id })
          .populate('users')
          .exec();
          department = paginate(department.users, page, limit);
          return {
            msg: `Find users result`,
            data:  department.data ? department.data : department ,
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
        const department = await Department.findById(id);

        Params.updateParams.users.forEach(async element => {
          const user = await User.findById(element);

          if(user.department.id !== id)
         {
            const removeUser = await Department.findByIdAndUpdate(user.department.id, {
            $pull: { users: element}
          })
        }

          const updateUser = await User.findByIdAndUpdate({_id: element}, { $set: { "department": {name: department.name, id: department._id }}});
          const update = await Department.findByIdAndUpdate(id, { $set: { "users": Params.updateParams.users}})
        });

        return { 
          msg: `Updated department details successfully`,
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

          const updateUser = await User.findByIdAndUpdate({_id: userid }, { $set: { "department": {name: null, id: null }}})

        const update = await Department.findByIdAndUpdate(id, {
          $pull: { users: new mongoose.Types.ObjectId(userid) }
        })
 
        return {
          msg: `Updated department details successfully`,
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
    addApplications: async ({ id, params }) => {
      try {
        const Params = load(params);
        const update = await Department.findByIdAndUpdate(id, { $set: { "applications": Params.updateParams.applications}})

        Params.updateParams.applications.forEach(async element => {
        const updateApplication = await Application.findByIdAndUpdate({_id: element}, { $set: { "department": id }})
      });
        return { 
          msg: `Updated department details successfully`,
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
    removeApplication: async ({ id, applicationid }) => {
      try {
        const update = await Department.findByIdAndUpdate(id, {
          $pull: { applications: applicationid }
        })

        const updateApplication = await Application.findByIdAndUpdate({_id: applicationid }, { $set: { "department": null}})
        
 
        return {
          msg: `Updated department details successfully`,
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

  const data = {
    name: params.name,
    status: params.status,
    applications: params.applications,
    users: params.users,
    _id: params._id
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
