const models = require("../models").models;
const Op = require("../connection").operators;
const Comment = models.Comment;
const Workflow = models.Workflow;
const Form = models.Form;
const Response = models.Response;
const paginate = require("../paginate").paginateArray

exports.Comment = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        const constructedParams = load(params);

        const comment = new Comment(constructedParams.updateParams);
        
          try {
            await comment.save();
            console.log('Comment created successfully!');
          } catch (err) {
            if(err.message.includes("duplicate key error collection"))
            {
              throw Error('Duplicate key error')
            }
          }
        return {
          msg: `Created comment successfully`,
          data: { comment: unload(comment) },
        };
      } catch (error) {

        if (error.message.includes("Duplicate key error")) {
          throw new CreateError(translate(lang, "duplicate_comment"), 409);
        }
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          "Failed to create comment details: %s %s",
          error.message,
          error
        );
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
    },

    findAll: async (page, limit) => {
      try {
        let comments = await Comment.find()
                .populate('user')
        .populate('department')
        .populate('workflow')
        .exec();
        comments = paginate(comments, page, limit);
        return {
          msg: `Find comments result`,
          data:  comments ,
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
        const res = await Comment.deleteOne({ email })
        if(res.deletedCount!==1) {throw Error('Comment not deleted.');}
        return {
          msg: `delete comment`,
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
   
        const update = await Comment.findByIdAndUpdate(id, Params.updateParams)
 
        return {
          msg: `Updated comment details successfully`,
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
        const comment = await Comment.findOne({applicationId: id})

        return {
          msg: `Find comments result`,
          data: {
            comment
          },
        };
      } catch (error) {
        
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error("Failed to find comment by id: %s %s", error.message, error);
        throw Error(translate(lang, "unknown_error_contact_support"));
      }
      },
      findUsers: async (id) => {
        try {
          const comment = await Comment.findOne({ _id: id })
          .populate('users')
          .exec()

          return {
            msg: `Find comments result`,
            data: { comment },
          };
        } catch (error) {
          
          if (error instanceof CreateError) {
            throw error;
          }
          logger.error("Failed to find comment by id: %s %s", error.message, error);
          throw Error(translate(lang, "unknown_error_contact_support"));
        }
        },
        findAllAssignedApps: async (id) => {
          try {

            const user = await User.findOne({ _id: id })
            const userId = user._id; // Replace with the user ID to match
            const departmentIds = user.department.map((obj)=> obj.id); // Replace with the department ID to match
            const roleId = user.role; // Replace with the role ID to match

            const comments = await Comment.find({
              workflow: {
                $elemMatch: {
                  approvals: {
                    $elemMatch: {
                      approvalBy: {
                        $or: [
                          { 'approvalBy.user': userId },
                          { 'approvalBy.department': { $in: departmentIds }, 'approvalBy.role': roleId },
                        ],
                      },
                    },
                  },
                },
              },
            }).populate('user').populate('department').populate('workflow').populate({
              path: 'workflow',
              populate: {
                path: 'forms.form',
                model: 'Form',
              },
            }).exec();
  
            return {
              msg: `Find comments result`,
              data: { comment },
            };
          } catch (error) {
            
            if (error instanceof CreateError) {
              throw error;
            }
            logger.error("Failed to find comment by id: %s %s", error.message, error);
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
              const update = await Comment.findByIdAndUpdate(id, { $set: { "users": Params.updateParams.users}})
              return { 
                msg: `Updated comment details successfully`,
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
          addComment: async ({id, params}) => {
            try {

              const comment = await Comment.updateOne({ applicationId: id },{ $push: { comments:params}} )
      
      
              return {
                msg: `Find applications result`,
                data: { comment },
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
        const update = await Comment.findByIdAndUpdate(id, { $set: { "users": Params.updateParams.users}})
        return { 
          msg: `Updated comment details successfully`,
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
        const update = await Comment.findByIdAndUpdate(id, {
          $pull: { users: userid }
        })
        
 
        return {
          msg: `Updated comment details successfully`,
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
        const res = await Comment.deleteOne({ _id: id })
        if(res.deletedCount!==1) {throw Error('Comment not deleted.');}

        return {
          msg: `delete comment`,
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
applicationId: params.applicationId,
comments: params.comments,
tags: params.tags,
  _id: params._id,
  };

  return data;
}

function load(fields) {
  // param map

  const paramsMap = {
    applicationId: "applicationId",
    comments: "comments",
    tags: "tags",
  };

  let updateParams = {};

  for (const param in fields) {

    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}
