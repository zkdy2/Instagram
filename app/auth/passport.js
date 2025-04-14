const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const User = require('./User')

const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret key',
};

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
    const user = await User.findByPk(jwtPayload.id)
    if (user) {
        return done(null, user)
    } else {
        return done(null, false)
    }
}));

module.exports = { jwtOptions };
