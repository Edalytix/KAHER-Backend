const fromEntities = require('../../entity');

exports.FindAllNoAuth = ({
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
        const search = request.queryParams.search;
        const statusQuery = request.queryParams.status;

        const acesssRes = await accessManager({
          translate,
          logger,
          CreateError,
          lang,
          role,
          db,
          useCase: 'roles:view',
        });
        if (!acesssRes) {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        // let permission = ac.can(role).createOwn("mood");

        // if (role === "admin" || role === "superadmin") {
        //   permission = ac.can(role).createAny("mood");
        // }

        // if (!permission.granted) {
        //   throw new CreateError(translate(lang, "forbidden"), 403);
        // }

        const InstitutionFunction = db.methods.Institution({
          translate,
          logger,
          CreateError,
          lang,
        });

        const res = await InstitutionFunction.findAll(
          page,
          limit,
          search,
          statusQuery
        );
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
