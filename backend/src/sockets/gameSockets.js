import { generateRoomId } from '../utils/tokenUtils.js'
import UserModel from '../models/userModel.js'

const gameSockets = (io) => {
  const rooms = {} // Store room data for each game room
  const playersSearching = {} // Se almacena a los jugadores buscando partida para emparejarlos

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on('search-game', ({ playerName, totalWins, userId }) => {
      console.log('Search-game received:', playerName, totalWins)
      if (!playersSearching[totalWins]) playersSearching[totalWins] = []

      socket.context = 'matchmaking' // Establecer el contexto inicial como "matchmaking"

      // Verificar si ya hay alguien buscando con el mismo totalWins
      const opponent = playersSearching[totalWins].shift()
      if (opponent) {
        // Crear la sala
        const roomId = generateRoomId()
        rooms[roomId] = {
          id: roomId,
          public: true,
          players: [
            { id: opponent.id, name: opponent.name, userId: opponent.userId, wins: 0 },
            { id: socket.id, name: playerName, userId, wins: 0 },
          ],
          isXNext: true,
          rounds: 0,
          totalWins: totalWins,
          squares: Array(9).fill(null),
          winner: null,
          votes: {
            playAgain: 0,
            exit: 0
          }
        }

        socket.context = 'matchmaking-room' // Cambiar contexto a "matchmaking-room"
        io.sockets.sockets.get(opponent.id).context = 'matchmaking-room' // Cambiar contexto del oponente

        socket.join(roomId)
        io.sockets.sockets.get(opponent.id)?.join(roomId)

        const roomPlayers = rooms[roomId].players
        io.to(opponent.id).emit('matched', { roomId, players: roomPlayers, opponent: playerName, totalWins: rooms[roomId].totalWins })
        io.to(socket.id).emit('matched', { roomId, players: roomPlayers, opponent: opponent.name, totalWins: rooms[roomId].totalWins })
        console.log(`Room ${roomId} created for ${opponent.name} and ${playerName}`)

      } else {
        // Se Agrega al jugador a la búsqueda y configurar timeout
        playersSearching[totalWins].push({ id: socket.id, name: playerName, userId })
        console.log(`${playerName} is searching for a game with ${totalWins} total wins`)

        // Configurar un timeout de 30 segundos para la búsqueda
        const timeoutId = setTimeout(() => {

          // Verificar si el jugador sigue en la lista
          const index = playersSearching[totalWins].findIndex(player => player.id === socket.id)

          if (index !== -1) {
            playersSearching[totalWins].splice(index, 1) // Eliminar al jugador de la lista
            socket.emit('search-timeout', 'No opponents found')
            console.log(`${playerName} timed out while searching for a game with ${totalWins} total wins`)
          }
        }, 30000) // 30 segundos

        socket.matchmakingTimeout = timeoutId
      }
    })

    socket.on('cancel-search', () => {
      if (socket.context === 'matchmaking') {
        for (const [wins, players] of Object.entries(playersSearching)) {
          const index = players.findIndex(player => player.id === socket.id)
          if (index !== -1) {
            playersSearching[wins].splice(index, 1) // Eliminar al jugador de la lista
            console.log(`Player ${socket.id} canceled matchmaking for ${wins} total wins`)
            console.log(playersSearching)
            break
          }
        }

        // Cancelar el timeout
        clearTimeout(socket.matchmakingTimeout)
        socket.emit('search-canceled')
      }
    })

    // Event when Player 1 creates a room
    socket.on('create-room', ({ roomId, playerName, userId }) => {
      if (!rooms[roomId]) {
        rooms[roomId] = {
          id: roomId,
          public: false,
          players: [{ id: socket.id, name: playerName, userId, wins: 0 }],
          isXNext: true,
          rounds: 0,
          totalWins: 1,
          squares: Array(9).fill(null),
          winner: null,
          votes: {
            playAgain: 0,
            exit: 0
          }
        }
        socket.join(roomId)
        socket.context = 'private' // Contexto de partida privada
        console.log(`Room ${roomId} created by ${playerName}`)
        console.log(rooms[roomId])
      } else {
        socket.emit('error', 'Room already exists') // Optional error handling
      }
    })

    // Event when Player 2 joins an existing room
    socket.on('join-room', ({ roomId, playerName, userId }) => {
      const room = rooms[roomId]
      if (room && room.players.length === 1) { // Check if room exists and has only 1 player
        room.players.push({ id: socket.id, name: playerName, userId, wins: 0 })
        socket.join(roomId)
        socket.context = 'private' // Contexto de partida privada
        // Notify both players that Player 2 has joined
        io.to(roomId).emit('player-joined', {
          room: room,
          player2Name: playerName,
          players: room.players,
        })
        console.log(`Player 2 (${playerName}) joined room ${roomId}`)
      } else {
        socket.emit('error', 'Room not found or already full')
      }
    })

    socket.on('change-wins', ({ roomId, totalWins }) => {
      console.log("totalWins", totalWins)
      rooms[roomId].totalWins = totalWins
      console.log(`cambiado (${rooms[roomId].totalWins}) `)
      io.to(roomId).emit('wins-changed', rooms[roomId])
    })

    // Start game event - only allowed if both players are connected
    socket.on('start-game', ({ roomId }) => {
      const room = rooms[roomId]
      if (room && room.players.length === 2) {
        // Broadcast to both players to start the game
        io.to(roomId).emit('game-started', rooms[roomId])
        console.log(`Game started in room ${roomId}`)
      } else {
        socket.emit('error', 'Both players need to be connected to start the game')
      }
    })

    socket.on('player-move', ({ roomId, index, playerSymbol }) => {
      const room = rooms[roomId]
      if (!room) {
        console.error(`La sala con ID ${roomId} no existe.`)
        return
      }

      const currentPlayer = room.isXNext ? room.players[0].id : room.players[1].id

      if (socket.id === currentPlayer) {
        room.squares[index] = playerSymbol
        room.isXNext = !room.isXNext // Cambiar el turno

        // Emitir el estado actualizado del tablero a ambos jugadores en la sala
        io.to(roomId).emit('player-moved', { squares: room.squares, isXNext: room.isXNext })
      } else {
        socket.emit('error', 'Not your turn')
      }
    })

    socket.on('round-draw', ({ roomId, winner }) => {
      const room = rooms[roomId]
      if (room) {
        if (winner === 'Draw') {
          if (room.squares.some(e => e === 'X')) {
            room.squares = Array(9).fill(null)
            room.rounds = room.rounds + 1
            io.to(roomId).emit('round-drawed', {
              squares: room.squares,
              isXNext: room.rounds % 2 === 0
            })
            console.log(room)
          }
        }
      }
    })

    socket.on('round-winner', async ({ roomId, winner }) => {
      const room = rooms[roomId]
      if (room) {
        if (room.squares.some(e => e === 'X')) {
          // Identificar al jugador que ganó la ronda
          const playerIndex = winner === 'X' ? 0 : 1

          // Actualizar las estadísticas del juego
          room.players[playerIndex].wins += 1
          room.rounds = room.rounds + 1
          room.isXNext = room.rounds % 2 === 0 // Alternar el turno inicial para la siguiente ronda
          room.squares = Array(9).fill(null)

          // Emitir evento de ganador de la ronda
          io.to(roomId).emit('winner-round', {
            winner,
            isXNext: room.isXNext,
            player1Wins: room.players[0].wins,
            player2Wins: room.players[1].wins,
            squares: room.squares
          })
          console.log('Ronda ganada por:', winner)

          // Verificar si uno de los jugadores alcanzó el total de victorias necesarias
          if (room.players[playerIndex].wins === room.totalWins) {
            room.winner = room.players[playerIndex].name // Establecer el ganador de la partida
            io.to(roomId).emit('game-over', { winner: room.winner }) // Emitir evento de fin de partida
            console.log('La partida ha terminado. Ganador:', room.winner)

            const matchResult = {
              roomId: roomId,
              public: room.public,
              player1: {
                name: room.players[0].name,
                wins: room.players[0].wins
              },
              player2: {
                name: room.players[1].name,
                wins: room.players[1].wins
              },
              totalWins: room.totalWins,
              winner: room.winner
            }

            // Guardar la partida en la base de datos para cada jugador loggeado
            for (const player of room.players) {
              if (player.userId !== null && player.userId !== undefined) {
                try {
                  await UserModel.findOneAndUpdate({ _id: player.userId }, { $push: { matches: matchResult } })
                  console.log(`Partida guardada para el usuario ${player.name}`)
                } catch (error) {
                  console.error(`Error guardando partida para usuario ${player.name}:`, error.message)
                }
              }
            }
          }
        }
      }
    })

    socket.on('match-votes', ({ roomId, vote }) => {
      const room = rooms[roomId]

      if (room) {
        if (vote === 'play again') {
          room.votes.playAgain += 1
          io.to(roomId).emit('vote-update', { playAgain: room.votes.playAgain, exit: room.votes.exit })
          console.log('Se votó para jugar de nuevo')

          if (room.votes.playAgain === 2) {
            // Reinicia la partida
            room.squares = Array(9).fill(null)
            room.players[0].wins = 0
            room.players[1].wins = 0
            room.isXNext = true
            room.rounds = 0

            io.to(roomId).emit('match-resetted', {
              player1: room.players[0].name,
              player2: room.players[1].name,
              totalWins: room.totalWins,
            })
            room.votes = { playAgain: 0, exit: 0 } // Resetear los votos
          }
        } else if (vote === 'exit') {
          room.votes.exit += 1
          io.to(roomId).emit('vote-update', { playAgain: room.votes.playAgain, exit: room.votes.exit })
          console.log('Se votó para salir de la partida')
        }
        if (room.votes.playAgain === 1 && room.votes.exit === 1 || room.votes.exit === 2) {
          io.to(roomId).emit('exit-match')
          console.log('Se saldrá de la partida')
          delete rooms[roomId] // Eliminar la sala
        }
      } else {
        console.log(`La sala con id ${roomId} no existe`)
      }
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`)

      // Manejar desconexión según el contexto
      if (socket.context === 'private') {
        // El jugador estaba en un room privado
        for (const roomId in rooms) {
          const room = rooms[roomId]
          const playerIndex = room.players.findIndex((player) => player.id === socket.id)

          if (playerIndex !== -1) {
            const disconnectedPlayer = room.players.splice(playerIndex, 1)[0]
            socket.to(roomId).emit('player-disconnected', { name: disconnectedPlayer.name })
            console.log('player-disconnected', { name: disconnectedPlayer.name })
            // Si no quedan jugadores, elimina la sala
            if (room.players.length === 0) {
              delete rooms[roomId]
            }
            break
          }
        }
      } else if (socket.context === 'matchmaking') {
        // El jugador estaba buscando partida en matchmaking
        for (const [wins, players] of Object.entries(playersSearching)) {
          const index = players.findIndex((player) => player.id === socket.id)
          if (index !== -1) {
            players.splice(index, 1) // Eliminar al jugador de la búsqueda
            console.log(`Player ${socket.id} removed from search for ${wins} total wins`)
            break
          }
        }
      } else if (socket.context === 'matchmaking-room') {
        // El jugador estaba en una partida de matchmaking
        for (const roomId in rooms) {
          const room = rooms[roomId]
          const playerIndex = room.players.findIndex((player) => player.id === socket.id)

          if (playerIndex !== -1) {
            const disconnectedPlayer = room.players.splice(playerIndex, 1)[0]
            socket.to(roomId).emit('player-disconnected', { name: disconnectedPlayer.name })
            console.log('player-disconnected', { name: disconnectedPlayer.name })

            // Si no quedan jugadores, elimina la sala
            if (room.players.length === 0) {
              delete rooms[roomId]
            }
            break
          }
        }
      }
    })
  })
}

export default gameSockets
