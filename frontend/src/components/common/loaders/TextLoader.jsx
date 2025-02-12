import { useState, useEffect } from 'react'

function TextLoader({ text }) {
  const loadingStates = ['.', '..', '...']
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % loadingStates.length) // Cambia al siguiente índice
    }, 500)

    return () => clearInterval(interval) // Limpieza al desmontar
  }, [])

  return (
    <span className="text-xl text-neutral-500">{text}{loadingStates[currentIndex]}</span>
  )
}

export default TextLoader
