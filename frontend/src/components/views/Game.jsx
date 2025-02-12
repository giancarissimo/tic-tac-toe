import { useState, useEffect } from 'react'
import { useNavigationStore } from '../../store/navigation'
import { usePause } from '../../hooks/usePause'
import { useAiMove } from '../../hooks/useAiMove'
import { useGameWinner } from '../../hooks/useGameWinner'
import { useRoundManager } from '../../hooks/useRoundManager'
import { useMultiplayerSocket } from '../../hooks/useMultiplayerSocket'
import { getRoundStatus } from '../../utils/GameLogic'
import { launchConfetti } from '../../utils/Confetti'
import Board from '../common/gameBoard/Board'
import PauseButton from '../common/gameNavigation/PauseButton'
import PauseMenu from './PauseMenu'
import PlayerLeft from './PlayerLeft'
import MatchFinished from './MatchFinished'
import MatchFinishedMultiplayer from './MatchFinishedMultiplayer'

const Game = ({ player1, player2, totalWins, difficulty, roomId, socketRef }) => {
  const { gameMode } = useNavigationStore()
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true) // Turno del jugador
  const [player1Wins, setPlayer1Wins] = useState(0) // Victorias del jugador 1
  const [player2Wins, setPlayer2Wins] = useState(0) // Victorias del jugador 2
  const [winner, setWinner] = useState(null) // Controlar el ganador de la ronda
  const [winningLineClass, setWinningLineClass] = useState(null) // Almacenar la línea ganadora
  const [matchWinner, setMatchWinner] = useState(null) // Si hay un ganador de la partida (por llegar a N cantidad de wins)
  const [hasDisconectedPlayer, setHasDisconectedPlayer] = useState(false) // Anunciar si hay un jugador desconectado
  const [disconectedPlayer, setDisconectedPlayer] = useState(null) // Almacenar el jugador desconectado
  const socket = socketRef?.current // Se deja instanciado el socket

  const handleClick = (index) => {
    // Bloquear clics en el turno de la IA en modo "local vs ai"
    if (gameMode === 'ai' && !isXNext) return

    // Bloquear clics si la casilla ya está ocupada o si ya hay un ganador
    if (squares[index] || winner) return

    // Validación adicional en modo multijugador
    if (gameMode === 'multiplayer') {
      // Determinar el símbolo del jugador actual
      const playerSymbol = isXNext ? 'X' : 'O'

      // Emitir movimiento al backend si es válido
      socket.emit('player-move', { roomId, index, playerSymbol })
      return
    }

    if (gameMode !== 'multiplayer') {
      // Actualizar el tablero y el turno localmente (para visualización instantánea)
      const newSquares = [...squares]
      newSquares[index] = isXNext ? 'X' : 'O'
      setSquares(newSquares)
      setIsXNext(!isXNext)
    }
  }

  // Custom hook para manejar el menu de pausa
  const { isPaused, setIsPaused, togglePause, handleResume, handleReturn } = usePause()

  // Custom hook para manejar el comportamiento de finalización de c/ronda
  const { resetGame, newRound } = useRoundManager(setSquares, setWinner, setWinningLineClass, setIsXNext, isPaused, setIsPaused)

  // Custom hook para el ganador de la ronda (o de la partida)
  useGameWinner({ roomId, socket, gameMode, squares, player1, player2, totalWins, winner, setWinner, setPlayer1Wins, setPlayer2Wins, setMatchWinner, newRound, setWinningLineClass, launchConfetti })

  // Custom hook para el movimiento de la IA (si el modo de juego es vs IA)
  useAiMove({ gameMode, difficulty, squares, setSquares, isXNext, setIsXNext, winner })

  // Custom hook para el manejo de los eventos de socket en multiplayer
  useMultiplayerSocket({ gameMode, socket, setDisconectedPlayer, setHasDisconectedPlayer, setSquares, setIsXNext, setWinner, setPlayer1Wins, setPlayer2Wins, setMatchWinner, setWinningLineClass })

  const status = getRoundStatus(winner, player1, player2, isXNext)

  return (
    <>
      {hasDisconectedPlayer ? (
        <PlayerLeft handleReturn={handleReturn} disconectedPlayer={disconectedPlayer} />
      ) : matchWinner ? (
        gameMode === 'multiplayer' ? (
          <MatchFinishedMultiplayer matchWinner={matchWinner} socketRef={socketRef} roomId={roomId} />
        ) : (
          <MatchFinished handleReturn={handleReturn} matchWinner={matchWinner} player1={player1} player2={player2} totalWins={totalWins} difficulty={difficulty} />
        )) : isPaused ? (
          <PauseMenu handleResume={handleResume} resetGame={resetGame} handleReturn={handleReturn} />
        ) : (
        <div className="w-full flex flex-col justify-center items-center gap-4">
          <PauseButton action={togglePause} />
          <h2 className="w-full font-semibold text-2xl text-center">{`${player1} vs ${player2}`}</h2>
          <Board squares={squares} onClick={handleClick} winningLineClass={winningLineClass} />
          <h3 className="font-semibold text-2xl text-center">{status}</h3>
          <span className="font-semibold text-2xl text-center">{player1Wins} - {player2Wins}</span>
        </div>
      )}
    </>
  )
}

export default Game
