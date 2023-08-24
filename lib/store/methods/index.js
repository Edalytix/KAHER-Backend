const CONFIG = require('../../../config/app.config.json');
const translate = require('../../../i18n/msg');
const logger = require('../../../utils/logger').logger;
const CreateError = require('../../../error/dp-error').CreateError;
const MongoToken = require('../../database/methods/token').Token({
  translate,
  logger,
  CreateError,
  lang: 'en',
});
const StoreOTP = require('../../database/methods/storeOTP').OTP({
  translate,
  logger,
  CreateError,
  lang: 'en',
});

const redisClient = require('../connection');

const refreshTokenPrefix = CONFIG.refreshToken.storage.pathPrefix;
const refreshTokenTTL = CONFIG.refreshToken.storage.ttl;

const passwordResetOtpPrefix = CONFIG.passwordReset.storage.pathPrefix;
const passwordResetOtpTTL = CONFIG.passwordReset.storage.ttl;

exports.Store = ({ lang = 'de', CreateError, translate, logger }) => {
  return Object.freeze({
    storeRefreshToken: async ({ token, userUID, ip, ua }) => {
      try {
        const keyPath = `${refreshTokenPrefix}${userUID}:${token}`;
        // const storeToken = await redisClient.setAsync(
        //   keyPath,
        //   JSON.stringify({
        //     user_uid: userUID,
        //     created_on: new Date().toISOString(),
        //     ua,
        //   })
        // );

        // const setTokenExpire = await redisClient.expire(
        //   keyPath,
        //   refreshTokenTTL
        // );

        const res = await MongoToken.create({
          token: keyPath,
          sessData: {
            user_uid: userUID,
            created_on: new Date().toISOString(),
            ua,
          },
        });

        setTimeout(async () => {
          const deleteToken = await MongoToken.deleteById({
            _id: res.data.token._id,
          });
        }, 3600000);

        return {
          msg: translate(lang, 'success'),
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Error while storing refresh token to store', error);
        throw new Error(translate(lang, 'error_unknown'));
      }
    },
    getRefreshToken: async ({ userUID, token }) => {
      try {
        const keyPath = `${refreshTokenPrefix}${userUID}:${token}`;
        //get the key
        //const sessData = await redisClient.getAsync(keyPath);
        // if (sessData === null) {
        //   return {
        //     msg: translate(lang, 'session_expired'),
        //     data: null,
        //   };
        // }
        const sessData = (await MongoToken.findOne(keyPath))?.data?.sessData;
        // key not found
        if (!sessData) {
          return {
            msg: translate(lang, 'session_expired'),
            data: null,
          };
        }

        // All ok
        return {
          msg: translate(lang, 'success'),
          data: { sessData },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Error while fetching refresh token from store', error);
        throw new Error(translate(lang, 'error_unknown'));
      }
    },
    deleteRefreshToken: async ({ token, userUID }) => {
      try {
        const keyPath = `${refreshTokenPrefix}${userUID}:${token}`;
        const deleteToken = await MongoToken.deleteById({ token: keyPath });

        //await redisClient.del(keyPath);
        return {
          msg: translate(lang, 'success'),
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Error while deleting refresh token from store', error);
        throw new Error(translate(lang, 'error_unknown'));
      }
    },
    storeResetOtp: async ({ otp, email }) => {
      try {
        const keyPath = `${passwordResetOtpPrefix}${email}`;
        // const storeToken = await redisClient.setAsync(
        //   keyPath,
        //   JSON.stringify({
        //     otp,
        //   })
        // );
        // const setTokenExpire = await redisClient.expire(
        //   keyPath,
        //   passwordResetOtpTTL
        // );

        const res = await StoreOTP.create({
          keyPath,
          otp,
        });

        setTimeout(async () => {
          const deleteOTP = await StoreOTP.deleteById({
            _id: res.data.otp._id,
          });
        }, 360000000);
        return {
          msg: translate(lang, 'success'),
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Error while storing otp', error);
        throw new Error(translate(lang, 'error_unknown'));
      }
    },
    getResetOtp: async ({ email }) => {
      try {
        const keyPath = `${passwordResetOtpPrefix}${email}`;
        const otp = (await StoreOTP.findOne(keyPath))?.data?.otp;

        if (!otp) {
          return {
            msg: translate(lang, 'required_otp'),
            data: null,
          };
        }

        //const tokenData = await redisClient.getAsync(keyPath);
        // return {
        //   msg: translate(lang, 'success'),
        //   data: { otp: tokenData === null ? null : JSON.parse(tokenData).otp },
        // };

        return {
          msg: translate(lang, 'success'),
          data: { otp: otp },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Error while fetching otp from store', error);
        throw new Error(translate(lang, 'error_unknown'));
      }
    },
    deleteResetOtp: async ({ email }) => {
      try {
        const keyPath = `${passwordResetOtpPrefix}${email}`;

        await redisClient.del(keyPath);

        return {
          msg: translate(lang, 'success'),
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Error while deleting otp from store', error);
        throw new Error(translate(lang, 'error_unknown'));
      }
    },
    sendOtp: async ({ otp, email }) => {
      try {
        const keyPath = `appos_dev:sendOtp:${email}`;
        const storeToken = await redisClient.setAsync(
          keyPath,
          JSON.stringify({
            otp,
          })
        );
        const setTokenExpire = await redisClient.expire(
          keyPath,
          passwordResetOtpTTL
        );
        return {
          msg: translate(lang, 'success'),
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Error while storing otp', error);
        throw new Error(translate(lang, 'error_unknown'));
      }
    },
    verifySendOtp: async ({ email }) => {
      try {
        const keyPath = `appos_dev:sendOtp:${email}`;
        const tokenData = await redisClient.getAsync(keyPath);

        return {
          msg: translate(lang, 'success'),
          data: { otp: tokenData === null ? null : JSON.parse(tokenData).otp },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Error while fetching otp from store', error);
        throw new Error(translate(lang, 'error_unknown'));
      }
    },
  });
};
