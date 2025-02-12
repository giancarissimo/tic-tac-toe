import { useState } from 'react'
import { useNavigationStore } from '../store/navigation'

export const usePause = () => {
  const { gameMode, selectGameMode, selectMultiplayerMode, selectMatchDifficulty, selectMatchWins } = useNavigationStore()
  const [isPaused, setIsPaused] = useState(false)

  const togglePause = () => setIsPaused(!isPaused)
  const handleResume = () => setIsPaused(false)
  const handleReturn = () => {
    selectMatchWins(null)
    gameMode === 'ai' && selectMatchDifficulty(null)
    gameMode === 'multiplayer' ? selectMultiplayerMode('menu') : selectGameMode('menu')
  }

  return { isPaused, setIsPaused, togglePause, handleResume, handleReturn }
}
