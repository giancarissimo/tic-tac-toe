import { useEffect } from 'react'
import { launchConfetti } from '../utils/Confetti'

export const useMultiplayerSocket = ({ gameMode, socket, setDisconectedPlayer, setHasDisconectedPlayer, setSquares, setIsXNext, setWinner, setPlayer1Wins, setPlayer2Wins, setMatchWinner, setWinningLineClass, }) => {
  useEffect(() => {
    if (gameMode === 'multiplayer' && socket) {
      const handlePlayerDisconnected = ({ name }) => {
        setDisconectedPlayer(name)
        setHasDisconectedPlayer(true)
      }

      const handlePlayerMoved = ({ squares, isXNext }) => {
        setSquares(squares)
        setIsXNext(isXNext)
      }

      const handleWinnerRound = ({ winner, isXNext, player1Wins, player2Wins, squares }) => {
        setWinner(winner)
        setIsXNext(isXNext)
        setPlayer1Wins(player1Wins)
        setPlayer2Wins(player2Wins)
        setTimeout(() => {
          setSquares(squares)
          setWinner(null)
          setWinningLineClass(null)
        }, 1500)
      }

      const handleRoundDrawed = ({ squares, isXNext }) => {
        setTimeout(() => {
          setIsXNext(isXNext)
          setSquares(squares)
          setWinner(null)
          setWinningLineClass(null)
        }, 1500)
      }

      const handleGameOver = ({ winner }) => {
        setTimeout(() => {
          setMatchWinner(winner)
          launchConfetti()
        }, 1500)
      }

      // Registrar los eventos
      socket.on('player-disconnected', handlePlayerDisconnected)
      socket.on('player-moved', handlePlayerMoved)
      socket.on('winner-round', handleWinnerRound)
      socket.on('round-drawed', handleRoundDrawed)
      socket.on('game-over', handleGameOver)

      return () => {
        // Limpiar los eventos al desmontar
        socket.off('player-disconnected', handlePlayerDisconnected)
        socket.off('player-moved', handlePlayerMoved)
        socket.off('winner-round', handleWinnerRound)
        socket.off('round-drawed', handleRoundDrawed)
        socket.off('game-over', handleGameOver)
      }
    }
  }, [socket])
}
