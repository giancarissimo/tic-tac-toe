import { useState, useEffect } from 'react'
import { generateRoomId } from '../../utils/Token'
import { useNavigationStore } from '../../store/navigation'
import WinsSelector from '../common/gameControls/WinsSelector'
import ButtonNavigation from '../common/gameNavigation/ButtonNavigation'
import RoomInfo from './RoomInfo'
import Game from './Game'

const OwnerRoom = ({ socketRef, playerName, userId }) => {
  const { gameMode, selectMultiplayerMode, selectMatchWins } = useNavigationStore()
  const [roundWins, setRoundWins] = useState(1)
  const [roundInfoShow, setRoundInfoShow] = useState(false)
  const [player2, setPlayer2] = useState(null) // Player 2’s name
  const [isPlayer2Joined, setIsPlayer2Joined] = useState(false) // Track if Player 2 has joined
  const [gameStarted, setStartGame] = useState(false)
  const [roomState, setRoomState] = useState(null)
  const [roomId, setRoomId] = useState(generateRoomId()) // Estado para almacenar el ID de la sala
  const [hasDisconectedPlayer, setHasDisconectedPlayer] = useState(false) // Anunciar si hay un jugador desconectado
  const [disconectedPlayer, setDisconectedPlayer] = useState(null) // Almacenar el jugador desconectado
  const socket = socketRef?.current

  // Emit create-room event when player 1 (host) opens the room
  useEffect(() => {
    socket.emit('create-room', { roomId, playerName, userId })

    socket.on('player-joined', ({ player2Name }) => {
      setPlayer2(player2Name)
      setIsPlayer2Joined(true) // Permite al player 1 empezar la partida
    })

    socket.on('wins-changed', (room) => {
      setRoomState(room)
      setRoundWins(room.totalWins)
    })

    socket.on('player-disconnected', ({ name }) => {
      setDisconectedPlayer(name)
      setHasDisconectedPlayer(true)
      setTimeout(() => {
        setIsPlayer2Joined(false)
        setPlayer2(null)
        setHasDisconectedPlayer(false)
      }, 2500)
    })

    return () => {
      socket.off('create-room')
      socket.off('player-joined')
      socket.off('wins-changed')
      socket.off('player-disconected')
    }
  }, [socket])

  useEffect(() => {
    if (gameMode === 'multiplayer' && socketRef.current !== null && roomState?.wins !== roundWins) {
      socket.emit('change-wins', { roomId, totalWins: roundWins })
    }
  }, [roundWins])

  const startGame = (roomId) => {
    setStartGame(true) // Empezar el juego
    selectMatchWins(roundWins) // Asignar la cantidad de rondas
    socket.emit('start-game', { roomId }) // Emitir evento de inicio de juego
  }

  const player1 = playerName

  return (
    <>
      {!gameStarted ? (
        <>
          {!roundInfoShow ? (
            <div className="w-full flex flex-col justify-between items-start gap-2">
              <h2 className='font-semibold'>Match Settings</h2>
              <WinsSelector action={setRoundWins} />
              <div>
                <h2 className='font-semibold'>Players joined</h2>
                <ol className="w-full pl-8 py-2">
                  <li className="list-decimal">
                    {player1} <span className="text-neutral-500">(you) - X</span>
                  </li>
                  {isPlayer2Joined ? (
                    hasDisconectedPlayer ? (
                      <li className="list-decimal text-red-600">
                        {disconectedPlayer} has disconnected
                      </li>
                    ) : (
                      <li className="list-decimal">
                        {player2} <span className="text-neutral-500">- O</span>
                      </li>
                    )
                  ) : (
                    <li className="list-decimal text-neutral-500">Waiting for player...</li>
                  )}
                </ol>
              </div>
              <p className="text-xl mt-7"> <span className='font-semibold'>P.S:</span> To invite a friend please check the <button onClick={setRoundInfoShow} className="underline text-sky-500 cursor-pointer">room info.</button></p>
              <nav className="w-full flex justify-between items-start mt-7">
                <ButtonNavigation action={() => selectMultiplayerMode('menu')} text={'Exit'} />
                {!hasDisconectedPlayer && isPlayer2Joined && (<ButtonNavigation action={() => startGame(roomId)} text="Start" />)}
              </nav>
            </div>
          ) : (
            <RoomInfo setRoundInfoShow={setRoundInfoShow} roomId={roomId} />
          )}
        </>
      ) : (
        <Game roomId={roomId} totalWins={roundWins} player1={playerName} player2={player2} socketRef={socketRef} />
      )}
    </>
  )
}

export default OwnerRoom
