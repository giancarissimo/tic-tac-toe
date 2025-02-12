import { ThemeContext } from '../../../context/ThemeContext'
import { useContext, useState, useEffect } from 'react'
import { useNavigationStore } from '../../../store/navigation'

const Input = ({ action, id, type, placeholder, value }) => {
  const { isDarkMode } = useContext(ThemeContext)
  const { copy, selectCopy } = useNavigationStore()
  const [inputType, setInputType] = useState('password')
  const width = id === 'password' ? 'w-[14.375rem]' : 'w-[16.875rem]'

  const handleShowPass = () => {
    inputType === 'password' ? setInputType('text') : setInputType('password')
  }

  // Efecto para reiniciar el estado del botón después de N segundos
  useEffect(() => {
    if (id === 'roomCode') {
      if (copy) {
        const timeout = setTimeout(() => {
          selectCopy(false)
        }, 1500)

        return () => clearTimeout(timeout) // Limpiar el timeout al desmontar
      }
    }
  }, [copy])

  // Función para copiar el código al portapapeles
  const handleCopy = () => {
    navigator.clipboard.writeText(value) // Usa la API Clipboard para copiar
      .then(() => selectCopy(true)) // Cambia el estado a "copiado" al terminar
      .catch(err => console.error('Error al copiar al portapapeles:', err))
  }

  return (
    <div className='relative'>
      <svg xmlns="http://www.w3.org/2000/svg" width="270" height="45" viewBox="0 0 270 45" fill="none">
        <path d="M13.8912 3.02228C71.7295 2.10594 130.945 1.1503 255.593 2.85657M13.8912 3.02228C104.937 3.40368 195.936 3.61526 255.593 2.85657M13.8912 3.02228C6.12255 3.4276 2.58884 6.18062 1.68754 13.1728M13.8912 3.02228C4.44351 1.90003 2.21922 7.04112 1.68754 13.1728M255.593 2.85657C263.757 2.06743 266.667 5.78587 267.782 12.9904M255.593 2.85657C265.173 3.54039 268.847 6.95695 267.782 12.9904M267.782 12.9904C267.29 18.87 268.925 26.6549 267.767 33.2692M267.782 12.9904C268.31 20.5514 267.488 26.7217 267.767 33.2692M267.767 33.2692C266.767 39.8341 263.588 44.0498 255.563 43.4197M267.767 33.2692C267.399 40.9131 265.117 43.1885 255.563 43.4197M255.563 43.4197C174.07 44.2043 92.4141 43.8384 13.861 43.5854M255.563 43.4197C173.491 44.0294 91.7222 43.8882 13.861 43.5854M13.861 43.5854C4.7811 44.0848 2.87249 41.1657 1.67245 33.4516M13.861 43.5854C6.85745 42.9656 1.5816 40.4323 1.67245 33.4516M1.67245 33.4516C0.379351 26.839 2.15126 18.6682 1.68754 13.1728M1.67245 33.4516C1.97449 26.0051 1.77653 17.5397 1.68754 13.1728" stroke={isDarkMode ? '#CECECE' : '#1E3A8A'} strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input value={value && value} readOnly={value && true} onChange={action && ((e) => action(e.target.value))} id={id} type={type === 'password' ? inputType : type} placeholder={placeholder} autoComplete='off' className={`absolute inset-0 self-center ${width} px-2 bg-transparent placeholder:text-blue-900 dark:placeholder:text-[#CECECE] placeholder:text-opacity-35 dark:placeholder:text-opacity-35 focus-visible:outline-none`} />
      {id === 'password' && (
        <button onClick={handleShowPass} type='button' className='absolute inset-[14.375rem] self-center'>
          {inputType === 'password' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          )}
        </button>
      )}
      {id === 'roomCode' && (
        <button onClick={handleCopy} className='absolute inset-[14.375rem] self-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default Input
