const fromEntities = require('../../entity');
const models = require('../../lib/database/models').models;
const User = models.User;

exports.FindAllUsersNoAuthorization = ({
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
        const page = parseInt(request.queryParams.page);
        const limit = parseInt(request.queryParams.limit);
        const search = request.queryParams.search;
        const statusQuery = request.queryParams.status;

        const UserFunction = db.methods.User({
          translate,
          logger,
          CreateError,
          lang,
        });
        const res = await UserFunction.findAllForUsers(
          page,
          limit,
          search,
          statusQuery
        );
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
