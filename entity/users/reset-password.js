const generatePassword = require('generate-password');

exports.resetPassword = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  lang,
  params,
}) => {
  return Object.freeze({
    async generate() {
      try {
        const validate = DataValidator({ CreateError, lang, translate });

        let entity = {
          email: null,
          password: null,
          oldpassword: null,
          employeeId: null,
        };

        if (params.employeeId) {
          entity.employeeId = params.employeeId;
        } else {
          delete entity.employeeId;
        }

        if (params.email) {
          entity.email = validate.email(params.email).data.value;
        } else {
          delete entity.email;
        }
        if (params.password) {
          // entity.password = validate.password(params.password).data.value;
          entity.password = params.password;
        } else {
          delete entity.password;
        }

        if (params.oldpassword) {
          // entity.password = validate.password(params.password).data.value;
          entity.oldpassword = params.oldpassword;
        } else {
          delete entity.oldpassword;
        }

        return {
          msg: translate(lang, 'success'),
          data: { entity },
        };
      } catch (error) {
        logger.error('Failed to create exercise entity: %s', error);
        if (error instanceof CreateError) {
          throw error;
        }
        throw new Error(translate(lang, 'error_unknown'));
      }
    },
  });
};
