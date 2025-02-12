import { useEffect, useState } from 'react'
import { useNavigationStore } from '../../store/navigation'
import ButtonNavigation from '../common/gameNavigation/ButtonNavigation'
import ButtonSelector from '../common/gameNavigation/ButtonSelector'
import Game from './Game'

const MatchFinishedMultiplayer = ({ matchWinner, roomId, socketRef }) => {
  const { selectMultiplayerMode, selectMatchWins } = useNavigationStore()
  const [next, setNext] = useState(false) // Si está en true, pasa a la fase de votación
  const [isMatchResetted, setIsMatchResetted] = useState(false) // Si es true, volvemos a Game.jsx
  const [isSelected, setIsSelected] = useState(false) // Si se selecciona un botón (selected = true), no se va a poder seleccionar otro
  const [votes, setVotes] = useState(null) // Almacena la cantidad de votos para tomar una decisión
  const [voteStatus, setVoteStatus] = useState('waiting') // En base al tipo de voto, se le comunica al cliente una acción determinada
  const [timer, setTimer] = useState(null)
  const socket = socketRef?.current

  // Si se reinicia la partida
  const [player1, setPlayer1] = useState(null)
  const [player2, setPlayer2] = useState(null)
  const [totalWins, setTotalWins] = useState(null)

  useEffect(() => {
    // Escuchar las actualizaciones de votos
    socket.on('vote-update', (updatedVotes) => {
      setVotes(updatedVotes)
    })

    // Manejar reinicio de partida
    socket.on('match-resetted', (data) => {
      setPlayer1(data.player1)
      setPlayer2(data.player2)
      setTotalWins(data.totalWins)
      setVoteStatus('match-resetted')
      startTimer(5, () => {
        setIsMatchResetted(true)
      })
    })

    // Manejar salida de partida
    socket.on('exit-match', () => {
      setVoteStatus('exit-match')
      startTimer(5, handleReset)
    })

    return () => {
      socket.off('vote-update')
      socket.off('match-resetted')
      socket.off('exit-match')
    }
  }, [socket])

  const startTimer = (duration, callback) => {
    setTimer(duration) // Inicia el temporizador
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval) // Detén el temporizador cuando llegue a 0
          callback() // Ejecuta la acción
          return null
        }
        return prev - 1 // Decrementa el temporizador
      })
    }, 1000)
  }

  const handleReset = () => {
    selectMultiplayerMode('menu')
    selectMatchWins(null)
  }

  const handleNext = () => {
    setNext(true)
  }

  const handleVote = (vote) => {
    socket.emit('match-votes', { roomId, vote })
  }

  return (
    <>
      {!isMatchResetted ? (
        !next ? (
          <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            <h2 className="text-4xl">Match Finished</h2>
            <h2 className="text-4xl">{matchWinner} wins!</h2>
            <nav>
              <ButtonNavigation action={handleNext} text={'Next'} />
            </nav>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center gap-8">
            <div className="flex flex-col justify-center items-start gap-4">
              <h2>Now, what do you want to do?</h2>
              <div className="w-full flex flex-col justify-center items-start gap-4">
                <div className="w-full flex justify-between items-center">
                  <ButtonSelector action={() => handleVote('play again')} text={'Play Again'} isSelected={isSelected} setIsSelected={setIsSelected} />
                  <span className="text-xl text-neutral-500">{votes && `${votes.playAgain}/2 votes`}</span>
                </div>
                <div className="w-full flex justify-between items-center">
                  <ButtonSelector action={() => handleVote('exit')} text={'Exit'} isSelected={isSelected} setIsSelected={setIsSelected} />
                  <span className="text-xl text-neutral-500">{votes && `${votes.exit}/2 votes`}</span>
                </div>
              </div>
            </div>
            {voteStatus === 'waiting' && (<span className="text-xl">Waiting for players vote ...</span>)}
            {voteStatus === 'match-resetted' && (<span className="text-xl">Restarting match in {timer}s ...</span>)}
            {voteStatus === 'exit-match' && (<span className="text-xl">Leaving the game in {timer}s ...</span>)}
          </div>
        )) : (
        <Game player1={player1} player2={player2} totalWins={totalWins} roomId={roomId} socketRef={socketRef} />
      )}
    </>
  )
}

export default MatchFinishedMultiplayer
