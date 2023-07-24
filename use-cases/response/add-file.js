const fromEntities = require('../../entity');

exports.AddFile = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  ac,
  uploadFile,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;
        const email = request.locals.email;
        const userUID = request.locals.uid;
        const role = request.locals.role;
        let id = request.queryParams.id;
        let qid = request.queryParams.qid;

        // let permission = ac.can(role).createOwn("mood");

        // if (role === "admin" || role === "superadmin") {
        //   permission = ac.can(role).createAny("mood");
        // }

        // if (!permission.granted) {
        //   throw new CreateError(translate(lang, "forbidden"), 403);
        // }

        let file = '';
        if (request.body?.files?.file) {
          const obj = await uploadFile({
            file: request.body?.files?.file[0],
          });
          file = obj.url;
        }

        const ResponseFunction = db.methods.Response({
          translate,
          logger,
          CreateError,
          lang,
        });

        const res = await ResponseFunction.addFile({
          id,
          qid,
          url: file,
        });
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
