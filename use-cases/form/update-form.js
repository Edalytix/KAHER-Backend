const fromEntities = require('../../entity');

exports.Update = ({
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
          useCase: 'departments:edit',
        });
        if (!acesssRes) {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        const FormFunction = db.methods.Form({
          translate,
          logger,
          CreateError,
          lang,
        });

        let entity = (
          await fromEntities.entities.Form.updateForm({
            CreateError,
            DataValidator,
            logger,
            translate,
            crypto,
            lang,
            params: { ...request.body, userUID },
          }).generate()
        ).data.entity;

        if (entity.status === 'inactive') {
          const form = await FormFunction.findById(id);
          const WorkflowFunction = db.methods.Workflow({
            translate,
            logger,
            CreateError,
            lang,
          });

          const workflows = await FormFunction.findAllWorkflows(
            form.data.form.workflows
          );

          if (workflows.data.length > 0) {
            throw new CreateError(
              translate(lang, 'active_workflows_present'),
              403
            );
          }
        }

        const res = await FormFunction.update({ id, params: entity });
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
