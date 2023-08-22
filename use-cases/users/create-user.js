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
  accessManager,
  uploadFile,
  mailer,
  token,
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
          useCase: 'users:edit',
        });
        if (!acesssRes) {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        const tokenGenerator = token.jwt({
          CreateError,
          translate,
          lang,
          logger,
        });

        const UserFunction = db.methods.User({
          translate,
          logger,
          CreateError,
          lang,
        });

        const users = (await UserFunction.findAll()).data.total;

        let entity = (
          await fromEntities.entities.User.addUser({
            CreateError,
            DataValidator,
            logger,
            translate,
            crypto,
            lang,
            params: { ...request.body, userUID },
            num: users,
          }).generate()
        ).data.entity;

        // if (request.body?.files?.profile_picture) {
        //   const obj = await uploadFile({
        //     file: request.body?.files?.profile_picture[0],
        //   });
        //   entity.profile_picture = obj.url;
        // }

        const hashedPassword = (
          await crypto
            .PasswordHash({
              CreateError,
              translate,
              logger,
              password: entity.password,
            })
            .hashPassword()
        ).data.hashedPassword;

        const preSetPassword = entity.password;
        entity.password = hashedPassword;

        const DepartmentFunction = db.methods.Department({
          translate,
          logger,
          CreateError,
          lang,
        });
        const department = await DepartmentFunction.findById(
          entity.department.id
        );
        if (!department.data.department) {
          throw new CreateError('Department not found', 403);
        }
        entity.department.name = department.data.department.name;
        const res = await UserFunction.create(entity);

        const refreshToken = (
          await tokenGenerator.generateRefreshToken({
            _id: res.data.user._id,
            status: res.data.user.status,
            email: entity.email,
            firstname: entity.firstName,
            lastname: entity.secondName,
            ua: request.locals.ua,
          })
        ).data.token;

        const mail = await mailer({
          CreateError,
          translate,
          logger,
          lang,
          lang: request.locals.lang,
          params: {
            to: entity.email,
            password: preSetPassword,
            token: refreshToken,
            type: 'SetPassword',
          },
        });
        return {
          msg: translate(lang, 'created_mood'),
          data: { res },
        };
      } catch (error) {
        console.log('message', error.message);
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(`Failed to signup: %s`, error);
      }
    },
  });
};
