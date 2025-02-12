// Generar un id para una sala privada
export function generateRoomId() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 6; i++) {
    id += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
  }
  return id
}