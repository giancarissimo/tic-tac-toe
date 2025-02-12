import jwt from 'jsonwebtoken'
import UserModel from '../models/userModel.js'
import { createHash, isValidPassword } from '../utils/hashBcrypt.js'

import envConfig from '../config/dotenv.config.js'
const { secret_cookie_token } = envConfig

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await UserModel.find({}, 'username email')
      res.json({ users })
    } catch (error) {
      console.error("Error getting the users", error)
      res.status(500).send({ status: 'Error', category: 'Get Users', message: 'Error getting all the users' })
    }
  }

  async getUserById(req, res) {
    try {
      const { uid } = req.params
      const user = await UserModel.findOne({ _id: uid })
      res.json({ user })
    } catch (error) {
      console.error("Error getting the user", error)
      res.status(500).send({ status: 'Error', category: 'Get User', message: 'Error getting the user by id' })
    }
  }

  async register(req, res) {
    try {
      const { username, email, password } = req.body
      const errors = {}

      // Se valida si los datos del usuario ya fueron registrados
      const existingUsername = await UserModel.findOne({ username: username })
      const existingEmail = await UserModel.findOne({ email: email })

      // Se valida si el username ya está registrado
      if (existingUsername) {
        errors.username = 'Username already registered'
      }

      // Se valida si el correo electrónico ya está registrado
      if (existingEmail) {
        errors.email = 'Email address already registered'
      }

      // Se verifica si hay algun error presente
      if (Object.keys(errors).length > 0) {
        return res.json({ status: 'Error', category: 'Register', errors })
      }

      const newUser = {
        username,
        email,
        password: createHash(password),
      }

      await UserModel.create(newUser)

      res.status(201).json({ status: 'Success', category: 'Register', user: newUser })
    } catch (error) {
      console.error('Error in register:', error)
      res.status(500).send({ status: 'Error', category: 'Register', message: 'Error in register' })
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body
      const user = await UserModel.findOne({ email: email })
      const errors = {}

      if (user) {
        // Se verifica si el email y la contraseña son validos para iniciar sesión
        if (user.email !== email || !isValidPassword(password, user)) {
          errors.email = 'Email address or password are incorrect'
          errors.password = 'Email address or password are incorrect'
        }
      } else {
        errors.email = 'Email address or password are incorrect'
        errors.password = 'Email address or password are incorrect'
      }

      // Se verifica si hay algun error presente
      if (Object.keys(errors).length > 0) {
        return res.json({ status: 'Error', category: 'Login', errors })
      }

      const token = jwt.sign({ user: user._id }, secret_cookie_token, { expiresIn: '1h' })

      res.cookie('usercookie', token, {
        maxAge: 3600000,
        httpOnly: true,
        secure: true, // Solo en producción con HTTPS
        sameSite: 'none'
      })

      const userToFront = {
        id: user._id,
        username: user.username,
        email: user.email,
        matches: user.matches
      }

      res.status(201).json({ status: 'Success', category: 'Login', user: userToFront })
    } catch (error) {
      console.error('Error in login:', error)
      res.status(500).send({ status: 'Error', category: 'Login', message: 'Error in login' })
    }
  }

  async validateSession(req, res) {
    try {
      // Asegúrate de que las cookies estén definidas
      const cookies = req.cookies
      if (!cookies) {
        return res.json({ status: 'Error', category: 'Validate Session', message: 'No session cookie found' })
      }

      const token = cookies['usercookie']

      if (!token) {
        return res.json({ status: 'Error', category: 'Validate Session', message: 'No token provided' })
      }

      // Verificar el token
      const decoded = jwt.verify(token, secret_cookie_token)

      // Opcional: Obtener el usuario de la base de datos (si necesitas datos adicionales)
      const user = await UserModel.findById(decoded.user).select('username email matches')
      if (!user) {
        return res.json({ status: 'Error', category: 'Validate Session', message: 'Invalid token' })
      }

      // Devolver la información del usuario
      res.status(201).json({ status: 'Success', category: 'Validate Session', user: user })
    } catch (error) {
      console.error('Error al validar sesión:', error)
      res.json({ status: 'Error', message: 'Invalid or expired token' })
    }
  }

  async logout(req, res) {
    res.cookie('usercookie', "", {
      expiresIn: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })
    res.status(200).json({ status: 'Success', category: 'Logout' })
  }
}

export default UserController
