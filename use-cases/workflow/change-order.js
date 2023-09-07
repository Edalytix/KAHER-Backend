const fromEntities = require('../../entity');
const { Workflow } = require('../../lib/database/methods/workflow');

exports.ChangeOrder = ({
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
          useCase: 'workflows:edit',
        });
        if (!acesssRes) {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        let entity = (
          await fromEntities.entities.Workflow.UpdateWorkflow({
            CreateError,
            DataValidator,
            logger,
            translate,
            crypto,
            lang,
            params: { ...request.body, userUID },
          }).generate()
        ).data.entity;

        const WorkflowFunction = db.methods.Workflow({
          translate,
          logger,
          CreateError,
          lang,
        });

        const workflow = await WorkflowFunction.findById(id);
        const initialOrder = workflow.data.workflow.order;
        const finalOrder = entity.order;

        const finalWorkflow = await WorkflowFunction.findByOrder(finalOrder);
        const res = await WorkflowFunction.update({
          id,
          params: { order: finalOrder },
        });

        const finalRes = await WorkflowFunction.update({
          id: finalWorkflow.data.workflow._id,
          params: { order: initialOrder },
        });

        return {
          msg: translate(lang, 'created_mood'),
          data: {},
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
