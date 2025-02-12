import { createContext, useState, useEffect } from 'react'

// Se crea el contexto
export const ThemeContext = createContext()

// Proveedor del contexto
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Revisa si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'dark'
  })

  const [isMuted, setIsMuted] = useState(() => {
    const savedMute = localStorage.getItem('mute')
    return savedMute === 'true'
  })

  useEffect(() => {
    const body = document.body

    // Se aplican o eliminan las clases dinámicamente
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      body.classList.remove('lined-sheet')
      body.classList.add('dark:bg-darkBackground')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      body.classList.add('lined-sheet')
      body.classList.remove('dark:bg-darkBackground')
    }

    // Se guarda la configuración de sonidos
    if (isMuted) {
      localStorage.setItem('mute', isMuted.toString())
    } else {
      localStorage.setItem('mute', isMuted.toString())
    }
    // Limpia los efectos si es necesario
    return () => {
      body.classList.remove('lined-sheet', 'dark:bg-darkBackground')
    }
  }, [isDarkMode, isMuted]) // Se actualiza cuando cambia el tema

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, isMuted, setIsMuted }}>
      {children}
    </ThemeContext.Provider>
  )
}
