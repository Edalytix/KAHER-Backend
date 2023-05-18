const fromEntities = require("../../entity");


exports.AddUser = ({
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


        // let permission = ac.can(role).createOwn("mood");

        // if (role === "admin" || role === "superadmin") {
        //   permission = ac.can(role).createAny("mood");
        // }

        // if (!permission.granted) {
        //   throw new CreateError(translate(lang, "forbidden"), 403);
        // }

        const DepartmentFunction = db.methods.Department({
            translate,
            logger,
            CreateError,
            lang,
            })

            const UserFunction = db.methods.User({
                translate,
                logger,
                CreateError,
                lang,
                })

            let entity = (
                await fromEntities.entities.Department.updateDepartment({
                  CreateError,
                  DataValidator,
                  logger,
                  translate,
                  crypto,
                  lang,
                  params: { ...request.body, userUID },
                }).generate()
              ).data.entity;

        let res = await DepartmentFunction.findById(id);
        for(let i =0;i<entity.users.length;i++)
       {
        let element=entity.users[i];
            let user = await UserFunction.findById(element)
            if(user.data.user===null || res.data.department.users.includes(user.data.user._id))
            {
                throw new CreateError(translate(lang, "invalid_uid"), 422);
            }
            res.data.department.users.push(element)
          }

         res = await DepartmentFunction.addUsers({id: id, params: res.data.department})
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
