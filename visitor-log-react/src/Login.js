import {useState} from 'react'
import 'css/forms.css'
import {signInWithEmailAndPassword, sendEmailVerification} from 'firebase/auth'
import {auth} from 'lib/firebase'
import {useNavigate} from 'react-router-dom'
import {useAuthValue} from './AuthContext'
import { handleFirebaseError } from 'lib/firebase'


function Login(){

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('') 
  const [error, setError] = useState('')
  const {setTimeActive} = useAuthValue()
  const navigate = useNavigate()

  const login = e => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      if(!auth.currentUser.emailVerified) {
        sendEmailVerification(auth.currentUser)
        .then(() => {
          setTimeActive(true)
          navigate('/verify-email')
        })
      .catch(err => alert(err.message))
    }else{
      navigate('/')
    }
    })
    .catch(err => setError(handleFirebaseError(err.message)))
  }

  return(
    <div className='center'>
      <div className='auth'>
        <h1>Log in</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={login} name='login_form'>
          <input 
            type='email' 
            value={email}
            required
            placeholder="Enter your email"
            onChange={e => setEmail(e.target.value)}/>

          <input 
            type='password'
            value={password}
            required
            placeholder='Enter your password'
            onChange={e => setPassword(e.target.value)}/>

          <button type='submit'>Login</button>
        </form>
        <p>
          Don't have an account? 
          <a href='/register' style={{textDecoration: "none", color: "#1976d2"}}> Register</a>
        </p>
        <p>
          Forgot your password?
          <a href='/reset-password' style={{textDecoration: "none", color: "#1976d2"}}> Reset Password</a>
        </p>
      </div>
    </div>
  )
}

export default Login