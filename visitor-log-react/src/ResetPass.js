import {useState} from 'react'
import 'css/forms.css'
import {auth} from 'lib/firebase'
import {useNavigate} from 'react-router-dom'
import {sendPasswordResetEmail} from 'firebase/auth'
import {useAuthValue} from './AuthContext'
import { handleFirebaseError } from 'lib/firebase'

function ResetPass() {

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const {setTimeActive} = useAuthValue()

  const resetPassword = e => {
    e.preventDefault()
    setError('')
    // Create a new user with email and password using firebase
    sendPasswordResetEmail(auth, email)
        .then(() => {
          setTimeActive(true)
          alert("Password reset email sent!")
          navigate('/login')
      })
      .catch(err => setError(handleFirebaseError(err.message)))
    setEmail('')
  }

  return (
    <div className='center'>
      <div className='auth'>
        <h1>Reset Password</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={resetPassword} name='registration_form'>
          <input 
            type='email' 
            value={email}
            placeholder="Enter your email"
            required
            onChange={e => setEmail(e.target.value)}/>

          <button type='submit'>Send Password Reset Email</button>
        </form>
        <span> 
          <a href='/login' style={{textDecoration: "none", color: "#1976d2"}}>Login to existing Account </a>
        </span>
      </div>
    </div>
  )
}

export default ResetPass