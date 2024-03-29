const fromEntities = require('../../entity');

exports.FindAssignedApps = ({
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
        const page = parseInt(request.queryParams.page);
        const limit = parseInt(request.queryParams.limit);
        const id = request.queryParams.id;
        const search = request.queryParams.search;
        const statusQuery = request.queryParams.status;

        // const acesssRes = await accessManager({
        //   translate,
        //   logger,
        //   CreateError,
        //   lang,
        //   role,
        //   db,
        //   useCase: 'workflows:view',
        // })
        // if(!acesssRes)
        // {
        //   throw new CreateError(translate(lang, "forbidden"), 403);
        // }
        //

        const UserFunction = db.methods.User({
          translate,
          logger,
          CreateError,
          lang,
        });

        const user = await UserFunction.findById(userUID);

        const ApplicationFunction = db.methods.Application({
          translate,
          logger,
          CreateError,
          lang,
        });
        let res = {};
        if (user.data.user.department.name === 'Principal Department') {
          res = await ApplicationFunction.findAllAssignedAppsForInstitution(
            userUID,
            search,
            statusQuery,
            user.data.user.institution._id
          );
        } else if (user.data.user.department.name === 'Registrar') {
          res = await ApplicationFunction.findAllAssignedAppsForRegistrar(
            userUID,
            search,
            statusQuery,
            user.data.user.institution._id
          );
        } else {
          res = await ApplicationFunction.findAllAssignedApps(
            userUID,
            search,
            statusQuery
          );
        }

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
