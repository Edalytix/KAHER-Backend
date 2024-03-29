const fromEntities = require('../../entity');

exports.ResubmitRejected = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  ac,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;
        const email = request.locals.email;
        const userUID = request.locals.uid;
        const role = request.locals.role;
        const auid = request.queryParams.auid;
        let lowLimit = request.queryParams.lowLimit;

        // let permission = ac.can(role).createOwn("mood");

        // if (role === "admin" || role === "superadmin") {
        //   permission = ac.can(role).createAny("mood");
        // }

        // if (!permission.granted) {
        //   throw new CreateError(translate(lang, "forbidden"), 403);
        // }

        const ApplicationFunction = db.methods.Application({
          translate,
          logger,
          CreateError,
          lang,
        });

        const StatusFunction = db.methods.Status({
          translate,
          logger,
          CreateError,
          lang,
        });

        const application = await ApplicationFunction.findById(auid);

        if (application.data.application.level !== 'rejected') {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        const app = await ApplicationFunction.update({
          id: auid,
          params: {
            level: 'waiting',
            resubmission: true,
          },
        });

        let status = await StatusFunction.update(
          auid,
          application.data.application.currentApprover,
          'status',
          'waiting'
        );

        const CommentFunction = db.methods.Comment({
          translate,
          logger,
          CreateError,
          lang,
        });

        const comment = (await CommentFunction.findById(auid)).data.comment;

        if (comment === null) {
          throw new CreateError('No comment found.', 403);
        }

        let resubmitMessage = {
          name: 'User',
          uid: userUID,
          content: 'Your application is resubmitted!',
          type: 'resubmit',
          referlink: [],
        };

        const res = await CommentFunction.addComment({
          id: auid,
          params: resubmitMessage,
        });

        return {
          msg: translate(lang, 'success'),
          data: {},
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
