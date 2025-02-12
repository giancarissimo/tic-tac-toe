import { useNavigationStore } from '../../store/navigation'
import Input from '../common/inputs/Input'
import ArrowButton from '../common/gameNavigation/ArrowButton'

const RoomInfo = ({ setRoundInfoShow, roomId }) => {
  const { copy } = useNavigationStore()

  return (
    <>
      <div className="relative w-full flex flex-col justify-center items-start gap-2">
        <h2 className='font-semibold'>Room id</h2>
        {copy && (
          <div className='absolute inset-[13.60rem] self-center mb-10'>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="29" viewBox="0 0 48 29" fill="none">
              <path d="M1.23535 15.464C1.23535 17.7751 3.88448 19.7887 7.62109 20.1252C10.1405 20.352 12.6882 20.5282 15.2595 20.651C16.3587 20.7044 17.366 21.0569 17.9794 21.6202L24.2354 27.3662L30.4914 21.6202C31.1047 21.0569 32.112 20.7044 33.2113 20.6524C35.7825 20.5282 38.3302 20.352 40.8496 20.1252C44.5862 19.7887 47.2354 17.7765 47.2354 15.4625V6.76988C47.2354 4.45588 44.5862 2.44377 40.8496 2.10721C35.3484 1.6128 29.7955 1.36514 24.2354 1.36621C18.5927 1.36621 13.0444 1.61899 7.62109 2.10721C3.88448 2.44377 1.23535 4.45733 1.23535 6.76988V15.4625V15.464Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className='absolute inset-[0.36rem] self-end right-1 text-base'>Copied</span>
          </div>
        )}
        <Input id={'roomCode'} type={'text'} value={roomId} />
      </div>
      <ArrowButton action={() => setRoundInfoShow(false)} />
    </>
  )
}

export default RoomInfo
