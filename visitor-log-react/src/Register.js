import {useEffect, useState} from 'react'
import 'css/forms.css'
import {auth, db} from 'lib/firebase'
import {useNavigate} from 'react-router-dom'
import {createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth'
import {useAuthValue} from './AuthContext'
import { handleFirebaseError } from 'lib/firebase'
import { collection, query } from "firebase/firestore"
import { useFirestoreCollectionMutation} from '@react-query-firebase/firestore'
import { collectionData } from 'rxfire/firestore'


function Register() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [base, setBase] = useState('')
  const [bases, setBases] = useState()
  const [error, setError] = useState('')
  const [longEnough, setLongEnough] = useState(false)
  const [validEmail, setValidEmail] = useState(false)
  const [passMatch, setPassMatch] = useState(false)
  const [lowerCaseV, setLowerCaseV] = useState(false)
  const [upperCaseV, setUpperCaseV] = useState(false)
  const [numberV, setNumberV] = useState(false)
  const [symbolV, setSymbolV] = useState(false)
  const [isValid, setisValid] = useState(false)
  const navigate = useNavigate()
  const {setTimeActive} = useAuthValue()
  const userRef = query(collection(db, "users"))
  const userMutation = useFirestoreCollectionMutation(userRef)

  var lowerCase = /[a-z]/g
  var upperCase = /[A-Z]/g
  var number = /[0-9]/g
  var symbol = /\W/g

  if (password.match(lowerCase) && !lowerCaseV) {setLowerCaseV(true)}else if (!password.match(lowerCase) && lowerCaseV){setLowerCaseV(false)}
  if (password.match(upperCase) && !upperCaseV) {setUpperCaseV(true)}else if (!password.match(upperCase) && upperCaseV){setUpperCaseV(false)}
  if (password.match(number) && !numberV) {setNumberV(true)}else if (!password.match(number) && numberV){setNumberV(false)}
  if (password.match(symbol) && !symbolV) {setSymbolV(true)}else if (!password.match(symbol) && symbolV){setSymbolV(false)}
  if (password.length >= 8 && !longEnough) {setLongEnough(true)}else if(password.length < 8 && longEnough){setLongEnough(false)}
  if (email.substring(email.length - 4, email.length) === ".mil" && !validEmail) {setValidEmail(true)}else if(email.substring(email.length - 4, email.length) !== ".mil" && validEmail){setValidEmail(false)}
  if (password !== '' && confirmPassword !== '' && password === confirmPassword && !passMatch){setPassMatch(true)}else if (password !== '' && confirmPassword !== '' && password !== confirmPassword && passMatch){setPassMatch(false)}
  if (longEnough && validEmail && passMatch && lowerCaseV && upperCaseV && numberV && symbolV && base!== undefined && !isValid) {setisValid(true)}else if ((!longEnough || !validEmail || !passMatch|| !lowerCaseV || !upperCaseV || !numberV|| !symbolV) && isValid) {setisValid(false)}
  
  useEffect(() => {
    console.log("#READ DATABASE")
    const ref = query(collection(db, "DODAACS"))
    //getDocs(ref).then(base => {base.docs.map(doc => setBase(doc.data()))}) WORK UNSUBSCRIBE
    collectionData(ref, {idField: 'id'}).subscribe(bases => setBases(bases.reduce((unique,o) => {
      if(!unique.some(obj => obj.base === o.base)) {unique.push(o)} return unique},[])))
  },[])

  const register = e => {
    e.preventDefault()
    setError('')
      // Create a new user with email and password using firebase
    createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log("#WROTE DATABASE")
      userMutation.mutate({
        base: base,
        area: "*",
        lastChangedBase: new Date(),
        uid: auth.currentUser.uid,
      }
      )
      sendEmailVerification(auth.currentUser)   
      .then(() => {
        setTimeActive(true)
        navigate('/verify-email')
      }).catch((err) => alert(err.message))
    })
    .catch(err => setError(handleFirebaseError(err.message)))
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
            
            <select required onChange={e => {setBase(e.target.value)}}>
            <option>Select Base..</option>
              {bases !== undefined && bases.map(docSnap => 
                    <option key={docSnap.base}>{docSnap.base}</option>
                  )}
            </select>
        <button disabled={!isValid} type='submit' id='registerButton'>Register</button>
          { !validEmail && <p style={{color: 'red', margin: 0}}>You must use a .mil email address!</p>}
          { !longEnough && <p style={{color: 'red', margin: 0}}>Password must be at least 8 characters!</p>}
          { !upperCaseV && <p style={{color: 'red', margin: 0}}>Password must contain at least 1 uppercase letter!</p>}
          { !lowerCaseV && <p style={{color: 'red', margin: 0}}>Password must contain at least 1 lowercase letter</p>}
          { !numberV && <p style={{color: 'red', margin: 0}}>Password must contain at least 1 number!</p>}
          { !symbolV && <p style={{color: 'red', margin: 0}}>Password must contain at least 1 symbol!</p>}
          { !passMatch && <p style={{color: 'red', margin: 0}}>Password must match!</p>}
          { base === undefined && <p style={{color: 'red', margin: 0}}>You must select a Base!</p>}
          <span><a href='/login' style={{textDecoration: "none", color: "#1976d2"}}>Login to existing Account </a></span>
          <span><a href='/register-base' style={{textDecoration: "none", color: "#1976d2"}}>Register New Base</a></span>
        </form>  
      </div>
    </div>
  )
}

export default Register