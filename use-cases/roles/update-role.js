
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
        let id = request.queryParams.id;


        // let permission = ac.can(role).createOwn("mood");

        // if (role === "admin" || role === "superadmin") {
        //   permission = ac.can(role).createAny("mood");
        // }

        // if (!permission.granted) {
        //   throw new CreateError(translate(lang, "forbidden"), 403);
        // }

        let entity = (
          await fromEntities.entities.Role.updateRole({
            CreateError,
            DataValidator,
            logger,
            translate,
            crypto,
            lang,
            params: { ...request.body, userUID },
          }).generate()
        ).data.entity;

const RoleFunction =db.methods.Role({
  translate,
  logger,
  CreateError,
  lang,
})
const findrole = await RoleFunction.findById(id);
const permissions = ["workflows",
"users",
"forms",
"applications",
"departments"]

permissions.forEach(element => {
  if(!entity.permissions[element])
  {
    entity.permissions[element] = findrole.data.role.permissions[element];
  }
});

const res = await RoleFunction.update({id, params: entity})
        return {
          msg: translate(lang, "created_mood"),
          data: { res},
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
