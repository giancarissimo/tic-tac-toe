import { useNavigationStore } from '../../store/navigation'
import ButtonPauseMenu from '../common/gameNavigation/ButtonPauseMenu'

const PauseMenu = ({ handleResume, resetGame, handleReturn }) => {
  const { gameMode } = useNavigationStore()
  const option = gameMode === 'multiplayer' ? 'Return to online menu' : 'Return to main menu'

  return (
    <section className="w-full flex flex-col justify-center items-start gap-2">
      <h2 className="font-semibold text-2xl mb-1">Pause Menu</h2>
      <ButtonPauseMenu action={handleResume} text={'Resume game'} />
      {gameMode !== 'multiplayer' && <ButtonPauseMenu action={resetGame} text={'Restart round'} />}
      <ButtonPauseMenu action={handleReturn} text={option} />
    </section>
  )
}

export default PauseMenu
