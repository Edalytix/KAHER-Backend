const fromEntities = require('../../entity');
const config = require('../../config/app.config.json');

exports.Login = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  store,
  db,
  request,
  token,
}) => {
  const loginTrials = config.loginTrials;
  return Object.freeze({
    execute: async () => {
      try {
        switch (request.method) {
          case 'POST':
            return await postLogin({
              CreateError,
              DataValidator,
              logger,
              translate,
              crypto,
              store,
              db,
              request,
              loginTrials,
              token,
            });
          case 'GET':
            return await getLogin({
              CreateError,
              DataValidator,
              logger,
              translate,
              crypto,
              store,
              db,
              request,
              token,
            });
          default:
            throw new CreateError(
              translate(request.lang, 'method_not_implemented'),
              405
            );
        }
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(`Failed to login: %s`, error);
        throw new Error(error.message);
      }
    },
  });
};

async function postLogin({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  store,
  db,
  request,
  loginTrials,
  token,
}) {
  try {
    // generate entity
    const lang = request.lang;

    let entity = await fromEntities.entities.User.loginUser({
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
    let user = null;
    if (entity.email) {
      user = (await usersFunction.findByEmail({ email: entity.email })).data
        .user;
    }
    if (entity.employeeId) {
      user = (
        await usersFunction.findByEmpyId({ employeeId: entity.employeeId })
      ).data.user;
    }

    if (user === null) {
      throw new CreateError(translate(lang, 'invalid_login_credentials'), 404);
    }

    // if (parseInt(user.invalid_attempts) > parseInt(loginTrials)) {
    //   throw new CreateError(translate(lang, "maximum_password_retries"));
    // }
    // check if the account is disabled
    if (user.status === 'inactive') {
      throw new CreateError(translate(lang, 'account_disabled'), 403);
    }

    // force reset password
    // if (user.force_reset_password) {
    //   throw new CreateError(translate(lang, "error_reset_password"), 303);
    // }

    const passwordHash = crypto.PasswordHash({
      CreateError,
      translate,
      logger,
      password: entity.password,
    });

    const verifyPassword = (await passwordHash.validatePassword(user.password))
      .data.valid;

    if (!verifyPassword) {
      throw new CreateError(translate(lang, 'invalid_login_credentials'), 303);
    }

    // invalid password
    // if (!verifyPassword) {
    //   usersFunction.updateByEmail({
    //     email: user.email,
    //     params: {
    //       invalid_attempts: user.invalid_attempts + 1,
    //     },
    //   });
    //   throw new CreateError(translate(lang, "invalid_login_credentials"), 401);
    // }

    // reset the invalid attemptes
    // if (user.invalid_attempts !== 0) {
    //   usersFunction.updateByEmail({
    //     email: user.email,
    //     params: { invalid_attempts: 0 },
    //   });
    // }

    delete user.password;

    // assign roles
    // let role;
    // if (/[a-zA-Z:\/.]*(admin)[a-zA-Z:\/.]*/.test(request.locals.origin)) {
    //   role = user.roles.superadmin ? "superadmin" : "admin";
    // } else {
    //   if (!user.roles.doctor && !user.roles.patient) {
    //     throw new CreateError(translate(lang, "error_account_role"), 400);
    //   }
    //   role = user.roles.doctor ? "doctor" : "patient";
    // }

    // // register the device used for the logging in
    // let loginDevice = null;
    const tokenGenerator = token.jwt({ CreateError, translate, lang, logger });

    const bearerToken = (
      await tokenGenerator.generateBearerToken({
        uid: user._id.toString(),
        email: user.email,
        firstname: user.firstName,
        lastname: user.secondName,
        ua: request.locals.ua,
        role: user.role,
      })
    ).data.token;

    const refreshToken = (
      await tokenGenerator.generateRefreshToken({
        uid: user._id.toString(),
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        ua: request.locals.ua,
        role: user.role,
      })
    ).data.token;

    const storeToken = await store
      .Store({ lang, CreateError, translate, logger })
      .storeRefreshToken({
        token: refreshToken,
        userUID: user._id.toString(),
        ua: request.locals.ua,
      });
    return {
      msg: translate(lang, 'success'),
      data: {
        user: user,
        token: bearerToken,
        refresh_token: refreshToken,
        // devices: loginDevice,
      },
    };
  } catch (error) {
    if (error instanceof CreateError) {
      throw error;
    }
    logger.error('POST: Failed to login user', error);
    throw new Error(error.message);
  }
}

async function getLogin({ CreateError, logger, translate, db, request }) {
  try {
    const lang = request.lang;
    const userUID = request.locals.uid;

    if (userUID === undefined) {
      throw new CreateError(translate(lang, 'invalid_details'));
    }

    const usersFunction = db.methods.User({
      translate,
      logger,
      CreateError,
      lang,
    });

    // find user
    const user = (
      await usersFunction.findByUID({ uid: userUID, includeAll: false })
    ).data.users;

    if (user === null) {
      throw new CreateError(translate(lang, 'account_not_found'), 404);
    }

    return {
      msg: translate(lang, 'success'),
      data: { user },
    };
  } catch (error) {
    if (error instanceof CreateError) {
      throw error;
    }
    logger.error('GET: Failed to login user', error);
    throw new Error(error.message);
  }
}
