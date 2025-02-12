import dotenv from 'dotenv'
dotenv.config()

const envConfig = {
  app_port: process.env.APP_PORT,
  frontend_url: process.env.FRONTEND_URL,
  mongo_url: process.env.MONGO_URL,
  secret_cookie_token: process.env.SECRET_COOKIE_TOKEN
}

export default envConfig
