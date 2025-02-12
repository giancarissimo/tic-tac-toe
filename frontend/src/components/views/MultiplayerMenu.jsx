import { useNavigationStore } from '../../store/navigation'
import ButtonMenu from '../common/gameNavigation/ButtonMenu'
import Matchmaking from './Matchmaking'
import PrivateOptions from './PrivateOptions'
import Account from './Account'
import SignIn from './SignIn'
import SignUp from './SignUp'

const MultiplayerMenu = () => {
  const { selectGameMode, multiplayerMode, selectMultiplayerMode } = useNavigationStore()

  const multiplayerBtns = [
    { text: 'Vs friend', mode: 'private', info: 'Create a private room' },
    { text: 'Matchmaking', mode: 'matchmaking', info: 'Random match, random player' },
    { text: 'Account', mode: 'account', info: 'Watch account details' },
    { text: 'Return', mode: 'menu', info: 'Go back to Main Menu' }
  ]

  return (
    <>
      {multiplayerMode === 'menu' && (
        <nav className="w-full">
          <ul className="w-full flex flex-col justify-start items-start gap-5">
            {
              multiplayerBtns.map((button, index) => (
                <ButtonMenu
                  key={index}
                  text={button.text}
                  action={button.mode === 'menu' ? () => selectGameMode('menu') : () => selectMultiplayerMode(button.mode)}
                  info={button.info}
                />
              ))
            }
          </ul>
        </nav>
      )}
      {multiplayerMode === 'private' && (<PrivateOptions />)}
      {multiplayerMode === 'matchmaking' && (<Matchmaking />)}
      {multiplayerMode === 'account' && (<Account />)}
      {multiplayerMode === 'signin' && (<SignIn />)}
      {multiplayerMode === 'signup' && (<SignUp />)}
    </>
  )
}

export default MultiplayerMenu
