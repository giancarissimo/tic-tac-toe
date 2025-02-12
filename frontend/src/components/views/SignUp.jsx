import { useNavigationStore } from '../../store/navigation'
import { useState, useEffect } from 'react'
import { postData } from '../../utils/PostData'
import envconfig from '../../config/env.config'
import Input from '../common/inputs/Input'
import FormButton from '../common/gameNavigation/FormButton'
import ButtonNavigation from '../common/gameNavigation/ButtonNavigation'
import ArrowButton from '../common/gameNavigation/ArrowButton'

const SignUp = () => {
  const { api_register } = envconfig
  const { selectMultiplayerMode } = useNavigationStore()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const validateFields = () => {
    const newErrors = {}

    if (!username.trim()) {
      newErrors.username = 'Username is required'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is not valid'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    return newErrors
  }

  useEffect(() => {
    // Validación dinámica en tiempo real
    const newErrors = validateFields()
    setErrors(newErrors)
  }, [username, email, password])

  const handleForm = (e) => {
    e.preventDefault()
    const formErrors = validateFields()

    if (Object.keys(formErrors).length > 0) {
      return setErrors(formErrors)
    }

    const newUser = {
      username: username,
      email: email,
      password: password
    }

    postData(api_register, newUser, 'POST')
      .then(data => {
        if (data.status === 'Error') {
          return setErrors({ username: data.errors.username, email: data.errors.email })
        }
        setSuccess(true)
      })
  }

  return (
    <>
      {!success ? (
        <>
          <div className='w-full h-full flex flex-col justify-start items-center gap-2'>
            <form className='w-auto flex flex-col justify-center items-start'>
              <div>
                <h2 className='font-semibold'>Sign up</h2>
                <p className='font-light text-xl'>To access to exclusive features</p>
              </div>
              <div className="flex flex-col h-[70px]">
                <span className='text-red-700 text-base min-h-[24px]'>{errors.username && errors.username}</span>
                <Input action={setUsername} id={'username'} type={'text'} placeholder={'Username'} />
              </div>
              <div className="flex flex-col h-[70px]">
                <span className='text-red-700 text-base min-h-[24px]'>{errors.email && errors.email}</span>
                <Input action={setEmail} id={'email'} type={'email'} placeholder={'Email'} />
              </div>
              <div className="flex flex-col h-[70px] mb-5">
                <span className='text-red-700 text-base min-h-[24px]'>{errors.password && errors.password}</span>
                <Input action={setPassword} id={'password'} type={'password'} placeholder={'Password'} />
              </div>
              <FormButton action={(e) => handleForm(e)} text={'Sign up'} />
            </form>
          </div>
          <ArrowButton action={() => selectMultiplayerMode('signin')} />
        </>
      ) : (
        <div className='w-full flex flex-col justify-start items-center text-center gap-4'>
          <div className='w-full flex justify-center items center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="0.8" stroke="currentColor" className="size-20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h2 className='font-semibold text-3xl'>Success</h2>
          <span>Congratulations, your account has been successfully created</span>
          <nav className='w-full flex justify-end items-center mt-4'>
            <ButtonNavigation action={() => selectMultiplayerMode('signin')} text={'Continue'} />
          </nav>
        </div>
      )}
    </>
  )
}

export default SignUp
