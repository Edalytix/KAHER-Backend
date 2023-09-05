const fromEntities = require('../../entity');

exports.Delete = ({
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
        let lowLimit = request.queryParams.lowLimit;

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

        const WorkflowFunction = db.methods.Workflow({
          translate,
          logger,
          CreateError,
          lang,
        });

        const workflow = await WorkflowFunction.findById(id);

        if (!workflow.data.workflow) {
          throw new CreateError('Workflow not found', 403);
        }

        const res = await WorkflowFunction.update({
          id,
          params: { version: 'deleted' },
        });

        return {
          msg: translate(lang, 'created_mood'),
          data: { res: { msg: 'Deleted workflow successfully', data: {} } },
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
