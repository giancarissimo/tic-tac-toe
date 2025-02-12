import dbInstance from './database.js'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import UserController from './controllers/userController.js'
import gameSockets from './sockets/gameSockets.js'
import cookieParser from 'cookie-parser'
import initializePassport from './config/passport.config.js'
import passport from 'passport'

// Variables de entorno
import configObject from './config/dotenv.config.js'
const { app_port, frontend_url } = configObject

const corsOptions = {
  origin: frontend_url,
  credentials: true
}

// Servidor
const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: corsOptions })

// Nuevas instancias de clases
const userController = new UserController()

// Middlewares
initializePassport()
app.use(passport.initialize())
app.use(cors({
  origin: frontend_url,
  credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas de autenticación
app.use('/api/users', userRoutes(userController))

app.get('/check-cookie', (req, res) => {
  const usercookie = req.cookies['usercookie']
  if (usercookie) {
    res.json({ message: 'Cookie encontrada', usercookie })
  } else {
    res.status(400).json({ message: 'Cookie no encontrada' })
  }
})

// Configuración de Socket.IO
gameSockets(io)

const PORT = app_port || 5000
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
