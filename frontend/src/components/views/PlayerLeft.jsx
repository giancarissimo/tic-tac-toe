import { useNavigationStore } from "../../store/navigation"

const PlayerLeft = ({ disconectedPlayer }) => {
  const { selectMultiplayerMode } = useNavigationStore()

  return (
    <div className='w-full h-full flex flex-col justify-center items-center gap-2'>
      <h2 className="font-semibold">{disconectedPlayer} has left the match!</h2>
      <nav>
        <button onClick={() => selectMultiplayerMode('menu')} className='underline text-blue-500'>Go back</button>
      </nav>
    </div>
  )
}

export default PlayerLeft
