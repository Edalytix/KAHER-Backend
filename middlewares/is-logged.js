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

    const refreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NDc0N2M2ODI0YzA5OGExYTU3Y2FiNzIiLCJlbWFpbCI6InRlbXA2NkBlbWFpbC5jb20iLCJ1YSI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMTMuMC4wLjAgU2FmYXJpLzUzNy4zNiIsInJvbGUiOiI2NDY3M2M3MzgyM2E5NWJlMTM2ZTkxZjQiLCJpYXQiOjE2ODUzNTg3MjQsImV4cCI6MTY4NTcwNDMyNCwiaXNzIjoia2FoZXIifQ.WugF71yb3Zc44aY9r2HsoOH2wHKi3RSH8jJysHtx50UW0qC5f-sYHwOrFtCC4nb-xRD4BG_JXicfo4vnTmPgOobYcHfqxiAAwsNj6BLA3j9lXuiomUGFCVUzfcxK0Gfhpma7sXrYg6C9BBDBRuEmscu2F92ZwtDesuBAjqgxINnqAIGPK0LCWrrlqXaoQQg9W1C72H_v2m5DeLjoVqsxR0SqBiLBYiCiXAs1zMSYiJGulQaAKC5Qq136UKfiJN-kBmqciWAQjh1QpNNZnb3Jtl1CyfJ2x1BnBkZxoROXfwOXzHBEtaJpZlQhbZlmkMzFGWU1otdM7D6D7CM8Rtjikw';
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
