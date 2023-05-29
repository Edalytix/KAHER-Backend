const CreateError = require("../error/dp-error").CreateError;
const CONFIG = require("../config/app.config.json");
const keyStore = require("../lib/store").store;
const translate = require("../i18n/msg");
const tokenHandler = require("../lib/token").token;
const logger = require("../utils/logger").logger;

const refreshTokenCookieName = CONFIG.refreshToken.cookie.name;

module.exports.isLogged = async (req, res, next) => {
  try {
    const lang = res.locals.lang;

    // refresh token validation
    // const refreshToken =
    //   req.cookies[refreshTokenCookieName] || req.cookies.refreshTokenCookieName;

    const refreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NDY3NTFiMzkzN2M1OGJmNzg2NzEyMTYiLCJlbWFpbCI6InRlc3QwMUBlbWFpbC5jb20iLCJ1YSI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMTMuMC4wLjAgU2FmYXJpLzUzNy4zNiIsInJvbGUiOiJBZG1pbiBSb2xlIiwiaWF0IjoxNjg1MzM0ODYwLCJleHAiOjE2ODU2ODA0NjAsImlzcyI6ImthaGVyIn0.LpCmq_DVET7cDl8Dbld-F1D7VY_H_VNLoO2xfBMMVkdZ_LYJ3SHWVBxPS_YHVghN-3CaEUJ87g44xEOXSAsKAIawl5hVa4LkiP1dJVjpJeZKp4O7vOe14g9s0VWDPp2sXi5EdGkBr5a_I2K_0mwq2HAUGUgs_ARQZZTLs5mOMEr0U-OI6dhwfICUSnWWFDQwFiSTwsS_mYOADkemiLCfspqCwR-w59YOwIWVevHLEaC_hMQ_KzeF6rZchayZqmt-moGS7znI5bEp_PSV0jNVnnGDWFR9LifFbZGHyW0Ttsb_6omYEyNYpkzkWaoH4X_d4znAjoDHIDec15b6_A-jDQ';
    if (refreshToken === undefined) {
      return res
        .status(401)
        .json({ msg: translate(lang, "token_required"), data: {} });
    }

    const tokenMethods = tokenHandler.jwt({
      lang,
      CreateError: CreateError,
      translate,
      logger,
    });

    let refreshTokenStatus;
    try {
      refreshTokenStatus = (
        await tokenMethods.verifyToken({ token: refreshToken })
      ).data;
    } catch (error) {
      return res.status(401).json({ msg: error.message, data: {} });
    }

    const refreshTokenData = (
      await keyStore
        .Store({
          lang,
          CreateError,
          translate,
          logger,
        })
        .getRefreshToken({
          userUID: refreshTokenStatus.uid,
          token: refreshToken,
        })
    ).data;

    if (refreshTokenData === null) {
      return res
        .status(401)
        .json({ msg: translate(lang, "login_required"), data: {} });
    }

    // auth token validation
    const authHeader = req.get("authorization");
    if (authHeader === undefined) {
      return res
        .status(401)
        .json({ msg: translate(lang, "token_required"), data: {} });
    }
    const bearerToken = authHeader.split(" ")[1];

    let tokenStatus;
    try {
      tokenStatus = await tokenMethods.verifyToken({ token: bearerToken });
    } catch (error) {
      return res.status(403).json({ msg: error.message, data: {} });
    }

    res.locals = {
      ...res.locals,
      refreshToken: refreshToken,
      bearerToken: bearerToken,
      ...tokenStatus.data,
    };
    req.uid = tokenStatus?.data?.uid;
    req.lang = res?.locals?.lang;
    return next();
  } catch (error) {
    console.log("Error-while validating session", error);
    return res 
      .status(500)
      .json({ msg: translate(lang, "error_unknown"), data: {} });
  }
};
