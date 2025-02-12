import envConfig from '../config/dotenv.config.js'
import passport from 'passport'
import jwt from 'passport-jwt'

const { secret_cookie_token } = envConfig
const { Strategy: JWTStrategy, ExtractJwt } = jwt

const initializePassport = () => {
  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: secret_cookie_token,
  }, async (jwt_payload, done) => {
    try {
      return done(null, jwt_payload)
    } catch (error) {
      return done(error)
    }
  }))
}

const cookieExtractor = (req) => {
  let token = null
  if (req && req.cookies) {
    token = req.cookies['usercookie']
  }
  return token
}

export default initializePassport
