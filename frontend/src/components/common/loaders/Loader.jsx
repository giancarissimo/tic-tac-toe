import { useContext } from 'react'
import { ThemeContext } from '../../../context/ThemeContext'

const Loader = () => {
  const { isDarkMode } = useContext(ThemeContext)

  return (
    <div className={`w-screen h-screen ${isDarkMode ? 'bg-darkBackground' : 'bg-white'} flex flex-col justify-center items-center gap-6`}>
      <h1 className={`font-handDrawn ${isDarkMode ? 'text-[#CECECE]' : 'text-blue-900'} font-bold text-6xl`}>Tic-Tac-Toe</h1>
      <div className={`animate-spin w-12 h-12 border-4 ${isDarkMode ? 'border-[#CECECE]' : 'border-blue-900'} border-t-transparent rounded-full`}></div>
    </div>
  )
}

export default Loader
