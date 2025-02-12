import { useNavigationStore } from '../../store/navigation'
import { useState } from 'react'
import Game from './Game'
import ButtonNavigation from '../common/gameNavigation/ButtonNavigation'

const MatchFinished = ({ matchWinner, player1, player2, totalWins, difficulty, handleReturn }) => {
  const { gameMode } = useNavigationStore()
  const [restarted, setRestarted] = useState(false)

  const handleRestart = () => {
    setRestarted(true)
  }

  return (
    <>
      {!restarted ? (
        <div className='w-full h-full flex flex-col justify-center items-center text-center gap-4 mb-4'>
          {gameMode === 'local' && (<h1 className='text-3xl'>{`${matchWinner} has won the match!`}</h1>)}
          {gameMode === 'ai' && (<h1 className='text-3xl'>{matchWinner === player2 ? 'A.I has won the match!' : 'You have won the match!'}</h1>)}
          <nav className='w-full flex justify-around items-center'>
            <ButtonNavigation action={handleRestart} text={'Play again'} />
            <ButtonNavigation action={handleReturn} text={'Exit'} />
          </nav>
        </div>
      ) : <Game player1={player1} player2={player2} totalWins={totalWins} difficulty={difficulty} />}
    </>
  )
}

export default MatchFinished
