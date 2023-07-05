const fromEntities = require('../../entity');

exports.ApplicationDetails = ({
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
        const id = request.queryParams.id;

        const acesssRes = await accessManager({
          translate,
          logger,
          CreateError,
          lang,
          role,
          db,
          useCase: 'forms:view',
        });
        if (!acesssRes) {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        const ApplicationFunction = db.methods.Application({
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

        const UserFunction = db.methods.User({
          translate,
          logger,
          CreateError,
          lang,
        });

        const res = await ApplicationFunction.findById(id);

        let currentApprover = 0;
        const Workflow = (
          await WorkflowFunction.findById(res.data.application.workflow._id)
        ).data.workflow;

        for (const element of Workflow.approvals) {
          if (element.approvalBy.user) {
            if (element.approvalBy.user._id.toString() == userUID.toString()) {
              currentApprover = element.sequence;
            }
          } else {
            const user = await UserFunction.findByParams({
              _id: new ObjectId(userUID),
              role: element.approvalBy.role._id,
              'department.id': element.approvalBy.department._id.toString(),
            });

            if (user.data.length !== 0) {
              currentApprover = element.sequence;
            }
          }
        }
        if (currentApprover < res.data.application.workflow.currentApprover) {
          res.status = 'approved';
        } else {
          res.status = res.data.application.level;
        }
        res.status;
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
