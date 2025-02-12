import { useContext } from 'react'
import { ThemeContext } from '../../../context/ThemeContext'

const WinningLine = ({ winningLineClass }) => {
  const { isDarkMode } = useContext(ThemeContext)

  return (
    <div className={`${!isDarkMode? 'line' : 'line-dark'}  ${winningLineClass}`}></div>
  )
}

export default WinningLine
