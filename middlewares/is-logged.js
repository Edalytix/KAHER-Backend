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

    const refreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NDY3NTFiMzkzN2M1OGJmNzg2NzEyMTYiLCJlbWFpbCI6InRlc3QwMUBlbWFpbC5jb20iLCJ1YSI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMTMuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImlhdCI6MTY4NTM1NTI5NSwiZXhwIjoxNjg1NzAwODk1LCJpc3MiOiJrYWhlciJ9.M5yKq8YW81deqalswiaZDyVag-dxhgCAzdLNyKc11NNG4fs7Pq74dHbhfZk3ftm92jdyCRrRmff_p8Liil62EyRUZC5fcNuJ6P_k8xF5U4Gk1l1-KwS7sbY8DRN359fYT0AY7gAALRUWdbvDZvsIW9VafFiOzR0-cFBnuaknyNZEKQEONCoMhdz_83atLUWPFMInf6Y3tTknE_vrlU_wf0olBYxaepkaZUI3FMVBard1UzzsFivkVOl4MU16UE-FNb8r5Kkq9kzy7eVUHbtWfb0hgvzDMc4lg8JuNfG7pVOgV2OA3MCyWK6xgzcjWFMjsLGsWmciJfDA7p5HUy9NYQ';
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
