const fromEntities = require('../../entity');

exports.FindAll = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  ac,
  accessManager,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;
        const email = request.locals.email;
        const userUID = request.locals.uid;
        const role = request.locals.role;
        const page = parseInt(request.queryParams.page);
        const search = request.queryParams.search;
        const statusQuery = request.queryParams.status;
        const limit = parseInt(request.queryParams.limit);

        // const acesssRes = await accessManager({
        //   translate,
        //   logger,
        //   CreateError,
        //   lang,
        //   role,
        //   db,
        //   useCase: 'applications:view',
        // });
        // if (!acesssRes) {
        //   throw new CreateError(translate(lang, 'forbidden'), 403);
        // }

        const UserFunction = db.methods.User({
          translate,
          logger,
          CreateError,
          lang,
        });

        const WorkflowFunction = db.methods.Workflow({
          translate,
          logger,
          CreateError,
          lang,
        });
        // update
        const res = await WorkflowFunction.findAllScript();
        for (let index = 0; index < res.data.data.length; index++) {
          const element = res.data.data[index];
          const uuid = element.uuid.toString();
          const isFieldPresent = (array, field) => array.includes(field);
          console.log(element.uuid);
          for (let index = 0; index < element.approvals.length; index++) {
            const ele = element.approvals[index];
            if (ele.approvalBy.user) {
              const user = await UserFunction.findById(
                ele.approvalBy.user.toString()
              );

              if (user.data.user._id) {
                console.log(isFieldPresent(user.data.user.applications, uuid));
                if (!isFieldPresent(user.data.user.applications, uuid)) {
                  const array = user.data.user.applications;
                  array.push(uuid);
                  console.log('user', array);
                  const userData = await UserFunction.update({
                    id: user.data.user._id,
                    params: array,
                  });
                  console.log(userData);
                }

                // isFieldPresent(user.data.user.applications, uuid)
                //   ? console.log(
                //       isFieldPresent(user.data.user.applications, uuid)
                //     )
                //   : null;
              }
            } else {
              console.log(ele.approvalBy);
              const user = await UserFunction.findByParams({
                role: ele.approvalBy.role,
                'department.id': ele.approvalBy.department?.toString(),
              });
              if (user.data.length > 0) {
                for (let index = 0; index < user.data.length; index++) {
                  const userDepRole = user.data[index];
                  console.log(isFieldPresent(userDepRole.applications, uuid));
                  if (!isFieldPresent(userDepRole.applications, uuid)) {
                    const array = userDepRole.applications;
                    array.push(uuid);
                    console.log('user', array);
                    const userData = await UserFunction.update({
                      id: userDepRole._id,
                      params: array,
                    });
                    console.log(userData);
                  }
                }
              }
            }
          }
          //   if (!element.workflowUid) {
          //     // await ApplicationFunction.update({
          //     //   id: element._id,
          //     //   params: { workflowUid: element.workflow.uuid },
          //     // });
          //     console.log(
          //       element.workflowUid,
          //       element._id,
          //       element.workflow.uuid
          //     );
          //   }
        }
        return {
          msg: translate(lang, 'created_mood'),
          data: res,
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(`Failed to signup: %s`, error);

        throw new Error(error.message);
      }
    },
  });
};
