import { useState, useEffect, useContext } from 'react'
import { useNavigationStore } from '../../store/navigation'
import ArrowButton from '../common/gameNavigation/ArrowButton'
import Input from '../common/inputs/Input'

const JoinRoom = ({ socketRef, playerName, userId, setRoomManager }) => {
  const { selectMultiplayerMode } = useNavigationStore()
  const [roomId, setRoomId] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const socket = socketRef.current
    if (roomId && connecting) {
      socket.emit('join-room', { roomId, playerName, userId })

      socket.on('player-joined', ({ player2Name, room }) => {
        setRoomManager(room)
      })

      // Escuchar mensajes de error desde el backend
      socket.on('error', (msg) => {
        setConnecting(false)
        setErrors({ message: msg })
      })

      // Cleanup listeners when component unmounts or dependencies change
      return () => {
        socket.off('player-joined')
        socket.off('error')
      }
    }
  }, [roomId, connecting])

  const validateFields = () => {
    const newErrors = {}

    if (!roomId) {
      newErrors.roomId = 'Room Id is required'
    } else if (roomId.length < 6) {
      newErrors.roomId = 'Room Id must have 6 characters'
    }

    return newErrors
  }

  useEffect(() => {
    // Validación dinámica en tiempo real
    const newErrors = validateFields()
    setErrors(newErrors)
  }, [roomId])

  // Función para manejar la unión a la sala
  const handleForm = (e) => {
    e.preventDefault()
    const formErrors = validateFields()

    if (Object.keys(formErrors).length > 0) {
      return setErrors(formErrors)
    }

    setConnecting(true)
  }

  return (
    <>
      <div className='w-full h-full flex flex-col justify-start items-center gap-2'>
        <form className='w-auto flex flex-col justify-start items-start gap-2'>
          <div>
            <h2 className='font-semibold'>Two minds, one game</h2>
            <span className='font-light'>Join Friend's Room</span>
          </div>
          <div className='h-16 flex flex-col justify-center items-start'>
            <span className='min-h-5 text-base text-red-700'>{errors.roomId && errors.roomId}</span>
            <Input action={setRoomId} id={'roomId'} type={'text'} placeholder={'Room Id'} />
          </div>
          <button className='relative' type='button' onClick={(e) => handleForm(e)}>
            <svg width="269" height="46" viewBox="0 0 269 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M255.401 1.77017L255.451 1.76946L255.5 1.75882C259.337 0.924813 262.796 2.25446 265.019 4.38831C267.261 6.54088 268.159 9.40465 267.122 11.6526L267.053 11.8036L267.087 11.9662C267.888 15.72 267.747 19.6062 267.47 23.2629C267.418 23.9588 267.36 24.6485 267.303 25.3283C267.063 28.1804 266.838 30.8578 267.078 33.0812C267.241 35.841 266.583 38.4081 264.808 40.248C263.033 42.0874 260.06 43.2862 255.41 43.1318L255.395 43.1312L255.379 43.1317C166.093 45.8028 80.4092 44.3856 14.0288 43.1327C13.2938 42.9413 12.5524 42.7708 11.824 42.6038L11.7555 42.5881C11.0293 42.4217 10.317 42.2585 9.62454 42.0791C8.19323 41.7084 6.8808 41.2771 5.77096 40.6382C4.66955 40.0042 3.77252 39.1686 3.16195 37.983C2.54879 36.7925 2.20508 35.211 2.27712 33.0565L2.27934 32.99L2.26412 32.9253C1.76144 30.7874 1.6376 28.7169 1.70468 25.5773C1.74236 23.8141 1.83944 21.7323 1.96099 19.1261C2.05682 17.0713 2.16786 14.6905 2.27697 11.8828C2.53287 6.12297 8.30449 1.7938 13.9591 1.77023C24.8244 1.85327 35.7439 1.97051 47.1788 2.09329C95.634 2.61356 153.344 3.23319 255.401 1.77017Z" fill="#1E3A8A" stroke="#1E3A8A" />
              <path d="M13.96 1.27017C104.563 0.995504 193.684 1.37889 255.394 1.27017ZM13.96 1.27017C105.017 1.83666 195.165 2.32877 255.394 1.27017ZM255.394 1.27017C262.574 1.97972 267.096 5.41302 267.576 11.8619ZM255.394 1.27017C263.621 1.64783 267.05 4.22853 267.576 11.8619ZM267.576 11.8619C266.523 19.152 266.872 27.0371 267.576 33.0397ZM267.576 11.8619C266.938 19.6899 267.589 27.3747 267.576 33.0397ZM267.576 33.0397C268.636 39.7232 263.641 43.1966 255.394 43.6314ZM267.576 33.0397C268.175 40.2039 263.581 42.5099 255.394 43.6314ZM255.394 43.6314C190.032 42.8418 124.656 43.7688 13.96 43.6314ZM255.394 43.6314C193.935 42.3954 132.317 42.5442 13.96 43.6314ZM13.96 43.6314C4.5746 43.4083 0.816488 39.9635 1.77741 33.0397ZM13.96 43.6314C5.44337 44.6042 2.56062 39.9864 1.77741 33.0397ZM1.77741 33.0397C2.98842 26.7167 2.21837 18.1163 1.77741 11.8619ZM1.77741 33.0397C2.14598 25.6066 1.29037 16.8002 1.77741 11.8619ZM1.77741 11.8619C1.41542 4.61764 7.09536 0.560618 13.96 1.27017ZM1.77741 11.8619C1.92878 4.68631 6.50301 1.83666 13.96 1.27017Z" fill="#1E3A8A" />
              <path d="M13.96 1.27017C104.563 0.995504 193.684 1.37889 255.394 1.27017M13.96 1.27017C105.017 1.83666 195.165 2.32877 255.394 1.27017M13.96 1.27017C7.09536 0.560618 1.41542 4.61764 1.77741 11.8619M13.96 1.27017C6.50301 1.83666 1.92878 4.68631 1.77741 11.8619M255.394 1.27017C262.574 1.97972 267.096 5.41302 267.576 11.8619M255.394 1.27017C263.621 1.64783 267.05 4.22853 267.576 11.8619M267.576 11.8619C266.523 19.152 266.872 27.0371 267.576 33.0397M267.576 11.8619C266.938 19.6899 267.589 27.3747 267.576 33.0397M267.576 33.0397C268.636 39.7232 263.641 43.1966 255.394 43.6314M267.576 33.0397C268.175 40.2039 263.581 42.5099 255.394 43.6314M255.394 43.6314C190.032 42.8418 124.656 43.7688 13.96 43.6314M255.394 43.6314C193.935 42.3954 132.317 42.5442 13.96 43.6314M13.96 43.6314C4.5746 43.4083 0.816488 39.9635 1.77741 33.0397M13.96 43.6314C5.44337 44.6042 2.56062 39.9864 1.77741 33.0397M1.77741 33.0397C2.98842 26.7167 2.21837 18.1163 1.77741 11.8619M1.77741 33.0397C2.14598 25.6066 1.29037 16.8002 1.77741 11.8619" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className='absolute inset-0 self-center text-white'>{connecting ? "Joining..." : "Join"}</span>
          </button>
          <span className='w-full text-center text-base text-red-700'>{errors.message}</span>
        </form>
      </div>
      <ArrowButton action={() => selectMultiplayerMode('menu')} />
    </>
  )
}

export default JoinRoom
