const { ExtractJwt, Strategy } = require('passport-jwt');
const config = require('../../config/config');
// const tokenTypes = require('../token/token.types');
const User = require('../user/user.model');

const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail',
};

const jwtStrategy = new Strategy(
  {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload, done) => {
    try {
      if (payload.type !== tokenTypes.ACCESS) {
        throw new Error('Invalid token type');
      }
      const user = await User.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

module.exports = jwtStrategy;
