import Popup from "reactjs-popup"
import "reactjs-popup/dist/index.css"
import { useAuthValue } from "AuthContext"
import { useState } from "react"
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import {  db } from "lib/firebase"
import { useVisitors } from "VisitorContext"
import moment from "moment"


function Profile({profilePopupOpen, closeProfile}) {
  const { setTimeActive} = useAuthValue()
  const {base, setDodaac, bases, userDocs} = useVisitors()
  const [base2, setBase2] = useState()
  const [areas, setAreas] = useState()
  const [area, setArea] = useState()
  const [cooldown, setCooldown] = useState(true)

  const loadAreas = (base) => {
    console.log("#READ DATABASE")
    const ref = query(collection(db, "DODAACS"), where("base", "==", base))
    getDocs(ref).then(base => {
      const areas = []
      base.docs.map(base => {areas.push(base.data())})
      setAreas(areas)
    })

    if(moment(userDocs.data().lastChangedBase.seconds * 1000).diff(new Date(), "d") <= -90) {setCooldown(false)}
  }

  async function updateProfle(e) {
    e.preventDefault()

    if (document.getElementById("profileBase").value !== base.base) {
        updateDoc(doc(db, "users", userDocs.id), {
            base: document.getElementById("profileBase").value,
            area: document.getElementById("profileArea").value,
            lastChangedBase: new Date(),
        }).then((r) => setDodaac({base: document.getElementById("profileBase").value, area: document.getElementById("profileArea").value}))
    } else {
        updateDoc(doc(db, "users", userDocs.id), {
            area: document.getElementById("profileArea").value,
        }).then((r) => setDodaac({base: base.base, area: document.getElementById("profileArea").value}))
    }
  }

  return (
    <>
    <Popup modal closeOnDocumentClick={false} open={profilePopupOpen} className="visitors" onOpen={() => loadAreas(base.base)}>
      {
        <div>
            <h3>Profile</h3>
            <button id="closeSubmitVisitor" style={{position:"absolute", top:"10px", right:"10px"}} onClick={() =>  {closeProfile(); setTimeActive(new Date())}}>X</button>
            <form onSubmit={updateProfle}>
                <p style={{fontStyle: "bold"}}>Base</p>
                <select id="profileBase" required onChange={e => {setBase2(e.target.value); loadAreas(e.target.value)}} defaultValue={base.base} disabled={cooldown}>
                {bases !== undefined && bases.map(docSnap => 
                        <option key={docSnap.base}>{docSnap.base}</option>
                    )}
                </select>
                <p style={{fontSize: "10px"}}>Note: You must wait at least 90 days between each base change!</p>
                <p style={{fontStyle: "bold"}}>Area</p>
                <select id="profileArea" required onChange={e => {setArea(e.target.value)}} defaultValue={base.area}>
                {areas !== undefined && areas.map(docSnap => 
                        <option key={docSnap.area}>{docSnap.area}</option>
                    )}
                </select>
                <span><a href='/register-base' style={{textDecoration: "none", color: "#1976d2", fontSize: "12px"}}>Register New Area</a></span>
                <button type='submit' id="submitProfile" >Save</button>
            </form>
        </div>
      }
    </Popup>
    </>
  )
}

export default Profile
