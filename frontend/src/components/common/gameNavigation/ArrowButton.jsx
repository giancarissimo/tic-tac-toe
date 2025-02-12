import { useContext } from 'react'
import { ThemeContext } from '../../../context/ThemeContext'
import usePlaySound from '../../../hooks/usePlaySound'
import chalkSound from '../../../assets/audio/chalk/chalk-menu.mp3'
import stickyNoteSound from '../../../assets/audio/note/ballpoint-menu.mp3'

const ArrowButton = ({ action }) => {
  const { isDarkMode } = useContext(ThemeContext)
  const { playSound } = usePlaySound()

  const handleAction = () => {
    playSound(stickyNoteSound, chalkSound)
    action()
  }

  return (
    <nav className='absolute bottom-7'>
      <button onClick={handleAction}>
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="12" viewBox="0 0 34 12" fill="none">
          <path d="M33.302 7.58158C33.302 7.58158 32.9238 7.48569 32.1674 7.29392C31.4098 7.10215 30.4285 6.93633 29.2235 6.79646C28.0185 6.65371 26.5684 6.5499 24.8731 6.48501C23.1789 6.42157 21.3581 6.4331 19.4106 6.51962C17.4632 6.60757 15.5558 6.75681 13.6885 6.96733C11.8212 7.17785 10.1085 7.35736 8.55026 7.50588C6.99089 7.65295 5.66799 7.78705 4.58154 7.90817C3.4951 8.02785 2.67242 8.11364 2.11351 8.16555C1.55344 8.21601 1.16534 8.27874 0.949214 8.35372C0.731925 8.42725 0.600623 8.4633 0.555306 8.46186C0.508827 8.46042 0.463511 8.45249 0.419356 8.43807C0.375201 8.42221 0.332789 8.40058 0.29212 8.37318C0.251451 8.34579 0.214268 8.3119 0.180571 8.27153C0.146874 8.2326 0.117825 8.18934 0.0934231 8.14176C0.0678597 8.09417 0.0475241 8.04299 0.0324185 7.98819C0.0173128 7.93484 0.00743636 7.87933 0.00278847 7.82165C-0.00185942 7.76542 -0.000696701 7.70919 0.00627514 7.65295C0.013247 7.59672 0.0254462 7.54193 0.0428758 7.48858C0.0603054 7.43522 0.0829638 7.38548 0.110851 7.33934C0.137576 7.2932 0.168369 7.2521 0.203228 7.21606C0.239249 7.17857 0.277595 7.14757 0.318264 7.12305C0.360095 7.0971 0.403669 7.07835 0.448986 7.06682C0.494303 7.05384 0.626767 6.90028 0.84638 6.60613C1.06716 6.3091 1.35184 5.97458 1.70043 5.60257C2.04902 5.23056 2.4743 4.78429 2.97628 4.26376C3.47709 3.74468 4.02786 3.19748 4.6286 2.62216C5.22934 2.04829 5.73015 1.58183 6.13103 1.2228C6.53075 0.862322 6.7829 0.592687 6.88748 0.413891C6.99206 0.235095 7.06526 0.130558 7.10709 0.100278C7.15008 0.0699979 7.1954 0.0462066 7.24304 0.0289037C7.28952 0.0116009 7.33716 0.00222836 7.38596 0.000786461C7.43477 -0.00209734 7.48357 0.00294966 7.53237 0.0159268C7.58001 0.027462 7.62591 0.0462063 7.67007 0.0721605C7.71422 0.0981147 7.75547 0.130558 7.79382 0.169489C7.83216 0.20842 7.86586 0.252398 7.89491 0.301423C7.92396 0.350448 7.94836 0.402356 7.96811 0.457148C7.9867 0.513382 8.00007 0.571779 8.0082 0.632339C8.01633 0.692899 8.01808 0.753458 8.01343 0.814018C8.00994 0.874578 8.00065 0.933696 7.98554 0.991372C7.96928 1.04905 7.94836 1.10384 7.9228 1.15575C7.89607 1.20622 7.8647 1.25236 7.82868 1.29417C7.79382 1.33743 7.59105 1.48018 7.22038 1.72242C6.85088 1.96465 6.49183 2.24655 6.14323 2.56809C5.7958 2.89108 5.37459 3.26453 4.87959 3.68845C4.38459 4.11237 3.88668 4.53052 3.38587 4.9429C2.88623 5.35673 2.45629 5.69413 2.09608 5.95511C1.73587 6.21754 1.81547 6.46338 2.33487 6.69265C2.85311 6.92047 3.29001 7.14252 3.64557 7.3588C3.99997 7.57653 4.30906 7.75461 4.57283 7.89303C4.8366 8.03289 5.21365 8.2398 5.70401 8.51377C6.1932 8.78629 6.64811 9.00978 7.06875 9.18425C7.49054 9.35872 7.76651 9.48849 7.89665 9.57356C8.02679 9.65719 8.14009 9.72064 8.23653 9.76389C8.33181 9.80715 8.41896 9.86771 8.49797 9.94557C8.57815 10.0234 8.64554 10.1157 8.70016 10.2224C8.75593 10.3277 8.79602 10.4416 8.82042 10.5641C8.84598 10.6853 8.8547 10.8086 8.84657 10.934C8.83959 11.0594 8.81635 11.1806 8.77685 11.2974C8.73734 11.4127 8.68389 11.518 8.61649 11.6131C8.5491 11.7069 8.47125 11.7854 8.38294 11.8489C8.29463 11.9109 8.20109 11.9541 8.10232 11.9787C8.00239 12.0032 7.90188 12.0075 7.80079 11.9916C7.70086 11.9743 7.605 11.9383 7.5132 11.8835C7.42257 11.8287 7.34065 11.7566 7.26744 11.6672C7.1954 11.5792 7.13672 11.479 7.0914 11.3666C7.04609 11.2541 7.01588 11.1351 7.00077 11.0097C6.98683 10.8857 6.98915 10.7617 7.00774 10.6377C7.02633 10.5137 7.06061 10.3969 7.11058 10.2873C7.15938 10.1777 7.22154 10.0804 7.29707 9.99532C7.37144 9.91025 7.4551 9.84248 7.54806 9.79201C7.64218 9.74154 7.73979 9.71126 7.84088 9.70117C7.94197 9.68964 8.04132 9.69901 8.13892 9.72929C8.23769 9.75813 8.33007 9.80643 8.41605 9.8742C8.50204 9.94053 8.57699 10.0227 8.6409 10.1208C8.7048 10.2188 8.75477 10.327 8.79079 10.4452C8.82681 10.562 8.84598 10.6838 8.84831 10.8107C8.85179 10.9362 8.83901 11.0594 8.80996 11.1806C8.78091 11.3002 8.73734 11.412 8.67924 11.5158C8.61998 11.6182 8.5491 11.7061 8.4666 11.7797C8.38526 11.8546 8.29579 11.9109 8.19818 11.9484C8.10174 11.9859 8.00297 12.0032 7.90188 12.0003C7.79963 11.9974 7.7485 11.996 7.7485 11.996C7.7485 11.996 7.56433 11.8482 7.19598 11.5526C6.82648 11.2584 6.48543 11.058 6.17286 10.9513C5.86029 10.8446 5.46871 10.6334 4.99811 10.3176C4.52867 10.0032 4.16962 9.76317 3.92096 9.59735C3.67346 9.43154 3.34811 9.23616 2.9449 9.01122C2.5417 8.78628 2.17568 8.5563 1.84684 8.32127C1.51684 8.08624 1.17057 7.75965 0.808035 7.3415C0.445499 6.92479 0.281663 6.53836 0.316522 6.18221C0.350219 5.82462 0.471064 5.5521 0.679058 5.36466C0.887051 5.17721 1.16127 4.97678 1.50173 4.76338C1.84335 4.55142 2.25353 4.2306 2.73226 3.80091C3.21216 3.37267 3.6874 2.93433 4.158 2.4859C4.62744 2.03603 5.04285 1.63806 5.40422 1.29201C5.76559 0.944511 6.12929 0.666945 6.49531 0.459311C6.86133 0.250235 7.06526 0.130558 7.10709 0.100278C7.15008 0.0699979 7.1954 0.0462066 7.24304 0.0289037C7.28952 0.0116009 7.33716 0.00222836 7.38596 0.000786461C7.43477 -0.00209734 7.48357 0.00294966 7.53237 0.0159268C7.58001 0.027462 7.62591 0.0462063 7.67007 0.0721605C7.71422 0.0981147 7.75547 0.130558 7.79382 0.169489C7.83216 0.20842 7.86586 0.252398 7.89491 0.301423C7.92396 0.349006 7.94836 0.400914 7.96811 0.457148C7.9867 0.513382 8.00007 0.571779 8.0082 0.632339C8.01633 0.692899 8.01808 0.753458 8.01343 0.814018C8.00994 0.874578 8.00065 0.933696 7.98554 0.991372C7.96928 1.04905 7.94836 1.10312 7.9228 1.15359C7.89607 1.20549 7.8647 1.25236 7.82868 1.29417C7.79382 1.33743 7.70957 1.42394 7.57595 1.55371C7.44348 1.68348 7.18611 1.93221 6.80382 2.2999C6.42153 2.66758 5.9457 3.14341 5.37633 3.72738C4.80697 4.30991 4.28873 4.87225 3.82161 5.4144C3.35334 5.95511 2.85311 6.51385 2.32093 7.09061C1.78758 7.66737 1.37159 8.04082 1.07297 8.21097C0.773176 8.37967 0.600623 8.4633 0.555306 8.46186C0.508827 8.46042 0.463511 8.45249 0.419356 8.43807C0.375201 8.42221 0.332789 8.40058 0.29212 8.37318C0.251451 8.34579 0.214268 8.31262 0.180571 8.27369C0.146874 8.23332 0.117825 8.18934 0.0934231 8.14176C0.0678597 8.09417 0.0475241 8.04299 0.0324185 7.98819C0.0173128 7.93484 0.00743636 7.88005 0.00278847 7.82382C-0.00185942 7.76614 -0.000696701 7.70919 0.00627514 7.65295C0.013247 7.59672 0.0254462 7.54193 0.0428758 7.48858C0.0603054 7.43522 0.0829638 7.38548 0.110851 7.33934C0.137576 7.2932 0.168369 7.2521 0.203228 7.21606C0.239249 7.17857 0.277595 7.14757 0.318264 7.12305C0.360095 7.0971 0.403669 7.07835 0.448986 7.06682C0.494303 7.05384 0.630835 7.05312 0.858582 7.06466C1.08749 7.07619 1.47966 7.05528 2.03508 7.00193C2.58934 6.94714 3.41144 6.85774 4.50137 6.73374C5.59246 6.60829 6.91478 6.46915 8.46834 6.31631C10.0219 6.16203 11.7405 5.97458 13.624 5.75397C15.5087 5.53192 17.4359 5.37114 19.4054 5.27165C21.3738 5.17216 23.2167 5.14693 24.9341 5.19595C26.6515 5.24642 28.1312 5.33438 29.3734 5.45982C30.6155 5.58527 31.6172 5.72874 32.3783 5.89023C33.1382 6.05172 33.5414 6.14112 33.5879 6.15842C33.6332 6.17717 33.6762 6.20168 33.7169 6.23196C33.7575 6.26368 33.7947 6.30045 33.8284 6.34226C33.8621 6.38408 33.8911 6.43022 33.9156 6.48069C33.94 6.5326 33.9591 6.58667 33.9731 6.6429C33.987 6.69913 33.9957 6.75681 33.9992 6.81593C34.0015 6.87505 33.9986 6.93344 33.9905 6.99112C33.9812 7.0488 33.9667 7.10503 33.9469 7.15982C33.9272 7.21317 33.9022 7.26364 33.872 7.31122C33.8429 7.35736 33.8092 7.39846 33.7709 7.4345C33.7337 7.47055 33.693 7.50083 33.6489 7.52534C33.6059 7.54986 33.5606 7.56716 33.5129 7.57725C33.4664 7.58735 33.42 7.59095 33.3735 7.58807C33.3258 7.58374 33.302 7.58158 33.302 7.58158Z" fill={isDarkMode ? '#CECECE' : '#1E3A8A'} />
        </svg>
      </button>
    </nav>
  )
}

export default ArrowButton
