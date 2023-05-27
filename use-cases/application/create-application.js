const fromEntities = require("../../entity");


exports.Create = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  ac,
  accessManager
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
          useCase: 'applications:edit',
        })
        if(!acesssRes)
        {
          throw new CreateError(translate(lang, "forbidden"), 403);
        }
        let entity = (
          await fromEntities.entities.Application.CreateApplication({
            CreateError,
            DataValidator,
            logger,
            translate,
            crypto,
            lang,
            params: { ...request.body, userUID },
          }).generate()
        ).data.entity;

        const ApplicationFunction = db.methods.Application({
          translate,
          logger,
          CreateError,
          lang,
        })

        const WorkflowFunction = db.methods.Workflow({
            translate,
            logger,
            CreateError,
            lang,
          })

        const workflow = await WorkflowFunction.findById(entity.workflow);

        if(workflow.data.workflow === null)  throw new CreateError(translate(lang, "invalid_uid"), 422);

        const DepartmentFunction = db.methods.Department({
            translate,
            logger,
            CreateError,
            lang,
          }) 

        const department = await DepartmentFunction.findById(entity.department);
        if(department.data.department === null)  throw new CreateError(translate(lang, "invalid_uid"), 422);
  

        const res = await ApplicationFunction.create(entity);

        return {
          msg: translate(lang, "created_mood"),
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
