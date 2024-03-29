const fromEntities = require('../../entity');
const mongoose = require('mongoose');
exports.Create = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  uploadFile,
  ac,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;
        const email = request.locals.email;
        const userUID = request.locals.uid;
        const role = request.locals.role;
        let lowLimit = request.queryParams.lowLimit;

        // let permission = ac.can(role).createOwn("mood");

        // if (role === "admin" || role === "superadmin") {
        //   permission = ac.can(role).createAny("mood");
        // }

        // if (!permission.granted) {
        //   throw new CreateError(translate(lang, "forbidden"), 403);
        // }

        let entity = (
          await fromEntities.entities.Response.addResponse({
            CreateError,
            DataValidator,
            logger,
            translate,
            crypto,
            lang,
            params: { ...request.body, userUID },
          }).generate()
        ).data.entity;

        const ResponseFunction = db.methods.Response({
          translate,
          logger,
          CreateError,
          lang,
        });

        const ApplicationFunction = db.methods.Application({
          translate,
          logger,
          CreateError,
          lang,
        });

        const FormFunction = db.methods.Form({
          translate,
          logger,
          CreateError,
          lang,
        });

        const WorkflowFunction = db.methods.Workflow({
          translate,
          logger,
          CreateError,
          lang,
        });

        const form = await FormFunction.findById(entity.fuid);

        if (!form) {
          throw new CreateError('Bad request', 422);
        }

        const workflow = (await WorkflowFunction.findById(entity.wuid)).data
          .workflow;

        if (workflow.uuid === '73f7b925-4cfa-4c8e-b5a1-84df8d672fcd') {
          entity.responses.forEach(async (element) => {
            if (element.quid === '6520f35b396cd1e1f8585696') {
              const application = await ApplicationFunction.findById(
                new mongoose.Types.ObjectId(element.string)
              );

              if (!application.data.application)
                throw new CreateError('Bad request', 422);
            }
          });
        }
        const formQuestions = form.data.form?.questions.map((obj) =>
          obj._id.toString()
        );
        const bodyQuestions = entity.responses.map((obj) => obj.quid);

        const isSubset = (bodyQuestions, formQuestions) =>
          bodyQuestions.every((item) => formQuestions?.includes(item));

        console.log(bodyQuestions, formQuestions);

        if (!isSubset(bodyQuestions, formQuestions)) {
          throw new CreateError('Bad request', 422);
        }

        const res = await ResponseFunction.create(entity);
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
