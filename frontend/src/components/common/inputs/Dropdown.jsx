import { ThemeContext } from '../../../context/ThemeContext'
import { useContext, useState, useEffect, useRef } from 'react'

const Dropdown = ({ action, type, text }) => {
  const { isDarkMode } = useContext(ThemeContext)
  const [isShowed, setIsShowed] = useState(false)
  const [hasSelected, setHasSelected] = useState(false)
  const dropdownRef = useRef(null)

  // Detectar clics fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShowed(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleShow = () => {
    setIsShowed((prev) => !prev)
  }

  const handleAction = (data) => {
    action(data)
    setIsShowed(false)
    setHasSelected(true)
  }

  return (
    <div ref={dropdownRef} className='relative flex flex-col justify-center items-start'>
      <button onClick={handleShow} className='relative'>
        <svg xmlns="http://www.w3.org/2000/svg" width="270" height="45" viewBox="0 0 270 45" fill="none">
          <path d="M13.8912 3.02228C71.7295 2.10594 130.945 1.1503 255.593 2.85657M13.8912 3.02228C104.937 3.40368 195.936 3.61526 255.593 2.85657M13.8912 3.02228C6.12255 3.4276 2.58884 6.18062 1.68754 13.1728M13.8912 3.02228C4.44351 1.90003 2.21922 7.04112 1.68754 13.1728M255.593 2.85657C263.757 2.06743 266.667 5.78587 267.782 12.9904M255.593 2.85657C265.173 3.54039 268.847 6.95695 267.782 12.9904M267.782 12.9904C267.29 18.87 268.925 26.6549 267.767 33.2692M267.782 12.9904C268.31 20.5514 267.488 26.7217 267.767 33.2692M267.767 33.2692C266.767 39.8341 263.588 44.0498 255.563 43.4197M267.767 33.2692C267.399 40.9131 265.117 43.1885 255.563 43.4197M255.563 43.4197C174.07 44.2043 92.4141 43.8384 13.861 43.5854M255.563 43.4197C173.491 44.0294 91.7222 43.8882 13.861 43.5854M13.861 43.5854C4.7811 44.0848 2.87249 41.1657 1.67245 33.4516M13.861 43.5854C6.85745 42.9656 1.5816 40.4323 1.67245 33.4516M1.67245 33.4516C0.379351 26.839 2.15126 18.6682 1.68754 13.1728M1.67245 33.4516C1.97449 26.0051 1.77653 17.5397 1.68754 13.1728" stroke={isDarkMode ? '#CECECE' : '#1E3A8A'} strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className={`absolute inset-0 self-center px-2 text-blue-900 dark:text-[#CECECE] ${!hasSelected? 'text-opacity-35 dark:text-opacity-35' : ''} text-left`}>{!hasSelected ? text : `${type} wins`}</span>
      </button>
      <div className={`w-[16.875rem] ${!isShowed ? 'invisible pointer-events-none' : 'visible pointer-events-auto'} absolute top-14 bg-white rounded-xl z-10 shadow-2xl`}>
        {[...Array(10).keys()].map((num) => (
          <button key={num + 1} data-value={num + 1} onClick={() => handleAction(num + 1)} className='w-full px-4 text-blue-900 text-opacity-35 hover:text-blue-900 border-blue-900 border-opacity-5 border-b-2 last-of-type:border-b-0'>{num + 1}</button>
        ))}
      </div>
    </div>
  )
}

export default Dropdown
