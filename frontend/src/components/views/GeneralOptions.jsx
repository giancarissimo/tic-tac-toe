import { useContext, useState } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import { useNavigationStore } from '../../store/navigation'
import ButtonNavigation from '../common/gameNavigation/ButtonNavigation'
import ButtonSelector from '../common/gameControls/ButtonSelector'

const GeneralOptions = () => {
  const { selectGameMode } = useNavigationStore()
  const { isDarkMode, setIsDarkMode, isMuted, setIsMuted } = useContext(ThemeContext) // Acceso al contexto global del tema

  // Opciones disponibles de los botones
  const optionThemes = ['Light', 'Dark']
  const optionMuteSounds = ['No', 'Yes']

  // Estado local para opciones seleccionadas
  const [selectedTheme, setSelectedTheme] = useState(isDarkMode ? 'Dark' : 'Light')
  const [selectedOptionSounds, setSelectedOptionSounds] = useState(isMuted ? 'Yes' : 'No')

  // Detectar si hay cambios en las opciones seleccionadas
  const hasChanges =
    (selectedTheme === 'Dark') !== isDarkMode || // Cambió el tema
    (selectedOptionSounds === 'Yes') !== isMuted // Cambió la opción de sonido

  const handleApply = () => {
    setIsDarkMode(selectedTheme === 'Dark')
    setIsMuted(selectedOptionSounds === 'Yes')
  }

  return (
    <div className='w-full flex flex-col justify-start items-start gap-2'>
      <h2 className='font-semibold'>Game settings</h2>
      <ButtonSelector action={setSelectedTheme} text={'Theme'} category={optionThemes} index={isDarkMode ? 1 : 0} />
      <ButtonSelector action={setSelectedOptionSounds} text={'Mute sounds'} category={optionMuteSounds} index={isMuted ? 1 : 0} />
      <nav className='w-full flex justify-between items-center mt-7'>
        <ButtonNavigation action={() => selectGameMode('menu')} text={'Return'} />
        {hasChanges && (<ButtonNavigation action={handleApply} text={'Apply'} />)}
      </nav>
    </div>
  )
}

export default GeneralOptions
