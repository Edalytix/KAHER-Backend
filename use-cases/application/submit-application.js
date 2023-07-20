const fromEntities = require('../../entity');
const { ObjectId } = require('mongodb');

exports.Submit = ({
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

        const ApplicationFunction = db.methods.Application({
          translate,
          logger,
          CreateError,
          lang,
        });

        const application = (await ApplicationFunction.findById(id)).data
          .application;

        if (!application || userUID !== application.user._id.toString()) {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        const date = new Date();
        const options = {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        };
        const formattedDate = date.toLocaleString('en-US', options);

        let entity = (
          await fromEntities.entities.Application.UpdateApplication({
            CreateError,
            DataValidator,
            logger,
            translate,
            crypto,
            lang,
            params: { ...request.body, userUID },
          }).generate()
        ).data.entity;

        const CommentFunction = db.methods.Comment({
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

        const workflow = (
          await WorkflowFunction.findById(application.workflow._id)
        ).data.workflow;

        if (workflow.version !== 'latest') {
          throw new CreateError(translate(lang, 'older_version'), 403);
        }
        const resAction = await CommentFunction.addComment({
          id: id,
          params: {
            name: request.body.name,
            uid: request.body.uid,
            content: `${request.body.name} submitted the Application on ${formattedDate}.`,
            type: 'submission',
            referlink: [],
          },
        });

        const stages = [
          {
            name: `${userUID} Submitted the Application`,
            status: 'submitted',
            updatedAt: formattedDate,
          },
        ];

        for (let index = 0; index < workflow.approvals.length; index++) {
          stages.push({
            name: `${workflow.approvals[index].name} Approval`,
            status: 'waiting',
            updatedAt: formattedDate,
          });
        }

        stages.push({
          name: `Application Approved`,
          status: 'waiting',
          updatedAt: formattedDate,
        });

        const StatusFunction = db.methods.Status({
          translate,
          logger,
          CreateError,
          lang,
        });

        const status = await StatusFunction.create({
          applicationId: new ObjectId(id),
          stages: stages,
        });

        const res = await ApplicationFunction.submit({
          id,
          params: {
            status: 'active',
            level: 'waiting',
            stages: status.data.status._id,
          },
        });

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
