import { useState } from 'react'

export const useRoundManager = (setSquares, setWinner, setWinningLineClass, setIsXNext, isPaused, setIsPaused) => {
  const [round, setRound] = useState(0)

  const resetGame = () => {
    setSquares(Array(9).fill(null)) // Se vacían los cuadrados ya marcados
    setWinner(null) // Se reinicia el ganador
    setWinningLineClass(null) // Se borra la linea ganadora
    setIsXNext(round % 2 === 0) // Se alterna el turno si la ronda es par o impar
    if (isPaused) setIsPaused(false) // Quitar el menú de pausa
  }

  const newRound = () => {
    resetGame()
    setRound(prevRound => {
      const nextRound = prevRound + 1
      setIsXNext(nextRound % 2 === 0) // Se Cambia el turno basado en el nuevo número de ronda
      return nextRound
    })
  }

  return { resetGame, newRound }
}
