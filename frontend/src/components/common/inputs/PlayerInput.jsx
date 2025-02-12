const PlayerInput = ({ playerLabel, setPlayer }) => {

  return (
    <div className='w-full flex justify-between items-center py-2'>
      <label htmlFor={playerLabel} className='text-2xl'>{playerLabel}'s name</label>
      <input onChange={(e) => setPlayer(e.target.value)} id={playerLabel} type="text" placeholder={playerLabel} className='w-40 border-b-2 px-1 border-dashed border-blue-900 dark:border-[#CECECE] bg-transparent focus-visible:outline-none placeholder:text-blue-900 dark:placeholder:text-[#CECECE] placeholder:text-opacity-35 dark:placeholder:text-opacity-35' />
    </div>
  )
}

export default PlayerInput
