import {useAuthValue} from './AuthContext'
import { signOut } from 'firebase/auth' 
import { auth } from 'lib/firebase'
import SubmitvisitorModal from 'SubmitVisitorModal'
import { SignVisitorOut } from 'lib/SignVisitorOut'
import { cardScan } from 'lib/cardScanning'
import { FormProvider, useForm } from 'react-hook-form'
import { useState} from 'react'
import "css/home.css"
import moment from 'moment/moment'
import ReactDatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import Popup from 'reactjs-popup'
import { useVisitors } from 'VisitorContext'
import { Timeout } from 'Timeout'
import { PDFDownloadLink } from '@react-pdf/renderer'
import VisitorPDF from '1109Generation/VisitorPDF'
import Profile from 'Profile'

function Home() {
  const {currentUser, setTimeActive} = useAuthValue()
  const {visitors, visitorsQuery, base, userDocs} = useVisitors()
  const submitVisitor = useForm()
  const submitBarcode = useForm()
  const signOutVisitor = useForm()
  const [dateError, setDateError] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [barcodePopupOpen, setBarcodePopupOpen] = useState(false)
  const [submitPopupOpen, setSubmitPopupOpen] = useState(false)
  const [profilePopupOpen, setProfilePopupOpen] = useState(false)
  const [startDate, endDate] = dateRange

  const closeBarcodeModal = () => setBarcodePopupOpen(false)
  const closeSubmitModal = () => setSubmitPopupOpen(false)
  const closeProfile = () => setProfilePopupOpen(false)

  function scanId(data) {
    if (data.barcode !== null && data.barcode !== "") {
      cardScan(data.barcode, visitors).then(visitorInfo => {
        if (visitorInfo !== null) {
          submitBarcode.reset()
          document.getElementById("closeBarcode").click()
          document.getElementById("manualSubmit").click()
          if ("FMN" in visitorInfo) {
            submitVisitor.setValue("name", visitorInfo["FMN"])
          } else {
            submitVisitor.setValue("name", visitorInfo["LN"] + " " + visitorInfo["FN"] + " " + visitorInfo["MI"].substring(0,1))
          }
          submitVisitor.setValue("rank", visitorInfo["Rank"])
        }
      })
    }
  }
 
  const name = currentUser.email.split(".")
  var profileName = name[0].charAt(0).toUpperCase() + name[0].slice(1) + " "
  if (name[1].indexOf("@") === -1) {profileName = profileName + name[1].charAt(0).toUpperCase() + name[1].slice(1)} else {profileName = profileName + name[1].charAt(0).toUpperCase() + name[1].slice(1, name[1].indexOf("@"))}
  return (
      <div className="body">
        <div className="header">
          <h1>Visitor Log</h1>
          <h3>{base.base} -- {userDocs === "undefined" || userDocs?.data().area === "*" ? "YOU MUST CONFIGURE AN AREA" : base.area}</h3>
          <p>{profileName}<span onClick={() => {setProfilePopupOpen(true)}}>Profile</span><span onClick={() => {visitorsQuery.current.unsubscribe(); signOut(auth)}}>Sign Out</span></p>
          <Profile profilePopupOpen={profilePopupOpen} setProfilePopupOpen={setProfilePopupOpen} closeProfile={closeProfile}/>
        </div>
        <div className="buttons">
        <button disabled={userDocs?.data().area === "*"} id="scanBarcode" onClick={() => setBarcodePopupOpen(o => !o)}>Scan ID</button>
        <Popup closeOnDocumentClick={false} modal className="visitors" open={barcodePopupOpen} onOpen={() => document.getElementById("formBarcode").focus()} onClose={() => submitBarcode.reset()}>
            {
              <div>
                <h3>Scan ID</h3>
                <button id='closeBarcode' style={{position:"absolute", top:"10px", right:"10px"}} onClick={() =>  {submitBarcode.reset(); closeBarcodeModal(); setTimeActive(new Date())}}>X</button>
                <form onSubmit={submitBarcode.handleSubmit(scanId)}>
                  <input type="text" name="formBarcode" id="formBarcode" required placeholder="Barcode" {...submitBarcode.register("barcode")}/>
                  {submitBarcode.formState.errors.name && <label className="error" htmlFor="formBarcode">{submitBarcode.formState.errors.name.message}</label>}

                  <button type="submit" id="submitBarcode">Submit</button>
                </form>
              </div>
            }
          </Popup>
          <FormProvider {...submitVisitor}>
            <SubmitvisitorModal setBarcodePopupOpen={setBarcodePopupOpen} submitPopupOpen={submitPopupOpen} closeSubmitModal={closeSubmitModal} setSubmitPopupOpen={setSubmitPopupOpen} disabled={userDocs?.data().area === "*"}/>
          </FormProvider>
          <Popup trigger={<button disabled={userDocs?.data().area === "*"}>Sign Visitor Out</button>} modal closeOnDocumentClick={false} className='visitors' onOpen={() => document.getElementById("formBadgeOut").focus()} onClose={() => signOutVisitor.reset()}>
          {
            close => (
              <div>
                <h3>Sign Visitor Out</h3>
                <button style={{position:"absolute", top:"10px", right:"10px"}} onClick={() =>  {signOutVisitor.reset(); close(); setTimeActive(new Date())}}>X</button>
                <form onSubmit={signOutVisitor.handleSubmit(data => {SignVisitorOut(data, visitors); signOutVisitor.reset()})}>
                  <input type="text" name="formBadgeOut" id="formBadgeOut" required placeholder="Badge Number" {...signOutVisitor.register("badge")}/>
                  {signOutVisitor.formState.errors.name && <label className="error" htmlFor="formBadgeOut">{signOutVisitor.formState.errors.name.message}</label>}

                  <button type="submit" id="submitBarcode">Submit</button>
                </form>
              </div>
            )}
          </Popup>
          <Popup trigger={<button disabled={userDocs?.data().area === "*"}>Generate 1109</button>}>
            <ReactDatePicker required form="generate1109" placeholderText='Select 1109 Date Range' selectsRange={true} onChange={(update) => {setDateRange(update); setDateError(false)}} startDate={startDate} endDate={endDate} className='datePicker1109'/>
            <form id="generate1109" onSubmit={(e) => e.preventDefault()}>
                {dateError ? <p style={{color: "red", fontSize: "10pt"}}>Please select a date range!</p> : null}
                <button id='button1109'>
                <PDFDownloadLink document={<VisitorPDF startDate={startDate} endDate={endDate} base={base}/>} fileName={"1109 " + moment(startDate).format("DD MMM YY") + " - " + moment(endDate).format("DD MMM YY")} className='download1109' onClick={(e) => {
                  if (startDate == null || endDate == null) {
                    setDateError(true)
                    e.preventDefault()}
                  }}>{({loading}) => loading ? "Loading.." : "Download 1109"}</PDFDownloadLink>
                </button>
            </form>
          </Popup>
          <Timeout/>
        </div>
        {/* implement color coding based on time signed in */}
        <div className="table">
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
            {visitors !== undefined && visitors.map(visitor => {
              const date = moment(new Date(visitor.created.seconds * 1000)).format("DD MMM YY h:mm a")
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
          {visitors === undefined && <div className="loading-wheel"></div>}
        </div>
        
      </div>
  )
}

export default Home
