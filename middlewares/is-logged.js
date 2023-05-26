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

    const refreshToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NDY3NTFiMzkzN2M1OGJmNzg2NzEyMTYiLCJlbWFpbCI6InRlc3QwMUBlbWFpbC5jb20iLCJ1YSI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMTMuMC4wLjAgU2FmYXJpLzUzNy4zNiIsInJvbGUiOiJBZG1pbiBSb2xlIiwiaWF0IjoxNjg1MDcwNDYwLCJleHAiOjE2ODU0MTYwNjAsImlzcyI6ImthaGVyIn0.IBRRdUfQ9xQhi2KR48am4teT-hLSy8gGBbaP2rOBysok4JcPaCIuCR0pnlyeZfewR2IO-AD-a6xVoOl6Te_Nwm-f8SH45mbEZUjfyL8APoTX49305qHFMukNbJU3g25MWHNKUGlqBMMl-0jSS2ChXhmkprVewiRpqJ15sc1hh-HpAabw9kXLCn6n_ZyRXgTkXlcWA7Ro_uJ-Zx3TyoCnDlKZvxpjPk3SvTkNPSlmiv_vBK2kTEYkaGwh_Luut-8xbgVRktkXXfURCDE8izOEFs69Tl4ny_Snp1L2r8jL2bFDr2LNir_Lcan8OgFBZG1LrKKUGsNmxOMDSvzHti26Ug';
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
