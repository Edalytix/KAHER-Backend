const fromEntities = require('../../entity');
const mongoose = require('mongoose');

exports.BruteResetPassword = ({
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
        const lang = request.lang;
        let entity = await fromEntities.entities.User.resetPassword({
          CreateError,
          DataValidator,
          logger,
          translate,
          crypto,
          lang,
          params: {
            ...request.body,
          },
        }).generate();

        entity = entity.data.entity;

        const usersFunction = db.methods.User({
          translate,
          logger,
          CreateError,
          lang,
        });

        // find user
        // let user = null;
        // if (entity.email) {
        //   user = (await usersFunction.findByEmail({ email: entity.email })).data
        //     .user;
        // }
        // if (entity.employeeId) {
        //   user = (
        //     await usersFunction.findByEmpyId({ employeeId: entity.employeeId })
        //   ).data.user;
        // }

        // if (user === null) {
        //   throw new CreateError(
        //     translate(lang, 'invalid_login_credentials'),
        //     404
        //   );
        // }

        // let updateEntity = (
        //   await fromEntities.entities.User.updateUser({
        //     CreateError,
        //     DataValidator,
        //     logger,
        //     translate,
        //     crypto,
        //     lang,
        //     params: { ...request.body, status: 'active' },
        //   }).generate()
        // ).data.entity;

        // if (updateEntity.password) {
        //   const hashedPassword = (
        //     await crypto
        //       .PasswordHash({
        //         CreateError,
        //         translate,
        //         logger,
        //         password: updateEntity.password,
        //       })
        //       .hashPassword()
        //   ).data.hashedPassword;
        //   updateEntity.password = hashedPassword;
        // }

        // const res = await usersFunction.update({
        //   id: user._id,
        //   params: updateEntity,
        // });

        return {
          msg: translate(lang, 'updated_password_success'),
          data: {},
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
