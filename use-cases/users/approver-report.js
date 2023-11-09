const fromEntities = require('../../entity');
const { ObjectId } = require('mongodb');

exports.findApproverReports = ({
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

        const acesssRes = await accessManager({
          translate,
          logger,
          CreateError,
          lang,
          role,
          db,
          useCase: 'forms:view',
        });

        const ApplicationFunction = db.methods.Application({
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

        const user = await UserFunction.findById(userUID);

        const res = await UserFunction.approverReport(
          user.data.user.applications
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
