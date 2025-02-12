import { useEffect, useState } from "react"
import { useNavigationStore } from "../../store/navigation"
import { useUserStore } from "../../store/user"
import { postData } from "../../utils/PostData"
import envconfig from "../../config/env.config"
import ButtonNavigation from "../common/gameNavigation/ButtonNavigation"
import ArrowButton from "../common/gameNavigation/ArrowButton"

const Account = () => {
  const { api_logout } = envconfig
  const { selectMultiplayerMode } = useNavigationStore()
  const { isLogged, user, logout } = useUserStore()
  const [stats, setStats] = useState({ totalWins: 0, totalLooses: 0, winRate: 0, })
  const [watchStats, setWatchStats] = useState(false)

  useEffect(() => {
    if (!isLogged) {
      selectMultiplayerMode('signin')
    }
  }, [isLogged])

  const handleLogOut = () => {
    postData(api_logout, null, 'GET')
      .then(data => {
        if (data.status === 'Success') {
          selectMultiplayerMode('menu')
          logout()
        }
      })
  }

  useEffect(() => {
    if (user?.matches?.length > 0) {
      const matches = user.matches

      // Filtrar las partidas donde el usuario es Player1 o Player2
      const userMatches = matches.filter(
        (match) => match.player1.name === user.username || match.player2.name === user.username
      )

      // Contar victorias
      const totalWins = userMatches.reduce((count, match) => {
        if (match.winner === user.username) {
          return count + 1
        }
        return count
      }, 0)

      // Contar derrotas
      const totalLooses = userMatches.reduce((count, match) => {
        if (match.winner !== user.username) {
          return count + 1
        }
        return count
      }, 0)

      // Calcular win rate
      const totalMatches = userMatches.length
      const winRate = totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0

      // Actualizar el estado
      setStats({ totalWins, totalLooses, winRate: winRate.toFixed(2) })
    }
  }, [user])

  return (
    <>
      {user && (
        <>
          {!watchStats ? (
            <div className="relative w-full h-full flex flex-col gap-4">
              <div>
                <h2>Hi, {user.username}</h2>
                <span className="font-light">It's good to see you!</span>
              </div>
              <span>Performance Overview</span>
              <div className="w-full flex flex-col justify-center items-center gap-4">
                <div className="w-full flex justify-evenly items-center">
                  <div className="flex flex-col justify-center items-center font-light">
                    <span>{stats.totalWins}</span>
                    <span>wins</span>
                  </div>
                  <div className="flex flex-col justify-center items-center font-light">
                    <span>{stats.totalLooses}</span>
                    <span>looses</span>
                  </div>
                  <div className="flex flex-col justify-center items-center font-light">
                    <span>{stats.winRate}%</span>
                    <span>winrate</span>
                  </div>
                </div>
                <button onClick={() => setWatchStats(true)} className="font-light text-sky-500 hover:underline">See More Insights</button>
              </div>
              <nav className="absolute bottom-7 w-full flex justify-between items-center">
                <ButtonNavigation action={() => selectMultiplayerMode('menu')} text={'Return'} />
                <button onClick={handleLogOut} className="text-red-700 hover:underline">Sign out</button>
              </nav>
            </div>
          ) : (
            <div className="w-full h-full">
              <div className="w-full h-full flex flex-col gap-2">
                <h2 className="font-semibold">Match History</h2>
                <div className="w-full h-72 flex flex-col justify-start items-start gap-4 overflow-y-scroll scrollbar">
                  {user.matches.map((match, index) => (
                    <div key={index} className="flex flex-col justify-center items-center gap-2">
                      <span className="w-full text-lg text-left">{new Date(match.date).toLocaleDateString()}</span>
                      <span>Room {match.roomId} - {match.public === true ? 'Matchmaking' : 'Private'}</span>
                      <span><span className={match.winner === match.player1.name ? 'bg-green-400 px-1' : ''}>{match.player1.name}</span> vs <span className={match.winner === match.player2.name ? 'bg-green-400 px-1' : ''}>{match.player2.name}</span></span>
                      <span>{match.player1.wins} - {match.player2.wins}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ArrowButton action={() => setWatchStats(false)} />
            </div >
          )}
        </>
      )}
    </>
  )
}

export default Account
