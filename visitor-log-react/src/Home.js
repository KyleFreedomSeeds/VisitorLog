import {useAuthValue} from './AuthContext'
import { signOut } from 'firebase/auth' 
import { auth, db } from 'lib/firebase'
import { collection, query, where } from "firebase/firestore"
import SubmitvisitorModal from 'SubmitVisitorModal'
import { SignVisitorOut } from 'lib/SignVisitorOut'
import { cardScan } from 'lib/cardScanning'
import { FormProvider, useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { collectionData } from 'rxfire/firestore';
import { combineLatest, switchMap } from 'rxjs'

function Home() {
  //const {currentUser} = useAuthValue()
  //console.log(currentUser)
  const [visitors, setVisitors] = useState()
  const submitVisitor = useForm()
  const dodaacRef = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
  
  useEffect(() => {
    collectionData(dodaacRef, { idField: 'id' })
    .pipe(
      switchMap(dodaacs => {
        return combineLatest(dodaacs.map(d => {
          const ref = query(collection(db, "visitors"), where("signedOut", "==", "null"), where("dodaac", "==", d.dodaac))
          return  collectionData(ref, {idField: 'id'})
        }));
      })
    )
    .subscribe(dodaac => 
      setVisitors(dodaac[0])
    );
  },[])

  const scanId = barcode => {
    if (barcode !== null) {
      cardScan(barcode).then(visitorInfo => {
        if (visitorInfo !== null) {
          document.getElementById("manualSubmit").click()
          console.log(visitorInfo)
          if ("FMN" in visitorInfo) {
            submitVisitor.setValue("name", visitorInfo["FMN"])
          } else {
            submitVisitor.setValue("name", visitorInfo["LN"] + " " + visitorInfo["FN"] + " " + visitorInfo["MI"].substring(0,1))
          }
          submitVisitor.setValue("rank", visitorInfo["Rank"])
          submitVisitor.setFocus("badge", {shouldSelect: true})
        }
      })
    }
  }

  return (
      <div>
        <div>
          <h1>Visitor Log</h1>
          <span onClick={() => signOut(auth)}>Sign Out</span>
        </div>
        <div>
          <button onClick={() => {let barcode = prompt("Scan ID"); scanId(barcode)}}>Scan ID</button>
          <FormProvider {...submitVisitor}>
            <SubmitvisitorModal/>
          </FormProvider>
          <button onClick={() => {let badge = prompt("Enter Badge Number"); SignVisitorOut(badge)}}>Sign Visitor Out</button>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Rank</th>
                <th>Organization</th>
                <th>Destination</th>
                <th>Escort</th>
                <th>Badge</th>
                <th>Signed In At</th>
              </tr>
            </thead>
            <tbody>
            {visitors === undefined && <tr><td>Loading...</td></tr>}
            {visitors !== undefined && visitors.map(visitor => {
              const date = new Date(visitor.created.seconds * 1000).toLocaleString();
              return(
              <tr key={visitor.id}>
                  <td>{visitor.name}</td>
                  <td>{visitor.rank}</td>
                  <td>{visitor.org}</td>
                  <td>{visitor.dest}</td>
                  <td>{visitor.escort}</td>
                  <td>{visitor.badge}</td>
                  <td>{date}</td>
              </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>
  )
}

export default Home
