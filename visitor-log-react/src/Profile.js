import Popup from "reactjs-popup"
import "reactjs-popup/dist/index.css"
import { useAuthValue } from "AuthContext"
import { useRef, useState } from "react"
import { useEffect } from "react"
import { collection, doc, query, updateDoc, where } from "firebase/firestore"
import { collection as collectionrx, collectionData } from "rxfire/firestore"
import {  db } from "lib/firebase"
import { useVisitors } from "VisitorContext"
import moment from "moment"


function Profile({profilePopupOpen, closeProfile}) {
  const {currentUser, setTimeActive} = useAuthValue()
  const {base, setDodaac} = useVisitors()
  const [bases, setBases] = useState()
  const [base2, setBase2] = useState()
  const [areas, setAreas] = useState()
  const [area, setArea] = useState()
  const [userDocs, setUserDocs] = useState()
  const [cooldown, setCooldown] = useState(true)
  const userRef = query(collection(db, "users"), where("uid", "==", currentUser.uid))

  useEffect(() => {
    console.log("#READ DATABASE")
    const ref = query(collection(db, "DODAACS"))
    //getDocs(ref).then(base => {base.docs.map(doc => setBase(doc.data()))}) WORK UNSUBSCRIBE
    collectionData(ref, {idField: 'id'}).subscribe(bases => setBases(bases.reduce((unique,o) => {
        if(!unique.some(obj => obj.base === o.base)) {unique.push(o)} return unique},[])))
    //getDocs(ref).then(base => {base.docs.map(doc => setBase(doc.data()))}) WORK UNSUBSCRIBE
    collectionrx(userRef).subscribe(user => setUserDocs(user)) 
  },[])

  const loadAreas = (base) => {
    console.log("#READ DATABASE")
    const ref = query(collection(db, "DODAACS"), where("base", "==", base))
    //getDocs(ref).then(base => {base.docs.map(doc => setBase(doc.data()))}) WORK UNSUBSCRIBE
    collectionData(ref, {idField: 'id'}).subscribe(areas => setAreas(areas))

    if(moment(userDocs[0].data().lastChangedBase.seconds * 1000).diff(new Date(), "d") <= -90) {setCooldown(false)}
  }

  async function updateProfle(e) {
    e.preventDefault()

    if (document.getElementById("profileBase").value !== base.base) {
        updateDoc(doc(db, "users", userDocs[0].id), {
            base: document.getElementById("profileBase").value,
            area: document.getElementById("profileArea").value,
            lastChangedBase: new Date(),
        }).then((r) => setDodaac({base: document.getElementById("profileBase").value, area: document.getElementById("profileArea").value}))
    } else {
        updateDoc(doc(db, "users", userDocs[0].id), {
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
                <select id="profileBase" required onChange={e => {setBase2(e.target.value); loadAreas(e.target.value)}} placeholder={base.base} disabled={cooldown}>
                {bases !== undefined && bases.map(docSnap => 
                        <option key={docSnap.base}>{docSnap.base}</option>
                    )}
                </select>
                <p style={{fontSize: "10px"}}>Note: You must wait at least 90 days between each base change!</p>
                <p style={{fontStyle: "bold"}}>Area</p>
                <select id="profileArea" required onChange={e => {setArea(e.target.value)}}>
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
