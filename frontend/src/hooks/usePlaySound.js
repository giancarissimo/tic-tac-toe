import { useContext, useRef, useCallback } from 'react'
import { ThemeContext } from '../context/ThemeContext'

const usePlaySound = () => {
  const { isDarkMode, isMuted } = useContext(ThemeContext) // Obtén el estado global
  const audioRef = useRef(null) // Referencia única para el audio

  // Función para reproducir un sonido
  const playSound = useCallback((lightSound, darkSound) => {
    if (isMuted) return // No reproducir si está en modo silencio

    const audioSrc = isDarkMode === false ? lightSound : darkSound // Elige el sonido según el tema

    // Reutiliza o crea un nuevo objeto Audio
    // if (!audioRef.current || audioRef.current.src !== audioSrc) {
    //   audioRef.current = new Audio(audioSrc)
    // }

    const audio = audioRef.current

    if (audio && audio.src === audioSrc) {
      // Si ya está en reproducción, pausamos el audio
      if (!audio.paused) {
        audio.pause() // Pausar
        return
      }
    } else {
      // Si no es el mismo audio, crear uno nuevo
      if (audio) {
        audio.pause() // Si ya hay otro audio en reproducción, pausarlo
      }

      audioRef.current = new Audio(audioSrc) // Crear una nueva instancia de audio
    }

    audioRef.current.currentTime = 0 // Reproducir desde el inicio
    audioRef.current.play().catch((error) => {
      console.error('Error al reproducir el sonido:', error)
    })
  }, [isDarkMode, isMuted]) // Dependencias: cambiará si `isDarkMode` o `isMuted` cambian

  return { playSound }
}

export default usePlaySound
