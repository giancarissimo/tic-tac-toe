import usePlaySound from '../../../hooks/usePlaySound'
import chalkSound from '../../../assets/audio/chalk/chalk-menu.mp3'
import stickyNoteSound from '../../../assets/audio/note/ballpoint-menu.mp3'

const ButtonNavigation = ({ action, text }) => {
  const { playSound } = usePlaySound()

  const handleAction = () => {
    playSound(stickyNoteSound, chalkSound)
    action()
  }

  return (
    <button onClick={handleAction} className="relative transform transition-transform duration-200 hover:scale-110">
      <svg xmlns="http://www.w3.org/2000/svg" width="117" height="43" viewBox="0 0 117 43" fill="none">
        <path d="M15.6923 4.41745C41.5338 5.66015 67.0137 4.9313 101.182 3.67139M15.6923 4.41745C35.9146 3.76765 54.9211 3.39376 101.182 3.67139M15.6923 4.41745C9.26268 5.02527 3.75596 6.9184 4.79864 13.2555M15.6923 4.41745C9.08746 4.45399 3.77081 7.31924 4.79864 13.2555M101.182 3.67139C107.241 2.97335 112.764 7.29966 112.229 12.318M101.182 3.67139C109.578 4.67743 113.889 6.5693 112.229 12.318M112.229 12.318C112.048 16.3594 111.815 22.1348 112.381 29.8026M112.229 12.318C111.885 17.5909 113.362 23.3574 112.381 29.8026M112.381 29.8026C111.779 35.3521 107.687 38.9905 101.488 38.6406M112.381 29.8026C111.02 35.4854 107.367 39.1139 101.488 38.6406M101.488 38.6406C80.8915 38.9289 59.9905 39.3887 15.9975 39.3867M101.488 38.6406C74.4362 38.328 46.8895 38.487 15.9975 39.3867M15.9975 39.3867C8.29172 39.4178 5.91152 36.7403 4.95123 30.7401M15.9975 39.3867C7.7891 40.7788 6.14755 36.9101 4.95123 30.7401M4.95123 30.7401C4.49728 25.1064 4.78422 19.84 4.79864 13.2555M4.95123 30.7401C4.25107 25.9376 4.72546 21.776 4.79864 13.2555" stroke='currentColor' strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className={`absolute inset-0 self-center font-semibold ${text === 'Matchmaking' ? 'text-xl' : ''}`}>{text}</span>
    </button>
  )
}

export default ButtonNavigation
