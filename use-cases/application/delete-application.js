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
        let lowLimit = request.queryParams.lowLimit;

        const ApplicationFunction = db.methods.Application({
          translate,
          logger,
          CreateError,
          lang,
        });

        const application = await ApplicationFunction.findById(id);
        if (
          !application.data.application ||
          (role.type !== 'admin' &&
            userUID !== application.data.application.user._id.toString())
        ) {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        const res = await ApplicationFunction.deleteById(id);
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
