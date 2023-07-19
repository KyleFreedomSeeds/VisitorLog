import {useState} from 'react'
import 'css/forms.css'
import { db} from 'lib/firebase'
import {useNavigate} from 'react-router-dom'
import { collection, query } from "firebase/firestore"
import { useFirestoreCollectionMutation, useFirestoreQueryData} from '@react-query-firebase/firestore'
import { useForm } from 'react-hook-form'


function RegisterDodaac() {

  const [error, setError] = useState('')
  const navigate = useNavigate()
  console.log("#READ DATABASE")
  const ref = query(collection(db, "DODAACS"))
  const dodaacs = useFirestoreQueryData(["dodaacs"], ref,{subscribe: false})
  const dodaacMutation = useFirestoreCollectionMutation(ref)
  const { register, reset, handleSubmit} = useForm()


  function registerDodaac(data) {
    setError('')
    const dodaacFormat = /^[A-Z]{2}[0-9]{4}/gmi.exec(data.dodaac)
    if (dodaacFormat.input !== dodaacFormat[0]) {setError("DODAAC must be in the correct format. ex: FV4852")}
    dodaacs.data.map(dodaac => {
      if (dodaac.dodaac === data.dodaac) {
        setError("DODAAC already exists!")
      }
      return null
    })

    if (error === '') {
      console.log("#WROTE DATABASE")
      dodaacMutation.mutate({
        base: data.base.toUpperCase(),
        dodaac: data.dodaac.toUpperCase(),
        squadron: data.squadron.toUpperCase()
      })
      navigate("/login")
      reset()
    }
  }

  return (
    <div className='center'>
      <div className='auth'>
        <h1>Register New Dodaac</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={handleSubmit(registerDodaac)} name='dodaac_registration_form'>
          <input 
            type='text'
            id="formDodaac"
            name="formDodaac"
            placeholder="Enter DODAAC (FV4852)"
            required
            maxLength={6}
            {...register("dodaac")}/>
            
          <input 
            type='text'
            required
            placeholder='Enter Squadron (57 MUNS)'
            {...register("squadron")}/>

            <input 
            type='text'
            required
            placeholder='Enter Base (Nellis AFB)'
            {...register("base")}/>
            
          <button type='submit'>Register DODAAC</button>
        </form>
      </div>
    </div>
  )
}

export default RegisterDodaac