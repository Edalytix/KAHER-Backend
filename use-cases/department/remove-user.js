const fromEntities = require("../../entity");


exports.RemoveUser = ({
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


        let res = await DepartmentFunction.removeUser({id: id, userid: request.body.userid})
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
