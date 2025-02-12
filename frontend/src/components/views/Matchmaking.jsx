import { useNavigationStore } from '../../store/navigation'
import { useUserStore } from '../../store/user'
import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import envconfig from '../../config/env.config'
import Input from '../common/inputs/Input'
import Timer from '../common/timer/Timer'
import Game from '../views/Game'
import Dropdown from '../common/inputs/Dropdown'
import FormButton from '../common/gameNavigation/FormButton'
import ArrowButton from '../common/gameNavigation/ArrowButton'

const Matchmaking = () => {
  const { socket_url } = envconfig
  const { selectMultiplayerMode, selectMatchWins } = useNavigationStore()
  const { isLogged, user } = useUserStore()
  const [errors, setErrors] = useState({})
  const [playerName, setPlayerName] = useState(isLogged ? user.username : null)
  const [totalWins, setTotalWins] = useState(null)
  const [status, setStatus] = useState('idle') // 'idle', 'searching', 'matched', 'timeout'
  const [message, setMessage] = useState('')
  const [roomId, setRoomId] = useState(null)
  const [player1, setPlayer1] = useState(null)
  const [player2, setPlayer2] = useState(null)
  const socketRef = useRef(null)

  const validateFields = () => {
    const newErrors = {}

    if (!playerName) {
      newErrors.username = 'Username is required'
    } else if (playerName.length < 2) {
      newErrors.username = 'Username must have at least 2 characters'
    }

    if (!totalWins) {
      newErrors.totalWins = 'Wins is required'
    }

    return newErrors
  }

  useEffect(() => {
    // Validación dinámica en tiempo real
    const newErrors = validateFields()
    setErrors(newErrors)
  }, [playerName, totalWins])

  // Instanciar el socket al montar el componente
  useEffect(() => {
    // Crear y conectar el socket
    socketRef.current = io(socket_url, {
      withCredentials: true, // Permitir el envío de cookies
    })

    // Escuchar eventos del servidor
    socketRef.current.on('matched', ({ roomId, players, opponent, totalWins }) => {
      setRoomId(roomId)
      setPlayer1(players[0].name)
      setPlayer2(players[1].name)
      selectMatchWins(totalWins)
      setStatus('matched')
    })

    socketRef.current.on('search-timeout', (message) => {
      setMessage(message)
      setStatus('timeout')
      setPlayerName(isLogged ? user.username : null)
      setTotalWins(null)
    })

    // Limpiar el socket al desmontar el componente
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  const handleSearch = () => {
    const inputErrors = validateFields()

    if (Object.keys(inputErrors).length > 0) {
      return setErrors(inputErrors)
    }

    setStatus('searching')
    socketRef.current.emit('search-game', { playerName, totalWins, userId: user?.id })
  }

  const handleCancel = () => {
    if (status === 'searching') {
      socketRef.current.emit('cancel-search')
      setStatus('idle')
      setPlayerName(isLogged ? user.username : null)
      setTotalWins(null)
    }
  }

  return (
    <>
      {status === 'idle' && (
        <>
          <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-auto flex flex-col justify-center items-start'>
              <div>
                <h2 className='font-semibold'>Seek and you shall find</h2>
                <p className='font-light'>Search for an opponent</p>
              </div>
              <div className='flex flex-col justify-center items-start'>
                <span className='h-6 text-lg text-red-700'>{errors.username && errors.username}</span>
                <Input action={setPlayerName} id={'username'} type={'text'} placeholder={'Username'} value={isLogged ? user.username : undefined} />
              </div>
              <div className='flex flex-col justify-center items-start mb-5'>
                <span className='h-6 text-lg text-red-700'>{errors.totalWins && errors.totalWins}</span>
                <Dropdown action={setTotalWins} text={'Total Wins'} type={totalWins} />
              </div>
              <FormButton action={handleSearch} text={'Search'} />
            </div>
          </div>
          <ArrowButton action={() => selectMultiplayerMode('menu')} />
        </>
      )}
      {status === 'searching' && (
        <div className='w-full h-full flex flex-col justify-center items-center gap-2'>
          <h2 className='text-3xl'>Searching for opponent...</h2>
          <Timer />
          <button onClick={handleCancel} className='text-red-700 underline'>Cancel</button>
        </div>
      )}
      {status === 'timeout' && (
        <div className='w-full h-full flex flex-col justify-center items-center gap-2'>
          <span className='text-3xl'>{message}</span>
          <button onClick={() => setStatus('idle')} className='text-sky-500 underline'>Go back</button>
        </div>
      )}
      {status === 'matched' && <Game roomId={roomId} totalWins={totalWins} player1={player1} player2={player2} socketRef={socketRef} />}
    </>
  )
}

export default Matchmaking
