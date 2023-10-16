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

        // const acesssRes = await accessManager({
        //   translate,
        //   logger,
        //   CreateError,
        //   lang,
        //   role,
        //   db,
        //   useCase: 'applications:edit',
        // });
        // if (!acesssRes) {
        //   throw new CreateError(translate(lang, 'forbidden'), 403);
        // }

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
        let approveGrant = false;

        const Workflow = (
          await WorkflowFunction.findById(res.data.application.workflow._id)
        ).data.workflow;
        let approver = {};

        for (const element of Workflow.approvals) {
          approveGrant = element.approveGrant;
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
              approver = user;
              break;
            }
          }
        }
        if (currentApprover !== application.currentApprover) {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        const StatusFunction = db.methods.Status({
          translate,
          logger,
          CreateError,
          lang,
        });

        const status = (await StatusFunction.findById(id)).data.status;

        const actionBody = {
          name: null,
          uid: userUID,
          content: null,
          type: null,
          referlink: [],
        };

        if (request.body.approval === 'approved') {
          if (approveGrant) {
            const res = await ApplicationFunction.update({
              id,
              params: {
                approvedAmount: request.body.approvedAmount,
              },
            });
          }
          if (application.currentApprover === Workflow.totalApprovers) {
            const res = await ApplicationFunction.update({
              id,
              params: {
                level: 'approved',
              },
            });

            let status = await StatusFunction.update(
              id,
              currentApprover,
              'status',
              'approved'
            );

            status = await StatusFunction.update(
              id,
              currentApprover + 1,
              'status',
              'approved'
            );
          } else {
            const res = await ApplicationFunction.update({
              id: application._id,
              params: {
                currentApprover: application.currentApprover + 1,
                level: 'waiting',
              },
            });

            const status = await StatusFunction.update(
              id,
              currentApprover,
              'status',
              'approved'
            );
          }
        } else if (request.body.approval === 'rejected') {
          const res = await ApplicationFunction.update({
            id,
            params: {
              level: 'rejected',
            },
          });

          const status = await StatusFunction.update(
            id,
            currentApprover,
            'status',
            'rejected'
          );
        } else if (request.body.approval === 'on-hold') {
          const res = await ApplicationFunction.update({
            id,
            params: {
              level: 'on-hold',
            },
          });

          const status = await StatusFunction.update(
            id,
            currentApprover,
            'status',
            'on-hold'
          );
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
