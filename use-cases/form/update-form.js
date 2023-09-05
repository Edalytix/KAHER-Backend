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

        const form = await FormFunction.findById(id);

        if (entity.status === 'inactive') {
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

        const res = await FormFunction.update({
          id,
          params: { version: 'older', status: 'inactive' },
        });
        const newForm = {
          ...form.data.form._doc,
        };

        newForm.version = 'latest';
        delete newForm._id;

        for (let key in entity) {
          newForm[key] = entity[key];
        }

        const newWorkflowsForForm = [];
        newForm.workflows = [];
        const newResponse = await FormFunction.create(newForm);

        const WorkflowFunction = db.methods.Workflow({
          translate,
          logger,
          CreateError,
          lang,
        });

        for (let index = 0; index < form.data.form.workflows.length; index++) {
          const element = form.data.form.workflows[index];

          const newWorklow = {
            ...element._doc,
          };

          delete newWorklow._id;
          newWorklow.applications = [];

          for (let key in entity) {
            newWorklow[key] = entity[key];
          }

          let idx = newWorklow.forms.findIndex(
            (obj) => JSON.stringify(obj.form) === JSON.stringify(id)
          );
          if (idx === -1)
            throw new CreateError(translate(lang, 'forbidden'), 403);
          newWorklow.forms[idx].form = newResponse.data.form._id;

          const newRes = await WorkflowFunction.create(newWorklow);

          newWorkflowsForForm.push(newRes.data._id);

          const res = await WorkflowFunction.update({
            id: element._id,
            params: { version: 'older' },
          });
        }

        const updatedForm = await FormFunction.update({
          id: newResponse.data.form._id,
          params: { workflows: newWorkflowsForForm },
        });

        return {
          msg: translate(lang, 'created_mood'),
          data: updatedForm,
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
