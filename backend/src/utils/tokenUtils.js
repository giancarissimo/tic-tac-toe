// Generar un id para una sala privada
export function generateRoomId() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 6; i++) {
    id += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
  }
  return id
}

// Generar token para cambio de contraseña
export function generateResetToken() {
  // Se genera un número aleatorio entre 100000 y 999999 (ambos incluidos)
  const token = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  return token.toString() // Se convierte el número en una cadena de texto
}