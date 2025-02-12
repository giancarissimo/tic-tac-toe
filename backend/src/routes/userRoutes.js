import express from 'express'
const router = express.Router()

export default (userController) => {
  // Ruta GET /api/users - se traen todos los usuarios registrados
  router.get('/', userController.getAllUsers)

  // Ruta GET /api/users/:uid - se trae un usuario por id
  router.get('/user/:uid', userController.getUserById)

  // Ruta POST /api/users/register - se utiliza passport con jwt generando un usuario y almacenandolo en MongoDB
  router.post('/register', userController.register)

  // Ruta POST /api/users/login - se utiliza passport con jwt para iniciar sesión
  router.post('/login', userController.login)

  // Ruta POST /api/users/validatesession - se valida la cookie para determinar si la sesión venció o no
  router.get('/validatesession', userController.validateSession)

  // Ruta GET /api/users/logout - se utiliza passport con jwt para cerrar la sesión
  router.get('/logout', userController.logout)

  return router
}