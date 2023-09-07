const fromEntities = require('../../entity');

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
        const initialOrder = form.data.form.order;
        const finalOrder = entity.order;

        const finalForm = await FormFunction.findByOrder(finalOrder);

        const updatedForm = await FormFunction.update({
          id: form.data.form._id,
          params: { order: finalOrder },
        });

        const updatedFinalForm = await FormFunction.update({
          id: finalForm.data.form._id,
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
