import { useState, useEffect } from "react"

const Timer = () => {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1)
    }, 1000)

    // Cleanup del intervalo
    return () => clearInterval(interval)
  }, [])

  // Formatea los segundos como 00:01, 00:02
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0")
    const secs = (totalSeconds % 60).toString().padStart(2, "0")
    return `${minutes}:${secs}`
  }

  return (
    <>
      <span>{formatTime(seconds)}</span>
    </>
  )
}

export default Timer