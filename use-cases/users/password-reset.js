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
    const latestOTP = (
      await store
        .Store({ translate, logger, lang, CreateError })
        .getResetOtp({ email: request.body.email })
    ).data.otp;

    if (latestOTP === null) {
      throw new CreateError(translate(lang, 'otp_expired'), 404);
    }

    if (String(request.body.otp) !== String(latestOTP)) {
      throw new CreateError(translate(lang, 'invalid_otp'), 401);
    }

    const usersFunction = db.methods.User({
      translate,
      logger,
      CreateError,
      lang,
    });

    // find user
    const user = (
      await usersFunction.findByEmail({ email: request.body.email })
    ).data.user;

    let entity = (
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

    if (entity.password) {
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
      entity.password = hashedPassword;
    }

    const res = await usersFunction.update({ id: user._id, params: entity });

    return {
      msg: translate(lang, 'success_otp_verified'),
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
