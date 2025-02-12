const ButtonOption = ({ action, text }) => {
  return (
    <button onClick={action} className='relative'>
      <svg xmlns="http://www.w3.org/2000/svg" width="114" height="42" viewBox="0 0 114 42" fill="none">
        <path d="M10.4732 0.233088C43.8392 -0.954059 77.5199 2.91618 104.64 0.233088C109.75 1.12516 111.867 2.84755 113.818 10.4371C112.367 16.0297 114.54 23.4888 113.818 30.845C113.639 35.8612 112.213 41.2685 104.64 41.049C68.5334 41.6322 34.075 42.8606 10.4732 41.049C6.32558 40.651 3.49879 39.9716 1.29538 30.845C-0.309345 23.6604 -0.550054 18.3422 1.29538 10.4371C1.22749 2.30545 3.34449 1.9692 10.4732 0.233088Z" fill="#1E3A8A" />
      </svg>
      <span className='absolute inset-0 self-center text-white'>{text}</span>
    </button>
  )
}

export default ButtonOption