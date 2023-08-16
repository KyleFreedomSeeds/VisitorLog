import { useFirestoreCollectionMutation } from "@react-query-firebase/firestore"
import { collection} from "firebase/firestore"
import { db, analytics } from "lib/firebase"
import { useFormContext } from "react-hook-form"
import Popup from "reactjs-popup"
import "reactjs-popup/dist/index.css"
import { logEvent } from "firebase/analytics"
import { useVisitors } from "VisitorContext"
import { useAuthValue } from "AuthContext"
import { useState } from "react"


function SubmitvisitorModal({submitPopupOpen, closeSubmitModal, setSubmitPopupOpen, setBarcodePopupOpen, disabled}) {
  const {setTimeActive} = useAuthValue()
  const ref = collection(db, "visitors")
  const mutation = useFirestoreCollectionMutation(ref)
  const { register, reset, handleSubmit, formState, getValues, setValue} = useFormContext()
  const {visitors, base} = useVisitors()
  const [visitorLoc, setVisitorLoc] = useState(["", "", ""])
  const [existingOrg, existingDest, existingEscort] = visitorLoc

  async function submit(data) {
    console.log(data.multiple)
    setTimeActive(new Date())
    document.getElementById("submitNewVisitor").setAttribute("disabled", "disabled")
      validateVisitor(data).then(valid => {
        if (valid !== null) {
          console.log("#WROTE DATABASE")
          mutation.mutate({
            name: data.name.toUpperCase(),
            rank: data.rank.toUpperCase(),
            badge: parseInt(data.badge),
            org: data.org.toUpperCase(),
            dest: data.dest.toUpperCase(),
            escort: data.escort.toUpperCase(),
            created: new Date(),
            signedOut: "null",
            base: base.base,
            area: base.area,
          })
          if(data.multiple) {
            setVisitorLoc([data.org, data.dest, data.escort])
            closeSubmitModal()
            setBarcodePopupOpen(o => !o)
            setValue('name', '')
            setValue('rank', '')
            setValue('badge', '')
          } else {
            setVisitorLoc(["", "", ""])
            reset()
            closeSubmitModal()
          }
          logEvent(analytics, "visitor_sign_in")
        }
        document.getElementById("submitNewVisitor").removeAttribute("disabled")
      })
    }

    function searchInObject(obj, searchValue) {
      var found = false
      obj.forEach(element => {
        if(element["name"] === searchValue && element["signedOut"] === "null") {found = true}
        if(element["badge"] === searchValue && element["signedOut"] === "null") {found =  true}
      });

      return found
    }

    async function validateVisitor(data) {
      const name = data.name.toUpperCase()
      const badge = parseInt(data.badge)
      
      var nameCheck = searchInObject(visitors, name);
      var badgeCheck = searchInObject(visitors, badge);

      if(nameCheck) {
          alert("There is already a user signed in with this name!")
          return null
      } 

      if(badgeCheck) {
          alert("This badge is already signed in!")
          return null
      } 
  
      return "valid"
  }

  return (
    <>
    <button disabled={disabled} id="manualSubmit" onClick={() => setSubmitPopupOpen(o => !o)}>Manual Submit</button>
    <Popup modal closeOnDocumentClick={false} open={submitPopupOpen} className="visitors" onOpen={() => {if(getValues("name") !== "") {document.getElementById("formbadge").focus()}else(document.getElementById('formName').focus())}} onClose={() => {reset()}}>
      {
        <div>
          <h3>New Visitor</h3>
          <button id="closeSubmitVisitor" style={{position:"absolute", top:"10px", right:"10px"}} onClick={() =>  {closeSubmitModal(); setTimeActive(new Date())}}>X</button>
          <form onSubmit={handleSubmit(data => {submit(data)})}>
            <input type="text" name="formName" id="formName" required placeholder="Full Name" {...register("name", {pattern: {value: /^[^0-9]+$/i, message: "Name must not contain numbers!"}})}/>
            {formState.errors.name && <label className="error" htmlFor="formName">{formState.errors.name.message}</label>}

            <input type="text" name="formRank" id="formRank" required placeholder="Rank"{...register("rank")}/>

            <input type="number" name="formBadge" id="formbadge" required placeholder="Badge"{...register("badge", {min: {value: 1,  message: "Value must be greater than 0!"}, max: {value: 999, message: "Value must be less than 999!"}})}/>
            {formState.badge && <label className="error" htmlFor="formBadge">{formState.badge.message}</label>}

            <input type="text" name="formOrg" id="formOrg" required placeholder="Organization" defaultValue={existingOrg} {...register("org")}/>

            <input type="text" name="formDest" id="formDest" required placeholder="Destination" defaultValue={existingDest} {...register("dest")}/>

            <input type="text" name="formEscort" id="formEscort" required placeholder="Escort" defaultValue={existingEscort} {...register("escort", {pattern: {value: /^[A-Za-z]+$/i, message: "Escort must not contain numbers!"}})}/>
            {formState.escort && <label className="error" htmlFor="formEscort">{formState.escort.message}</label>}
            <label style={{display: "flex", fontSize: "9pt", alignItems: "left"}}>
            <input type="checkbox" name="formMultiple" id="formMultiple" {...register("multiple")} style={{margin: "0px", marginRight: "1px", width: "5%"}}/>Copy Forward Multi-Personnel Info
            </label>
            <button type='submit' id="submitNewVisitor" >Sign In Personnel</button>
            </form>
            
        </div>
      }
    </Popup>
    </>
  )
}

export default SubmitvisitorModal
