const fromEntities = require("../../entity");


exports.Update = ({
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
        const id = request.queryParams.id;

                

        const UserFunction = db.methods.User({
          translate,
          logger,
          CreateError,
          lang,
          })
        const user = await UserFunction.findById(id);
        if(!user.data.user){
             throw new CreateError("User not found", 403);
           }


        // let permission = ac.can(role).createOwn("mood");

        // if (role === "admin" || role === "superadmin") {
        //   permission = ac.can(role).createAny("mood");
        // }

        // if (!permission.granted) {
        //   throw new CreateError(translate(lang, "forbidden"), 403);
        // }

        let entity = (
            await fromEntities.entities.User.updateUser({
              CreateError,
              DataValidator,
              logger,
              translate,
              crypto,
              lang,
              params: { ...request.body, userUID },
            }).generate()
          ).data.entity;
     
          if(entity.password)
          {
            const hashedPassword = (await crypto.PasswordHash({
            CreateError, translate, logger,
            password: entity.password
        }).hashPassword()).data.hashedPassword;
        entity.password = hashedPassword;
      }
   
            if(entity.department){
            const DepartmentFunction = db.methods.Department({
              translate,
              logger,
              CreateError,
              lang,
            })
            const department = await DepartmentFunction.findById(entity.department.id);
            entity.department.name = department.data.department.name;
          }
        const res = await UserFunction.update({id: id, params: entity});
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
