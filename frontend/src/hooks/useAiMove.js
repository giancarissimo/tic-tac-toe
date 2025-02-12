import { useEffect } from 'react'
import { calculateWinner } from '../utils/GameLogic'
import { calculateAiMoveEasy, calculateAiMoveMedium, calculateAiMoveHard } from '../utils/AiLogic'

// Movimiento de IA y ejecución de dificultades
export const useAiMove = ({ gameMode, difficulty, squares, setSquares, isXNext, setIsXNext, winner }) => {
  useEffect(() => {
    if (gameMode === 'ai' && !isXNext && !winner) {
      let aiMove

      if (difficulty === 'Easy') {
        aiMove = calculateAiMoveEasy(squares)
      } else if (difficulty === 'Medium') {
        aiMove = calculateAiMoveMedium(squares, isXNext)
      } else {
        aiMove = calculateAiMoveHard(squares, isXNext)
      }

      const aiMoveTimeout = setTimeout(() => {
        // Verificar si hay ganador o si el tablero está lleno antes de que la IA haga su movimiento
        const currentWinner = calculateWinner(squares)
        const isBoardFull = squares.every(square => square !== null)

        if (!currentWinner && !isBoardFull && aiMove !== null && squares[aiMove] === null) {
          const newSquares = [...squares]
          newSquares[aiMove] = 'O' // IA pone 'O' automáticamente
          setSquares(newSquares)
          setIsXNext(true) // Cambiar el turno de vuelta al jugador humano ('X')
        }
      }, 1000) // Simular retraso de la IA
      return () => clearTimeout(aiMoveTimeout) // Limpiar el timeout si el componente se desmonta o si el turno cambia
    }
  }, [gameMode, difficulty, squares, isXNext, winner])
}
