import { useState, useEffect } from 'react'
import { useNavigationStore } from '../../store/navigation'
import ButtonNavigation from '../common/gameNavigation/ButtonNavigation'
import Game from './Game'
import PlayerLeft from './PlayerLeft'

const GuestRoom = ({ roomManager, socketRef }) => {
  const { selectMatchWins, selectMultiplayerMode } = useNavigationStore()
  const [totalWins, setTotalWins] = useState(1)
  const [gameStarted, setStartGame] = useState(false)
  const [roomId, setRoomId] = useState('')
  const [hasDisconectedPlayer, setHasDisconectedPlayer] = useState(false) // Anunciar si hay un jugador desconectado
  const [disconectedPlayer, setDisconectedPlayer] = useState(null) // Almacenar el jugador desconectado
  const socket = socketRef?.current

  useEffect(() => {
    setTotalWins(roomManager.totalWins)

    socket.on('player-disconnected', ({ name }) => {
      setDisconectedPlayer(name)
      setHasDisconectedPlayer(true)
    })

    // Listener para el evento de incremento/decremento de wins del host de la sala
    socket.on('wins-changed', (room) => {
      setTotalWins(room.totalWins)
    })

    // Listener para el evento de inicio de juego
    socket.on('game-started', (room) => {
      setRoomId(room.id)
      selectMatchWins(room.totalWins)
      setStartGame(true)
    })

    // Cleanup listeners when component unmounts or dependencies change
    return () => {
      socket.off('wins-changed')
      socket.off('start-game')
      socket.off('player-disconected')
    }
  }, [socket])

  const player1 = roomManager.players[0].name
  const player2 = roomManager.players[1].name

  return (
    <>
      {hasDisconectedPlayer ? (
        <PlayerLeft disconectedPlayer={disconectedPlayer} />
      ) : !gameStarted ? (
        <>
          <div className='relative w-full h-full flex flex-col justify-start items-start gap-2'>
            <h2 className='font-semibold'>Match Settings</h2>
            <div className='w-full flex justify-between items-center py-2'>
              <span className='text-2xl'>Number of wins</span>
              <div className='flex justify-center items-center'>
                <span className='w-14 text-2xl text-center'>{totalWins}</span>
              </div>
            </div>
            <div>
              <h3 className='font-semibold'>Players joined</h3>
              <ol className='w-full pl-8 py-2'>
                <li className='list-decimal'>
                  {roomManager.players[0].name} <span className='text-neutral-500'>- X</span>
                </li>
                <li className='list-decimal'>
                  {roomManager.players[1].name} <span className='text-neutral-500'>(you) - O</span>
                </li>
              </ol>
            </div>
            <nav className='w-full absolute bottom-7 flex justify-evenly items-center'>
              <ButtonNavigation action={() => selectMultiplayerMode('menu')} text='Exit' />
              <span className='w-36 text-base text-center text-neutral-500'>Waiting for {player1} to start the match...</span>
            </nav>
          </div>
        </>
      ) : (
        <Game player1={player1} player2={player2} totalWins={totalWins} roomId={roomId} socketRef={socketRef} />
      )}
    </>
  )
}

export default GuestRoom
