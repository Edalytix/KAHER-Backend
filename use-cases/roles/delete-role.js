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
        // const acesssRes = await accessManager({
        //   translate,
        //   logger,
        //   CreateError,
        //   lang,
        //   role,
        //   db,
        //   useCase: 'roles:edit',
        // });
        // if (!acesssRes) {
        //   throw new CreateError(translate(lang, 'forbidden'), 403);
        // }

        // let permission = ac.can(role).createOwn("mood");

        // if (role === "admin" || role === "superadmin") {
        //   permission = ac.can(role).createAny("mood");
        // }

        // if (!permission.granted) {
        //   throw new CreateError(translate(lang, "forbidden"), 403);
        // }

        const RoleFunction = db.methods.Role({
          translate,
          logger,
          CreateError,
          lang,
        });

        const UserFunction = db.methods.User({
          translate,
          logger,
          CreateError,
          lang,
        });

        const users = await UserFunction.findByParams({
          role: id,
        });

        if (users.data.length > 0) {
          throw new CreateError(translate(lang, 'forbidden_request'), 403);
        }

        const res = await RoleFunction.deleteById({ id });
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
