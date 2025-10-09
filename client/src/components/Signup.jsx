import React, { useState } from 'react'
import {motion} from 'framer-motion'
import Input from './Input'
import {Loader, Lock, Mail, User} from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import PasswordStrengthMeter from './PasswordStrengthMeter'
import { useAuthStore } from '../store/authStore'
 
const Signup = () => {
  const [firstName , setFirstName] = useState('')
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const {signup, error, isLoading} = useAuthStore()

    const handleSignUp = async(e)=>{
      e.preventDefault()
      try {
        await signup(email,password,firstName,lastName )
        navigate('/verify-email')
      } catch (error) {
        console.log(error)
      }
    }

    

    
  return (
    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className='signup max-w-md w-full bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-xl shadow-xl overflow-hidden'>
        <div className='p-8'>
          <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-emerald-500 text-transparent bg-clip-text'>Create Account</h2>
          <form onSubmit={handleSignUp}>
            <Input icon={User} type="text" placeholder="First Name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
            <Input icon={User} type="text" placeholder="Last Name" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
            <Input icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
            <PasswordStrengthMeter password={password}/>
            <motion.button className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-emerald-600 text-white text-xl font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-3 focus:ring-green-100 focus:ring-offset-4 focus:ring-offset-gray-900 transition duration-200' whileHover={{scale: 1.02}} whileTap={{scale:0.98}} type='submit' disabled={isLoading}>
            {isLoading ? <Loader className='animate-spin mx-auto size-8'/> : 'Sign up'}
            </motion.button>
          </form>
        </div>
        <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
          <p className='text-sm text-gray-400'>Already have an account?{" "}
            <Link to={"/login"} className='text-blue-400 hover:underline'>Login</Link>
          </p>
        </div>
    </motion.div>
  )
}

export default Signup