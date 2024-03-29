const fromEntities = require('../../entity');

exports.AddComment = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  uploadFile,
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

        const CommentFunction = db.methods.Comment({
          translate,
          logger,
          CreateError,
          lang,
        });

        const comment = (await CommentFunction.findById(id)).data.comment;

        if (comment === null) {
          throw new CreateError('No comment found.', 403);
        }

        const permittedUsers = comment?.tags.map((item) => item.uid.toString());
        // if (!permittedUsers.includes(userUID)) {
        //   throw new CreateError(translate(lang, 'forbidden'), 403);
        // }
        let picture = {};
        if (request.body?.files?.picture) {
          picture = await uploadFile({
            file: request.body?.files?.picture[0],
          });
        }

        let entity = (
          await fromEntities.entities.Application.AddComment({
            CreateError,
            DataValidator,
            logger,
            translate,
            crypto,
            lang,
            params: { ...request.body, userUID, picture },
          }).generate()
        ).data.entity;

        const res = await CommentFunction.addComment({
          id: id,
          params: entity,
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
