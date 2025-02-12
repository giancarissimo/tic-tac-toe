import { useState } from 'react'
import { useNavigationStore } from '../../store/navigation'
import Game from './Game'
import WinsSelector from '../common/gameControls/WinsSelector'
import PlayerInput from '../common/inputs/PlayerInput'
import ButtonNavigaton from '../common/gameNavigation/ButtonNavigation'
import ButtonSelector from '../common/gameControls/ButtonSelector'

const Settings = () => {
  const { gameMode, selectGameMode, selectMatchWins, selectMatchDifficulty } = useNavigationStore()
  const [player1, setPlayer1] = useState('Player 1') // Por default se va a llamar 'Jugador 1'
  const [player2, setPlayer2] = useState('Player 2') // Por default se va a llamar 'Jugador 2'
  const [totalWins, setTotalWins] = useState(1) // Por default va a ser 1
  const [difficulty, setDifficulty] = useState('Easy') // Por default va a estar en 'Easy'
  const [startGame, setStartGame] = useState(false)

  // Dificultades para la ia
  const difficulties = ["Easy", "Medium", "Hard"]

  // Parámetros para pasarle a Game.jsx
  const player1Parameter = gameMode === 'local' ? player1 : 'You'
  const player2Parameter = gameMode === 'local' ? player2 : 'A.I'

  const handleStartGame = () => {
    setStartGame(true) // Empezar el juego
    gameMode === 'ai' && selectMatchDifficulty(difficulty)
    selectMatchWins(totalWins)
  }

  return (
    <>
      {!startGame ? (
        <div className='w-full flex flex-col justify-between items-start gap-4'>
          <h2 className='font-semibold'>Match Settings</h2>
          {gameMode === 'local' && (
            <>
              <PlayerInput playerLabel={'Player 1'} setPlayer={setPlayer1} />
              <PlayerInput playerLabel={'Player 2'} setPlayer={setPlayer2} />
            </>
          )}
          {gameMode === 'ai' && (<ButtonSelector action={setDifficulty} text={'Difficulty'} category={difficulties} index={0} />)}
          <WinsSelector action={setTotalWins} />
          <nav className='w-full flex justify-between items-center mt-7'>
            <ButtonNavigaton action={() => selectGameMode('menu')} text={'Return'} />
            <ButtonNavigaton action={handleStartGame} text={'Start'} />
          </nav>
        </div>
      ) : <Game player1={player1Parameter} player2={player2Parameter} totalWins={totalWins} difficulty={difficulty} />}
    </>
  )
}

export default Settings
