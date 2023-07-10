const fromEntities = require('../../entity');
const { ObjectId } = require('mongodb');

exports.ApprovalUpdate = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  accessManager,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;
        const email = request.locals.email;
        const userUID = request.locals.uid;
        const role = request.locals.role;
        let id = request.queryParams.id;

        const acesssRes = await accessManager({
          translate,
          logger,
          CreateError,
          lang,
          role,
          db,
          useCase: 'applications:edit',
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

        const res = await ApplicationFunction.findById(id);
        const application = res.data.application;

        let currentApprover = 0;
        const Workflow = (
          await WorkflowFunction.findById(res.data.application.workflow._id)
        ).data.workflow;

        for (const element of Workflow.approvals) {
          if (element.approvalBy.user) {
            if (element.approvalBy.user._id.toString() == userUID.toString()) {
              currentApprover = element.sequence;
              break;
            }
          } else {
            const user = await UserFunction.findByParams({
              _id: new ObjectId(userUID),
              role: element.approvalBy.role._id,
              'department.id': element.approvalBy.department._id.toString(),
            });

            if (user.data.length !== 0) {
              currentApprover = element.sequence;
              break;
            }
          }
        }

        if (currentApprover !== application.currentApprover) {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        const actionBody = {
          name: null,
          uid: userUID,
          content: null,
          type: null,
          referlink: [],
        };

        if (request.body.approval === 'approved') {
          if (application.currentApprover === Workflow.totalApprovers) {
            const res = await ApplicationFunction.update({
              id,
              params: {
                level: 'approved',
              },
            });
          } else {
            const res = await ApplicationFunction.update({
              id: application._id,
              params: {
                currentApprover: application.currentApprover + 1,
                level: 'waiting',
              },
            });
          }
        } else if (request.body.approval === 'rejected') {
          const res = await ApplicationFunction.update({
            id,
            params: {
              level: 'rejected',
            },
          });
        } else if (request.body.approval === 'on-hold') {
          const res = await ApplicationFunction.update({
            id,
            params: {
              level: 'on-hold',
            },
          });
        } else {
          throw new CreateError('Invalid operation', 403);
        }

        return {
          msg: translate(lang, 'created_mood'),
          data: { res },
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
