const fromEntities = require("../../entity");
const { ObjectId } = require('mongodb');

exports.AddForm = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  accessManager
}) => {
  return Object.freeze({
    execute: async () => {
      try {
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
          useCase: 'workflows:edit',
        })
        if(!acesssRes)
        {
          throw new CreateError(translate(lang, "forbidden"), 403);
        }

        const WorkflowFunction = db.methods.Workflow({
            translate,
            logger,
            CreateError,
            lang,
            })

            const FormFunction = db.methods.Form({
                translate,
                logger,
                CreateError,
                lang,
                })

            let entity = (
                await fromEntities.entities.Workflow.AddForm({
                  CreateError,
                  DataValidator,
                  logger,
                  translate,
                  crypto,
                  lang,
                  params: { ...request.body, userUID },
                }).generate()
              ).data.entity;

        const uniqueArray = entity.forms.filter((obj, index, self) => self.findIndex(o => o.form === obj.form) === index);

        let res = await WorkflowFunction.findById(id);
        for(let i =0;i<uniqueArray.length;i++)
       {
        let element=uniqueArray[i];
            let form = await FormFunction.findById(element.form)
            const fieldArray = res.data.workflow?.forms.map(obj => obj?.form?._id);
            const checkAnyIdMatchesValue = (ids, value) => ids.some(id => new ObjectId(id).equals(new ObjectId(value)));

            if(form.data.form===null)
            {
                throw new CreateError(translate(lang, "invalid_uid"), 422);
            }
          }

         res = await WorkflowFunction.addForms({id: id, params: {forms: uniqueArray}})
        return {
          msg: translate(lang, "created_mood"),
          data: { res },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        console.log("error is", error)
        logger.error(`Failed to signup: %s`, error);

        throw new Error(error.message);
      }
    },
  });
};
