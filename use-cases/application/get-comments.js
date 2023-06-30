const fromEntities = require('../../entity');

exports.GetComment = ({
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
        let id = request.queryParams.id;

        // const acesssRes = await accessManager({
        //   translate,
        //   logger,
        //   CreateError,
        //   lang,
        //   role,
        //   db,
        //   useCase: 'applications:edit',
        // })
        // if(!acesssRes)
        // {
        //   throw new CreateError(translate(lang, "forbidden"), 403);
        // }

        const CommentFunction = db.methods.Comment({
          translate,
          logger,
          CreateError,
          lang,
        });
        if (!acesssRes) {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        const comment = (await CommentFunction.findById(id)).data.comment;
        console.log(comment);

        return {
          msg: translate(lang, 'created_mood'),
          data: { comment },
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
