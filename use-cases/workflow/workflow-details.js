const fromEntities = require('../../entity');

exports.WorkflowDetails = ({
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

        const WorkflowFunction = db.methods.Workflow({
          translate,
          logger,
          CreateError,
          lang,
        });

        const res = await WorkflowFunction.findById(id);
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
