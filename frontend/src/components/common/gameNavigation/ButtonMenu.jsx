import ButtonNavigation from './ButtonNavigation'

const ButtonMenu = ({ action, text, info }) => {
  return (
    <li className='w-full flex justify-start items-center gap-6'>
      <ButtonNavigation action={action} text={text} />
      <span className='font-semibold text-lg text-neutral-500'>{info}</span>
    </li>
  )
}

export default ButtonMenu
