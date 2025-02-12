import { useState, useEffect } from 'react'

const WinsSelector = ({ action }) => {
  const [counter, setCounter] = useState(1) // Por default va a arrancar en 1

  // Sincroniza el estado 'totalWins' con el índice actual
  useEffect(() => {
    action(counter)
  }, [counter])

  const handlePrevious = () => {
    if (counter > 1) {
      setCounter(counter - 1)
    }
  }

  const handleNext = () => {
    if (counter <= 10 - 1) {
      setCounter(counter + 1)
    }
  }

  return (
    <div className='w-full flex justify-between items-center py-2'>
      <span className='text-2xl'>Number of wins</span>
      <div className='flex justify-center items-center'>
        <button onClick={handlePrevious} disabled={counter === 1} className={`text-2xl font-bold ${counter === 1 ? 'text-gray-500' : ''}`}>-</button>
        <span className="w-14 text-2xl text-center">{counter}</span>
        <button onClick={handleNext} disabled={counter === 10} className={`text-2xl font-bold ${counter === 10 ? 'text-gray-500' : ''}`}>+</button>
      </div>
    </div>
  )
}

export default WinsSelector
