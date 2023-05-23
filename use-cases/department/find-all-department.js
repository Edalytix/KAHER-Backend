const fromEntities = require("../../entity");


exports.FindAll = ({
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
        const page = parseInt(request.queryParams.page) || 1;
        const limit = parseInt(request.queryParams.limit) || 10;


        const acesssRes = await accessManager({
          translate,
          logger,
          CreateError,
          lang,
          role,
          db,
          useCase: 'departments:view',
        })
        if(!acesssRes)
        {
          throw new CreateError(translate(lang, "forbidden"), 403);
        }

const DepartmentFunction =db.methods.Department({
  translate,
  logger,
  CreateError,
  lang,
})

    const res = await DepartmentFunction.findAll(page,limit)
        return {
          msg: translate(lang, "created_mood"),
          data:  res ,
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
