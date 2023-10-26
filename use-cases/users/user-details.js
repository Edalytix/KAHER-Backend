const fromEntities = require('../../entity');
const minioConfig = require('../../config/minio.config.json');
exports.UserDetails = ({
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
        const Minio = require('minio');

        const minioClient = new Minio.Client({
          endPoint: minioConfig.endPoint,
          port: minioConfig.port,
          useSSL: minioConfig.useSSL,
          accessKey: minioConfig.accessKey,
          secretKey: minioConfig.secretKey,
        });

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
          useCase: 'users:edit',
        });

        if (userUID !== id && !acesssRes) {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        const UserFunction = db.methods.User({
          translate,
          logger,
          CreateError,
          lang,
        });

        const res = await UserFunction.findById(id);

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
