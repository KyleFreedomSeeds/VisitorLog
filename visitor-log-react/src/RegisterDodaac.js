import {useState} from 'react'
import 'css/forms.css'
import { db} from 'lib/firebase'
import {useNavigate} from 'react-router-dom'
import { collection, query } from "firebase/firestore"
import { useFirestoreCollectionMutation, useFirestoreQueryData} from '@react-query-firebase/firestore'
import { useForm } from 'react-hook-form'
import { useVisitors } from 'VisitorContext'


function RegisterDodaac() {
  const {base} = useVisitors()
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
      if (data.base === undefined) {var baseString = document.getElementById("baseEntry").value} else {var baseString = data.base.toUpperCase()}
      console.log("#WROTE DATABASE")
      dodaacMutation.mutate({
        base:  baseString,
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
            id='baseEntry'
            placeholder='Enter Base (Nellis AFB)'
            value={base.base}
            disabled={base.length !== 0}
            {...register("base")}/>
            
          <button type='submit'>Register Base/Area</button>
        </form>
      </div>
    </div>
  )
}

export default RegisterDodaac