import { useNavigationStore } from '../../store/navigation'
import { useUserStore } from '../../store/user'
import { useEffect, useState } from 'react'
import { postData } from '../../utils/PostData'
import envconfig from '../../config/env.config'
import Input from '../common/inputs/Input'
import FormButton from '../common/gameNavigation/FormButton'
import ArrowButton from '../common/gameNavigation/ArrowButton'

const SignIn = () => {
  const { api_login } = envconfig
  const { selectMultiplayerMode } = useNavigationStore()
  const { setUser } = useUserStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const validateFields = () => {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is not valid'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    }

    return newErrors
  }

  useEffect(() => {
    // Validación dinámica en tiempo real
    const newErrors = validateFields()
    setErrors(newErrors)
  }, [email, password])

  const handleForm = (e) => {
    e.preventDefault()
    const formErrors = validateFields()

    if (Object.keys(formErrors).length > 0) {
      return setErrors(formErrors)
    }

    const user = {
      email: email,
      password: password
    }

    postData(api_login, user, 'POST')
      .then(data => {
        if (data.status === 'Error') {
          return setErrors({ email: data.errors.email, password: data.errors.password })
        }
        const settingUser = {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          matches: data.user.matches
        }
        setUser(settingUser)
        selectMultiplayerMode('account')
      })
  }

  return (
    <>
      <div className='w-full h-full flex flex-col justify-start items-center gap-2'>
        <form className='w-auto flex flex-col justify-center items-start'>
          <div>
            <h2 className='font-semibold'>Sign in</h2>
            <p className='font-light text-xl'>To access to exclusive features</p>
          </div>
          <div className="flex flex-col h-[70px]">
            <span className='text-red-700 text-base min-h-[24px]'>{errors.email && errors.email}</span>
            <Input action={setEmail} id={'email'} type={'email'} placeholder={'Email'} />
          </div>
          <div className="flex flex-col h-[70px] mb-5">
            <span className='text-red-700 text-base min-h-[24px]'>{errors.password && errors.password}</span>
            <Input action={setPassword} id={'password'} type={'password'} placeholder={'Password'} />
          </div>
          <FormButton action={handleForm} text={'Sign in'} />
        </form>
        <div className='flex flex-col justify-center items-center'>
          <span className='font-light text-xl'>Don't have an account?</span>
          <button onClick={() => selectMultiplayerMode('signup')} className='font-light text-xl text-blue-500 text-center underline'>Create yours now.</button>
        </div>
      </div>
      <ArrowButton action={() => selectMultiplayerMode('menu')} />
    </>
  )
}

export default SignIn
