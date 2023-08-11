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
    dodaacs.data.map(dodaac => {
      if (dodaac.area === data.area && dodaac.base === data.base) {
        setError("Area already exists!")
      }
      return null
    })

    if (error === '') {
      console.log("#WROTE DATABASE")
      dodaacMutation.mutate({
        base: data.base.toUpperCase(),
        area: data.area.toUpperCase(),
      })
      navigate("/login")
      reset()
    }
  }

  return (
    <div className='center'>
      <div className='auth'>
        <h2>Register New Base/Area</h2>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={handleSubmit(registerDodaac)} name='dodaac_registration_form'>
          <input 
            type='text'
            id="formDodaac"
            name="formDodaac"
            placeholder="Enter Area (57 MUNS MSA)"
            required
            maxLength={15}
            {...register("area")}/>

            <input 
            type='text'
            required
            placeholder='Enter Base (Nellis AFB)'
            {...register("base")}/>
            
          <button type='submit'>Register Base/Area</button>
        </form>
      </div>
    </div>
  )
}

export default RegisterDodaac