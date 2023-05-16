const fromSetLang = require('./set-language');
const fromIslogged = require('./is-logged');
const fromVerifyRefreshToken = require('./verify-refresh-token');
const fromAppHealth = require('./app-health')

const appMiddlewares = {
    setLanguage: fromSetLang,
    isLogged: fromIslogged.isLogged,
    verifyRefreshToken: fromVerifyRefreshToken.verifyRefreshToken,
    checkHealth: fromAppHealth
}

module.exports = appMiddlewares;