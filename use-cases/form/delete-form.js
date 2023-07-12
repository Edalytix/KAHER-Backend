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
          useCase: 'forms:edit',
        });
        // if (!acesssRes) {
        //   throw new CreateError(translate(lang, 'forbidden'), 403);
        // }

        const FormFunction = db.methods.Form({
          translate,
          logger,
          CreateError,
          lang,
        });

        const form = await FormFunction.findById(id);

        if (!form.data.form) {
          throw new CreateError('Form not found', 403);
        }

        const workflows = await FormFunction.findAllWorkflows(
          form.data.form.workflows
        );

        if (workflows.data.length > 0) {
          throw new CreateError(
            translate(lang, 'active_workflows_present'),
            403
          );
        }

        const res = await FormFunction.deleteById(id);
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
