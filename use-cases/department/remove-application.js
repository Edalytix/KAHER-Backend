const fromEntities = require("../../entity");


exports.RemoveApplication = ({
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
        const id = request.queryParams.id;


        const acesssRes = await accessManager({
          translate,
          logger,
          CreateError,
          lang,
          role,
          db,
          useCase: 'departments:edit',
        })
        if(!acesssRes)
        {
          throw new CreateError(translate(lang, "forbidden"), 403);
        }

        const DepartmentFunction = db.methods.Department({
            translate,
            logger,
            CreateError,
            lang,
            })


        let res = await DepartmentFunction.removeApplication({id: id, applicationid: request.body.applicationid})
        return {
          msg: translate(lang, "created_mood"),
          data: { res },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        console.log("error is", error)
        logger.error(`Failed to signup: %s`, error);

        throw new Error(error.message);
      }
    },
  });
};
