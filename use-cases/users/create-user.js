const fromEntities = require("../../entity");
const mongoose = require("mongoose")

exports.Create = ({
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
        console.log("first", userUID)


        const acesssRes = await accessManager({
          translate,
          logger,
          CreateError,
          lang,
          role,
          db,
          useCase: 'users:edit',
        })
        if(!acesssRes)
        {
          throw new CreateError(translate(lang, "forbidden"), 403);
        }

        let entity = (
          await fromEntities.entities.User.addUser({
            CreateError,
            DataValidator,
            logger,
            translate,
            crypto,
            lang,
            params: { ...request.body, userUID },
          }).generate()
        ).data.entity;

        console.log(entity.password)
 
        const hashedPassword = (await crypto.PasswordHash({
          CreateError, translate, logger,
          password: entity.password
      }).hashPassword()).data.hashedPassword;
 
      entity.password = hashedPassword;


const UserFunction = db.methods.User({
  translate,
  logger,
  CreateError,
  lang,
})

const DepartmentFunction = db.methods.Department({
  translate,
  logger,
  CreateError,
  lang,
})
const department = await DepartmentFunction.findById(entity.department.id);
if(!department.data.department){
  throw new CreateError("Department not found", 403);
}
entity.department.name = department.data.department.name;
const res = await UserFunction.create(entity)
        return {
          msg: translate(lang, "created_mood"),
          data: { res},
        };
      } catch (error) {
        console.log("message",error.message)
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(`Failed to signup: %s`, error);
      }
    },
  });
};
