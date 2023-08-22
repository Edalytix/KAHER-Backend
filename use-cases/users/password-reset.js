const fromEntities = require('../../entity');
const config = require('../../config/app.config.json');

exports.PasswordReset = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  store,
  db,
  request,
  token,
  mailer,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        switch (request.method) {
          case 'GET':
            return await sendOTP({
              CreateError,
              DataValidator,
              logger,
              translate,
              crypto,
              store,
              db,
              request,
              token,
              mailer,
              request,
            });
          case 'POST':
            return await verifyOTP({
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

async function sendOTP({
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
  mailer,
}) {
  try {
    // generate entity
    const lang = request.lang;

    const usersFunction = db.methods.User({
      translate,
      logger,
      CreateError,
      lang,
    });

    // find user
    const user = (
      await usersFunction.findByEmail({ email: request.queryParams.email })
    ).data.user;

    if (user === null) {
      throw new CreateError(translate(lang, 'invalid_login_credentials'), 404);
    }

    const otp = getOTP(10);
    const storeOtpStatus = await store
      .Store({ translate, logger, lang, CreateError })
      .storeResetOtp({ otp, email: user.email });

    // send mail with otp
    const res = await mailer({
      CreateError,
      translate,
      logger,
      lang,
      lang: request.locals.lang,
      params: {
        to: request.queryParams.email,
        otp: otp,
        type: 'OTPSend',
      },
    });

    return {
      msg: translate(lang, 'otp_sent'),
      data: {},
    };
  } catch (error) {
    if (error instanceof CreateError) {
      throw error;
    }
    logger.error('POST: Failed to login user', error);
    throw new Error(error.message);
  }
}

const verifyOTP = async ({
  CreateError,
  translate,
  request,
  DataValidator,
  store,
  lang,
  logger,
  db,
  crypto,
}) => {
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

    const passwordHash = crypto.PasswordHash({
      CreateError,
      translate,
      logger,
      password: entity.oldpassword,
    });

    const verifyPassword = (await passwordHash.validatePassword(user.password))
      .data.valid;

    if (!verifyPassword) {
      throw new CreateError(translate(lang, 'invalid_login_credentials'), 303);
    }

    let updateEntity = (
      await fromEntities.entities.User.updateUser({
        CreateError,
        DataValidator,
        logger,
        translate,
        crypto,
        lang,
        params: { ...request.body, status: 'active' },
      }).generate()
    ).data.entity;

    if (updateEntity.password) {
      const hashedPassword = (
        await crypto
          .PasswordHash({
            CreateError,
            translate,
            logger,
            password: updateEntity.password,
          })
          .hashPassword()
      ).data.hashedPassword;
      updateEntity.password = hashedPassword;
    }

    const res = await usersFunction.update({
      id: user._id,
      params: updateEntity,
    });

    return {
      msg: translate(lang, 'updated_password_success'),
      data: {},
    };
  } catch (error) {
    if (error instanceof CreateError) {
      throw error;
    }
    logger.error('password-reset failed to find verify OTP', error);
    throw new Error(error.message);
  }
};

function getOTP(len, charSet) {
  len = 10 || len;
  charSet =
    charSet ||
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%*';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}
