import {useState} from 'react'
import 'css/forms.css'
import {auth, db} from 'lib/firebase'
import {useNavigate, Link} from 'react-router-dom'
import {createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth'
import {useAuthValue} from './AuthContext'
import { handleFirebaseError } from 'lib/firebase'
import { collection, query } from "firebase/firestore"
import { useFirestoreQuery, useFirestoreCollectionMutation} from '@react-query-firebase/firestore'


function Register() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [dodaac, setDodaac] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const {setTimeActive} = useAuthValue()
  const ref = query(collection(db, "DODAACS"))
  const dodaacs = useFirestoreQuery(["dodaacs"], ref)
  const userRef = query(collection(db, "users"))
  const userMutation = useFirestoreCollectionMutation(userRef)

  const validatePassword = () => {
    let isValid = true
    if (password !== '' && confirmPassword !== ''){
      if (password !== confirmPassword) {
        isValid = false
        setError('Passwords does not match')
      }
    }

    if (dodaac === '' || dodaac === "Select Dodaac..") {
      isValid = false
      setError('DODAAC is required!')
    }
    return isValid
  }

  const register = e => {
    e.preventDefault()
    setError('')
    if(validatePassword()) {
      // Create a new user with email and password using firebase
        createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          sendEmailVerification(auth.currentUser)   
          .then(() => {
            userMutation.mutate({
              dodaac: dodaac,
              uid: auth.currentUser.uid}
            )
            setTimeActive(true)
            navigate('/verify-email')
          }).catch((err) => alert(err.message))
        })
        .catch(err => setError(handleFirebaseError(err.message)))
    }
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className='center'>
      <div className='auth'>
        <h1>Register</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={register} name='registration_form'>
          <input 
            type='email' 
            value={email}
            placeholder="Enter your email"
            required
            onChange={e => setEmail(e.target.value)}/>

          <input 
            type='password'
            value={password} 
            required
            placeholder='Enter your password'
            onChange={e => setPassword(e.target.value)}/>

            <input 
            type='password'
            value={confirmPassword} 
            required
            placeholder='Confirm password'
            onChange={e => setConfirmPassword(e.target.value)}/>
            
            <select onChange={e => setDodaac(e.target.value)}>
              <option key="select">Select Dodaac..</option>
              {dodaacs.status === "success" && dodaacs.data.docs.map(docSnap => 
                    <option key={docSnap.data().dodaac}>{docSnap.data().dodaac}</option>
                  )}
            </select>
          <button type='submit'>Register</button>
        </form>
        <span>
          Already have an account?  
          <Link to='/login'>login</Link>
        </span>
        <span>
          DODAAC not listed?
          <Link to='/register-dodaac'> Register New Dodaac</Link>
        </span>
      </div>
    </div>
  )
}

export default Register