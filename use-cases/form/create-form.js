const fromEntities = require("../../entity");


exports.Create = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  ac,
  accessManager
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;
        const email = request.locals.email;
        const userUID = request.locals.uid;
        const role = request.locals.role;
        let lowLimit = request.queryParams.lowLimit;

        const acesssRes = await accessManager({
          translate,
          logger,
          CreateError,
          lang,
          role,
          db,
          useCase: 'forms:edit',
        })
        if(!acesssRes)
        {
          throw new CreateError(translate(lang, "forbidden"), 403);
        }
        let entity = (
          await fromEntities.entities.Form.addForm({
            CreateError,
            DataValidator,
            logger,
            translate,
            crypto,
            lang,
            params: { ...request.body, userUID },
          }).generate()
        ).data.entity;

const FormFunction =db.methods.Form({
  translate,
  logger,
  CreateError,
  lang,
})

const res = await FormFunction.create(entity)

        return {
          msg: translate(lang, "created_mood"),
          data: { res},
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
