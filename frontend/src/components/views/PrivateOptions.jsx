import { useNavigationStore } from '../../store/navigation'
import { useUserStore } from '../../store/user'
import { useState, useRef, useEffect } from 'react'
import { io } from 'socket.io-client'
import envconfig from '../../config/env.config'
import OwnerRoom from './OwnerRoom'
import GuestRoom from './GuestRoom'
import JoinRoom from './JoinRoom'
import Input from '../common/inputs/Input'
import FormButton from '../common/gameNavigation/FormButton'
import ArrowButton from '../common/gameNavigation/ArrowButton'

const PrivateOptions = () => {
  const { socket_url } = envconfig
  const { selectMultiplayerMode } = useNavigationStore()
  const { isLogged, user } = useUserStore()
  const [modeManager, setModeManager] = useState('manage') // 'create', 'join'
  const [username, setUsername] = useState(isLogged ? user.username : null)
  const [errors, setErrors] = useState({})
  const [roomManager, setRoomManager] = useState(null)
  const socketRef = useRef(null)

  const validateFields = () => {
    const newErrors = {}

    if (!username) {
      newErrors.username = 'Username is required'
    } else if (username.length < 2) {
      newErrors.username = 'Username must have at least 2 characters'
    }

    return newErrors
  }

  useEffect(() => {
    // Validación dinámica en tiempo real
    const newErrors = validateFields()
    setErrors(newErrors)
  }, [username])

  useEffect(() => {
    socketRef.current = io(socket_url, {
      withCredentials: true, // Permitir el envío de cookies
    })
    // Cleanup socket on component unmount
    return () => socketRef.current.disconnect()
  }, [])

  const handleUser = (action) => {
    const inputErrors = validateFields()

    if (Object.keys(inputErrors).length > 0) {
      return setErrors(inputErrors)
    }
    setModeManager(action)
  }

  return (
    <>
      {modeManager === 'manage' && (
        <>
          <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-auto flex flex-col justify-center items-start'>
              <div>
                <h2 className='font-semibold'>The best games are shared</h2>
                <p className='font-light'>Create or join to friend's room</p>
              </div>
              <div className='flex flex-col justify-center items-start mb-5'>
                <span className='h-6 text-lg text-red-700'>{errors.username && errors.username}</span>
                <Input action={setUsername} id={'username'} type={'text'} placeholder={'Username'} value={isLogged ? user.username : undefined} />
              </div>
              <div className='flex flex-col justify-center items-start gap-5'>
                <FormButton action={() => handleUser('create')} text={'Create Room'} />
                <FormButton action={() => handleUser('join')} text={'Join Room'} />
              </div>
            </div>
          </div>
          <ArrowButton action={() => selectMultiplayerMode('menu')} />
        </>
      )}
      {modeManager === 'create' && <OwnerRoom socketRef={socketRef} playerName={username} userId={user?.id} />}
      {modeManager === 'join' && !roomManager && <JoinRoom socketRef={socketRef} playerName={username} userId={user?.id} setRoomManager={setRoomManager} />}
      {modeManager === 'join' && roomManager && <GuestRoom socketRef={socketRef} roomManager={roomManager} />}
    </>
  )
}

export default PrivateOptions
