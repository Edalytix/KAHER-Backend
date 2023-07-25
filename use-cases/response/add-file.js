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

        if (!id) {
          throw new CreateError(translate(lang, 'invalid_input'), 403);
        }

        // let permission = ac.can(role).createOwn("mood");

        // if (role === "admin" || role === "superadmin") {
        //   permission = ac.can(role).createAny("mood");
        // }

        // if (!permission.granted) {
        //   throw new CreateError(translate(lang, "forbidden"), 403);
        // }

        const ResponseFunction = db.methods.Response({
          translate,
          logger,
          CreateError,
          lang,
        });

        if (request.body?.files?.file) {
          for (
            let index = 0;
            index < request.body?.files?.file.length;
            index++
          ) {
            const element = request.body?.files?.file[index];
            const obj = await uploadFile({
              file: element,
            });
            const qid = element.originalname.substring(0, 24);
            const res = await ResponseFunction.addFile({
              id,
              qid,
              url: obj.url,
            });
          }
        }

        return {
          msg: translate(lang, 'created_mood'),
          data: { msg: 'Successfully uploaded' },
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
