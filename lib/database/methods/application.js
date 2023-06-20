const models = require("../models").models;
const Op = require("../connection").operators;
const Application = models.Application;
const Workflow = models.Workflow;
const Form = models.Form;
const Comment = models.Comment;
const User = models.User;
const Response = models.Response;
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

    findAll: async (page, limit, searchQuery) => {
      try {
        let regex = new RegExp(searchQuery, "i");
        console.log(regex)
        let  applications = await Application.find()
          .populate('user')
          .populate('department')
          .populate({
            path: 'workflow',
            match: { name: { $regex: searchQuery, $options: 'i' } },
            populate: {
              path: 'forms.form',
              model: 'Form'
            }
          })
          .exec();

console.log(applications);

        console.log("first", applications)
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
      findAllOfUsers: async (page, limit, uid) => {
        try {
          let applications = await Application.find({user: uid})
                  .populate('user')
          .populate('department')
          .populate('workflow')
          .exec();
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
    submit: async ({ id, params }) => {
      try {
        const Params = load(params);
   
        const update = await Application.findByIdAndUpdate(id, Params.updateParams,{ new: true })
        const creator = await User.findOne({_id: update.user})

        const workflow = await Workflow.findOne({_id: update.workflow})
        const tags = [{
          name: creator.firstName,
                uid: creator._id
        }]
        for (const element of workflow.approvals) {
          if(element.approvalBy.user)
          {
              const user = await User.findOne({_id: element.approvalBy.user})

              tags.push({
                name: user.firstName,
                uid: user._id
              })
          }
          else{
            const user = await User.findOne({'department.id': element.approvalBy.department,
              role: element.approvalBy.role})
              tags.push({
                name: user.firstName,
                uid: user._id
              })
          }          
        };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const document = await Comment.findOneAndUpdate({applicationId: id}, {applicationId: id, tags: tags}, options);
        
 
        return {
          msg: `Updated application details successfully`,
          data: { update },
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
        const application = await Application.findById(id)
        .populate({ path: 'user', select: '-password' })
        .populate('department')
        .populate('workflow')
        .populate({
          path: 'workflow',
          populate: {
            path: 'forms.form',
            model: 'Form'
          }
        })
        .exec();

        let arr=[]
        
        for (const element of application.workflow.forms) {
          const response = await Response.findOne({
            auid: application?._id,
            wuid: application?.workflow?._id,
            fuid: element?.form?._id,
          });
        
          arr.push({
            form: element.form,
            response: response,
          });
        }
        return {
          msg: `Find applications result`,
          data: {
            application: {
              ...application._doc,
              workflow: {
                ...application.workflow._doc,
                forms: arr,
              },
            },
          },
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
        findAllAssignedApps: async (id) => {
          try {

            const user = await User.findOne({ _id: id })
            const userId = user._id; // Replace with the user ID to match
            console.log(user)
            const departmentIds = [user.department.id ]// Replace with the department ID to match
            const roleId = user.role; // Replace with the role ID to match

            const applications = await Application.aggregate([
              {
                $lookup: {
                  from: 'workflows',
                  localField: 'workflow',
                  foreignField: '_id',
                  as: 'workflow'
                }
              },
              {
                $match: {
                  $or: [
                    { 'workflow.approvals.approvalBy.user': userId },
                    {
                      $and: [
                        { 'workflow.approvals.approvalBy.department': { $in: departmentIds } },
                        { 'workflow.approvals.approvalBy.role': roleId }
                      ]
                    }
                  ]
                }
              }
            ]);
            
            const populatedApplications = await Application.populate(applications, [
              { path: 'user' },
              { path: 'department' },
              { path: 'workflow.forms.form', model: 'Form' }
            ]);

            return {
              msg: `Find applications result`,
              data: { populatedApplications },
            };
          } catch (error) {
            
            if (error instanceof CreateError) {
              throw error;
            }
            logger.error("Failed to find application by id: %s %s", error.message, error);
            throw Error(translate(lang, "unknown_error_contact_support"));
          }
          },
          updateApproval: async ({ id, params }) => {
            try {
              const Params = load(params); 
              if(Params.updateParams.status === 'approved')
              {
                const updateWorkflow = await Workflow.findByIdAndUpdate(id, {

                }) 
              }
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
  currentApprover: params.currentApprover,
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
    currentApprover: "currentApprover",
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
