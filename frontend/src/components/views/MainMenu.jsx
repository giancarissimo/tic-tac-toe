import { useNavigationStore } from '../../store/navigation'
import { useUserStore } from '../../store/user'
import { useContext, useEffect, Suspense, lazy } from 'react'
import { ThemeContext } from '/src/context/ThemeContext'
import envconfig from '../../config/env.config'
import ButtonMenu from '../common/gameNavigation/ButtonMenu'
import TextLoader from '../common/loaders/TextLoader'

// Lazy loading para componentes pesados
const Settings = lazy(() => import('./Settings'))
const MultiplayerMenu = lazy(() => import('./MultiplayerMenu'))
const GeneralOptions = lazy(() => import('./GeneralOptions'))
const About = lazy(() => import('./About'))

function MainMenu() {
  const { api_validate_session } = envconfig
  const { isDarkMode } = useContext(ThemeContext)
  const { gameMode, selectGameMode, multiplayerMode, matchWins, matchDifficulty } = useNavigationStore()
  const { isLogged, setUser, logout } = useUserStore()

  const gameModeHeader = {
    menu: 'Main Menu',
    local: 'Local mode - 1vs1',
    ai: 'Local mode - vs AI',
    multiplayer: 'Multiplayer mode',
    options: 'Options',
    about: 'About'
  }

  const multiplayerModeText = {
    menu: 'Menu',
    private: 'Vs friend',
    matchmaking: 'Matchmaking',
    account: 'My account',
    signin: 'Sign in',
    signup: 'Sign up',
  }

  const buttons = [
    { text: 'Local 1vs1', mode: 'local', info: 'Play against a local friend' },
    { text: 'Local vs AI', mode: 'ai', info: 'Compete against the computer AI' },
    { text: 'Multiplayer', mode: 'multiplayer', info: 'Challenge friends or random players' },
    { text: 'Options', mode: 'options', info: 'Modify the game theme', },
    { text: 'About', mode: 'about', info: 'Learn more about the game' }
  ]

  useEffect(() => {
    if (!isLogged) {
      const checkSession = async () => {
        try {
          const response = await fetch(api_validate_session, {
            method: 'GET',
            credentials: 'include',
          })
          const data = await response.json()
          if (data.status === 'Success') {
            setUser({
              id: data.user._id,
              username: data.user.username,
              email: data.user.email,
              matches: data.user.matches
            })
          } else {
            logout()
          }
        } catch (error) {
          logout()
        }
      }
      checkSession()
    }
  }, [isLogged])

  return (
    <>
      <div id="bg-game" className="w-full h-full flex justify-center items-center">
        <main
          className={`relative w-full max-w-[25.75rem] min-w-[18.75rem] h-[32.1875rem] ${!isDarkMode ? 'bg-[#FDFD96]' : 'dark:background-dark'
            } ${!isDarkMode ? 'note-yellow' : ''} ${!isDarkMode ? 'shadow-note-shadow' : ''
            } p-6 font-light font-handDrawn text-2xl text-blue-900 dark:text-[#CECECE]`}
        >
          <section className="w-full h-full flex flex-col justify-start items-start gap-8">
            <header>
              <h1 className="text-3xl font-bold">Tic-Tac-Toe</h1>
              <span className="text-xl font-semibold text-neutral-500">
                {gameModeHeader[gameMode]}{' '}
                {gameMode === 'multiplayer' &&
                  `- ${multiplayerModeText[multiplayerMode]}`}{' '}
                {gameMode === 'ai' && matchDifficulty && `- ${matchDifficulty}`}{' '}
                {matchWins && `- ${matchWins} wins`}
              </span>
            </header>
            {gameMode === 'menu' && (
              <>
                <nav className="w-full">
                  <ul className="w-full flex flex-col justify-start items-center gap-5">
                    {buttons.map((button, index) => (
                      <ButtonMenu
                        key={index}
                        text={button.text}
                        action={() => selectGameMode(button.mode)}
                        info={button.info}
                      />
                    ))}
                  </ul>
                </nav>
                <footer
                  className={`absolute ${!isDarkMode ? 'bottom-1' : 'bottom-2'
                    } self-center font-semibold text-neutral-500`}
                >
                  <span className="text-xl">
                    Made by giancarissimo - v1.0.0
                  </span>
                </footer>
              </>
            )}
            {(gameMode === 'local' || gameMode === 'ai') && (
              <Suspense fallback={<TextLoader text={'Loading match settings'} />}>
                <Settings />
              </Suspense>
            )}
            {gameMode === 'multiplayer' && (
              <Suspense fallback={<TextLoader text={'Loading multiplayer menu'} />}>
                <MultiplayerMenu />
              </Suspense>
            )}
            {gameMode === 'options' && (
              <Suspense fallback={<TextLoader text={'Loading game settings'} />}>
                <GeneralOptions />
              </Suspense>
            )}
            {gameMode === 'about' && (
              <Suspense fallback={<TextLoader text={'Loading game info'} />}>
                <About />
              </Suspense>
            )}
          </section>
        </main>
      </div>
    </>
  )
}

export default MainMenu
