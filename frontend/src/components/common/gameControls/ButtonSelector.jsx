import { useState, useEffect } from 'react'

const ButtonSelector = ({ action, text, category, index }) => {
  const [currentIndex, setCurrentIndex] = useState(index) // Inicializa según el tema global actual

  // Funciones para manejar el índice
  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1)
  }

  const handleNext = () => {
    if (currentIndex < category.length - 1) setCurrentIndex((prev) => prev + 1)
  }

  // Sincroniza el estado con el índice actual
  useEffect(() => {
    action(category[currentIndex])
  }, [currentIndex, category, action])

  return (
    <div className='w-full flex justify-between items-center'>
      <span className='text-2xl'>{text}</span>
      <div className="flex items-center justify-center">
        <button onClick={handlePrevious} disabled={currentIndex === 0} className={`text-2xl font-bold p-2 ${currentIndex === 0 ? "text-gray-500 cursor-default" : ""}`}>&#8249;</button>
        <span className="w-20 text-2xl text-center">{category[currentIndex]}</span>
        <button onClick={handleNext} disabled={currentIndex === category.length - 1} className={`text-2xl font-bold p-2 ${currentIndex === category.length - 1 ? "text-gray-500 cursor-default" : ""}`}>&#8250;</button>
      </div>
    </div>
  )
}

export default ButtonSelector
