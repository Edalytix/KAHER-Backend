const fromEntities = require("../../entity");


exports.FindAssignedApps = ({
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
        console.log("first")
        const lang = request.locals.lang;
        const email = request.locals.email;
        const userUID = request.locals.uid;
        const role = request.locals.role;
        const page = parseInt(request.queryParams.page) ;
        const limit = parseInt(request.queryParams.limit);
        const id = request.queryParams.id ;


        const acesssRes = await accessManager({
          translate,
          logger,
          CreateError,
          lang,
          role,
          db,
          useCase: 'workflows:view',
        })
        if(!acesssRes)
        {
          throw new CreateError(translate(lang, "forbidden"), 403);
        }

      const ApplicationFunction = db.methods.Application({
        translate,
        logger,
        CreateError,
        lang,
      })


    const res = await ApplicationFunction.findAllAssignedApps(id)
        return {
          msg: translate(lang, "created_mood"),
          data:  {res} ,
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
