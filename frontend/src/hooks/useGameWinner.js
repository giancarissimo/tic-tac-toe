import { useEffect } from "react"
import { calculateWinner, getWinningLineClass } from "../utils/GameLogic"

// Establecer ganador (de ronda o de partida)
export const useGameWinner = ({ roomId, socket, gameMode, squares, player1, player2, totalWins, winner, setWinner, setPlayer1Wins, setPlayer2Wins, setMatchWinner, newRound, setWinningLineClass, launchConfetti }) => {

  useEffect(() => {
    const gameWinner = calculateWinner(squares)
    const isBoardFull = squares.every(square => square !== null)

    if (gameWinner) {
      const { winner, line } = gameWinner
      setWinner(winner) // Establecer el ganador de la ronda
      setWinningLineClass(getWinningLineClass(line))

      if (winner === 'X') {
        if (gameMode === 'multiplayer') {
          socket.emit('round-winner', { roomId, winner })
        } else {
          setPlayer1Wins(prevPlayer1Wins => {
            const newWins = prevPlayer1Wins + 1
            if (newWins === totalWins) {
              setTimeout(() => {
                setMatchWinner(player1)
                launchConfetti()
              }, 1500) // Establecer el ganador de la partida después de 1 segundo
            }
            return newWins
          })
        }
      }

      if (winner === 'O') {
        if (gameMode === 'multiplayer') {
          socket.emit('round-winner', { roomId, winner })
        } else {
          setPlayer2Wins(prevPlayer2Wins => {
            const newWins = prevPlayer2Wins + 1
            if (newWins === totalWins) {
              setTimeout(() => {
                setMatchWinner(player2)
                launchConfetti()
              }, 1500) // Establecer el ganador de la partida después de 1 segundo
            }
            return newWins
          })
        }
      }

      setTimeout(() => {
        // Emitir evento de limpieza al backend antes de llamar a newRound
        if (gameMode === 'multiplayer') {
          socket.emit('new-round', { roomId })
          console.log('se emitió un evento de reinicio de ronda')
        } else {
          newRound()
        }
      }, 1500) // Reiniciar automáticamente después de 1.5 segundos

    } else if (isBoardFull && !winner) { // Reiniciar después de 1.5 segundos en caso de empate
      setWinner('Draw')
      setTimeout(() => {
        if (gameMode === 'multiplayer') {
          socket.emit('round-draw', { roomId, winner: 'Draw' })
          console.log('se emitió un evento de empate')
        } else {
          newRound()
        }
      }, 1500)
    }
  }, [squares, player1, player2, totalWins])
}
